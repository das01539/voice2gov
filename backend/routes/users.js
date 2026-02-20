const express = require("express");
const router = express.Router();
const User = require("../models/user");


// ================= REGISTER (citizen + admin) =================
router.post("/register", async (req, res) => {
    try {

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,

            // ⭐ STEP 1: ROLE SYSTEM
            role: req.body.role ? req.body.role : "citizen"
        });

        await user.save();

        res.json({ message: "Registered successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Wrong password" });
        }

        res.json({
            message: "Login success",
            user: user   // contains role also
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
