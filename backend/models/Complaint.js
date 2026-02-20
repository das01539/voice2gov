const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
    name:String,
    contact:String,
    department:String,
    title:String,
    description:String,
    location:String,

    status:{type:String, default:"Pending"},
    assignedTo:{type:String, default:"Not Assigned"},

    // 🕒 HISTORY TIMELINE
    createdTime:{type:Date, default:Date.now},
    assignedTime:{type:Date},
    resolvedTime:{type:Date},

    // ⏱ DEADLINE SYSTEM
    deadline:{type:Date},

    // ⭐ FEEDBACK SYSTEM
    feedback:{
        type:String,
        default:""
    },
    rating:{
        type:Number,
        default:0
    },

    // 📎 STEP 1 — DOCUMENT STORAGE
    document:{
        type:String,
        default:""
    }

});

module.exports = mongoose.model("Complaint", complaintSchema);
