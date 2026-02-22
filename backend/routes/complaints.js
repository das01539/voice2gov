const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const Officer = require("../models/Officer");
const multer = require("multer");

/* ================= FILE STORAGE ================= */
const storage = multer.diskStorage({
destination:"uploads/",
filename:(req,file,cb)=>{
cb(null, Date.now()+"-"+file.originalname);
}
});
const upload = multer({storage:storage});


/* =========================================================
   🤖 AI AUTO ASSIGN COMPLAINT (MAIN BRAIN)
========================================================= */
router.post("/add", async (req,res)=>{
try{

let text = (req.body.title + " " + req.body.description).toLowerCase();

/* -------- DETECT DEPARTMENT -------- */
let department = "General";

if(text.includes("water")) department = "Water";
else if(text.includes("electricity") || text.includes("light")) department = "Electricity";
else if(text.includes("road") || text.includes("pothole")) department = "Roads";
else if(text.includes("garbage") || text.includes("sanitation")) department = "Sanitation";

/* -------- PRIORITY -------- */
let priority = "Low";

if(text.includes("urgent") || text.includes("emergency") || text.includes("hospital")){
priority="High";
}
else if(text.includes("2 days") || text.includes("not working")){
priority="Medium";
}

/* -------- LOCATION -------- */
let location = req.body.location || "Secunderabad";

/* -------- FIND OFFICER -------- */
let cleanDepartment = department.trim().toLowerCase();
let cleanLocation = location.trim().toLowerCase();

const officers = await Officer.find({
department: { $regex: new RegExp("^" + cleanDepartment + "$", "i") },
area: { $regex: new RegExp("^" + cleanLocation + "$", "i") }
});

console.log("Searching:",cleanDepartment,cleanLocation);
console.log("Found:",officers.length);

let assignedOfficer = null;

if(officers.length > 0){
assignedOfficer = officers.reduce((prev,current)=>
(prev.assignedCount < current.assignedCount)? prev : current
);

assignedOfficer.assignedCount += 1;
await assignedOfficer.save();
}

/* -------- DEADLINE -------- */
let deadline = new Date();
if(priority==="High") deadline.setHours(deadline.getHours()+24);
else if(priority==="Medium") deadline.setHours(deadline.getHours()+48);
else deadline.setHours(deadline.getHours()+72);

/* -------- SAVE -------- */
const newComplaint = new Complaint({
...req.body,
department,
priority,
location,
assignedTo: assignedOfficer ? assignedOfficer.name : "Not Assigned Yet",
status: assignedOfficer ? "In Progress":"Pending",
assignedTime: assignedOfficer ? new Date():null,
deadline
});

await newComplaint.save();

res.json({
message:"AI Auto Assigned",
assignedTo: assignedOfficer ? assignedOfficer.name:"None"
});

}catch(err){
console.log(err);
res.status(500).json({error:"Server error"});
}
});


/* =========================================================
   📊 GET ALL COMPLAINTS
========================================================= */
router.get("/all", async (req,res)=>{
const data = await Complaint.find().sort({createdTime:-1});
res.json(data);
});


/* =========================================================
   🔄 UPDATE STATUS
========================================================= */
router.put("/update/:id", async (req,res)=>{
await Complaint.findByIdAndUpdate(req.params.id,{status:req.body.status});
res.json({message:"Updated"});
});


/* =========================================================
   👮 MANUAL ASSIGN + DEADLINE
   (also stored in assign column)
========================================================= */
router.put("/assign/:id", async (req,res)=>{
try{

await Complaint.findByIdAndUpdate(req.params.id,{
assignedTo:req.body.staff,
status:"In Progress",
assignedTime:new Date(),
deadline:new Date(req.body.deadline)
});

res.json({message:"Assigned with deadline saved"});

}catch(err){
res.status(500).json(err);
}
});


/* =========================================================
   ✅ RESOLVE COMPLAINT
========================================================= */
router.put("/resolve/:id", async (req,res)=>{
try{
await Complaint.findByIdAndUpdate(req.params.id,{
status:"Resolved",
resolvedTime:new Date()
});
res.json({message:"Resolved"});
}catch(err){
res.status(500).json(err);
}
});


/* =========================================================
   ⭐ FEEDBACK + RATING
========================================================= */
router.put("/feedback/:id", async (req,res)=>{
try{
await Complaint.findByIdAndUpdate(req.params.id,{
feedback:req.body.feedback,
rating:req.body.rating
});
res.json({message:"Feedback saved"});
}catch(err){
res.status(500).json(err);
}
});


/* =========================================================
   📎 DOCUMENT UPLOAD
========================================================= */
router.post("/upload/:id", upload.single("file"), async(req,res)=>{
try{
await Complaint.findByIdAndUpdate(req.params.id,{
document:req.file.filename
});
res.json({message:"File uploaded"});
}catch(err){
res.status(500).json(err);
}
});


module.exports = router;