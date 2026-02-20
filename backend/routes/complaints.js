const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// ⭐ STEP 4.2 ADD THIS
const multer = require("multer");


// ================= FILE STORAGE =================
const storage = multer.diskStorage({
destination:"uploads/",
filename:(req,file,cb)=>{
cb(null, Date.now()+"-"+file.originalname);
}
});

const upload = multer({storage:storage});


// ================= SUBMIT COMPLAINT =================
router.post("/add", async (req,res)=>{
try{

let text = (req.body.title + " " + req.body.description).toLowerCase();
let priority = "Normal";

if(
text.includes("urgent") ||
text.includes("emergency") ||
text.includes("accident") ||
text.includes("no water") ||
text.includes("hospital") ||
text.includes("2 days")
){
priority = "High";
}

const newComplaint = new Complaint({
...req.body,
priority:priority
});

await newComplaint.save();
res.json({message:"Complaint saved",priority:priority});

}catch(err){
console.log(err);
res.status(500).json({error:"Error saving"});
}
});


// ================= GET ALL =================
router.get("/all", async (req,res)=>{
const data = await Complaint.find().sort({created:-1});
res.json(data);
});


// ================= UPDATE STATUS =================
router.put("/update/:id", async (req,res)=>{
await Complaint.findByIdAndUpdate(req.params.id,{status:req.body.status});
res.json({message:"Updated"});
});


// ================= ASSIGN STAFF + DEADLINE =================
router.put("/assign/:id", async (req,res)=>{
try{

await Complaint.findByIdAndUpdate(req.params.id,{
assignedTo:req.body.staff,
status:"In Progress",
assignedTime:new Date(),
deadline:new Date(req.body.deadline)
});

res.json({message:"Assigned with deadline"});

}catch(err){
res.status(500).json(err);
}
});


// ================= MARK RESOLVED =================
router.put("/resolve/:id", async (req,res)=>{
try{
await Complaint.findByIdAndUpdate(req.params.id,{
status:"Resolved",
resolvedTime:new Date()
});
res.json({message:"Complaint resolved"});
}catch(err){
res.status(500).json(err);
}
});


// ================= FEEDBACK =================
router.put("/feedback/:id", async (req,res)=>{
try{

await Complaint.findByIdAndUpdate(req.params.id,{
feedback:req.body.feedback,
rating:req.body.rating
});

res.json({message:"Feedback saved successfully"});

}catch(err){
res.status(500).json(err);
}
});


// ================= STEP 4.2 DOCUMENT UPLOAD =================
router.post("/upload/:id", upload.single("file"), async(req,res)=>{
try{

await Complaint.findByIdAndUpdate(req.params.id,{
document:req.file.filename
});

res.json({message:"File uploaded successfully"});

}catch(err){
res.status(500).json(err);
}
});


module.exports = router;
