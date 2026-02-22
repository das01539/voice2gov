const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const complaintRoutes = require("./routes/complaints");
const docRoutes = require("./routes/documents");
const userRoutes = require("./routes/users");
const Officer = require("./models/Officer");

const app = express();
app.use(cors());
app.use(express.json());

/* ================================
   🌍 CONNECT TO MONGODB ATLAS
================================ */
mongoose.connect("mongodb+srv://civicadmin:Dasarath%40123@cluster0.czi1r7u.mongodb.net/voice2gov")
.then(()=>console.log("🚀 MongoDB Atlas Connected"))
.catch(err=>console.log("DB Error:",err));
// 🔥 ADD OFFICERS (RUN ONLY ONCE)
async function seedOfficers() {

  await Officer.deleteMany({});

  await Officer.insertMany([
    // WATER
    { name: "Ravi", department: "Water", area: "Secunderabad" },
    { name: "Suresh", department: "Water", area: "Kukatpally" },
    { name: "Anil", department: "Water", area: "Ameerpet" },

    // ELECTRICITY
    { name: "Kiran", department: "Electricity", area: "Secunderabad" },
    { name: "Mahesh", department: "Electricity", area: "Kukatpally" },
    { name: "Rahul", department: "Electricity", area: "Ameerpet" },

    // ROADS
    { name: "Prakash", department: "Roads", area: "Secunderabad" },
    { name: "Naresh", department: "Roads", area: "Kukatpally" },
    { name: "Vijay", department: "Roads", area: "Ameerpet" },

    // SANITATION
    { name: "Imran", department: "Sanitation", area: "Secunderabad" },
    { name: "Arjun", department: "Sanitation", area: "Kukatpally" },
    { name: "Salman", department: "Sanitation", area: "Ameerpet" }
  ]);

  console.log("✅ Officers inserted");
}

// RUN ONCE
//seedOfficers();


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
