const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const complaintRoutes = require("./routes/complaints");
const docRoutes = require("./routes/documents");
const userRoutes = require("./routes/users");

const app = express();
app.use(cors());
app.use(express.json());

/* ================================
   🌍 CONNECT TO MONGODB ATLAS
================================ */
mongoose.connect("mongodb+srv://civicadmin:Dasarath%40123@cluster0.czi1r7u.mongodb.net/voice2gov")
.then(()=>console.log("🚀 MongoDB Atlas Connected"))
.catch(err=>console.log("DB Error:",err));


app.get("/", (req,res)=>{
res.send("Server running");
});

/* ROUTES */
app.use("/complaints", complaintRoutes);
app.use("/documents", docRoutes);
app.use("/users", userRoutes);

/* make uploads public */
app.use("/uploads", express.static("uploads"));

app.listen(5000, ()=>{
console.log("🔥 Server running on port 5000");
});
