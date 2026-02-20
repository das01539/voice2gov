const express = require("express");
const router = express.Router();
const multer = require("multer");
const Complaint = require("../models/Complaint");

// storage config
const storage = multer.diskStorage({
destination:"uploads/",
filename:(req,file,cb)=>{
cb(null,Date.now()+"-"+file.originalname);
}
});

const upload = multer({storage:storage});


// upload document for complaint
router.post("/upload/:id", upload.single("file"), async(req,res)=>{
try{

await Complaint.findByIdAndUpdate(req.params.id,{
document:req.file.filename
});

res.json({message:"Document uploaded"});

}catch(err){
res.status(500).json(err);
}
});

module.exports = router;
