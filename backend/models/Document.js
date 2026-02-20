const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
    filename:String,
    category:String,
    complaintId:String,
    date:{type:Date,default:Date.now}
});

module.exports = mongoose.model("Document", DocumentSchema);
