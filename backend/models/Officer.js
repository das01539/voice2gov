const mongoose = require("mongoose");

const officerSchema = new mongoose.Schema({
name:String,
department:String,
area:String,
assignedCount:{ type:Number, default:0 }
});

module.exports = mongoose.model("Officer", officerSchema);