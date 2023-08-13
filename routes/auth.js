require("dotenv").config()
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const fetchUser = require("../middlewares/fetchuser")

//CREATE USER 
router.post("/createuser", [
    body("email").isEmail(),
    body("name").isLength({ min: 3 }),
    body("password").isLength({ min: 5 })], async (req, res) => {
        let status = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status, errors: errors.array() });
        }
        try {
            let user = await User.findOne({ email: req.body.email })
            if (user) {
                return res.json({ status, error: "User Already exists" })
            }
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt);
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: hash,
                date: req.body.date
            })
            status = true;
            res.json({ status, user })
        } catch (error) {
            res.json({ status, error: "Someother error occured" })
        }


    })


//LOGIN USER
router.post("/login", [
    body("email").isEmail(),
    body("password").isLength({ min: 5 })], async (req, res) => {
        let status = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status, errors: errors.array() });
        }
        try {
            let user = await User.findOne({ email: req.body.email })
            if (!user) {
                return res.json({ status, error: "User does not exists" })
            }

            let compare = await bcrypt.compare(req.body.password, user.password);
            if (!compare) {
                return res.json({ status, error: "Wrong credentials" })
            }
            const data = await {
                user: {
                    id: user._id
                }
            }
            const token = jwt.sign(data, process.env.JWT_SECRET)
            status = true;
            res.json({ status, token })
        } catch (error) {
            res.json({ status, error: "Someother error occured" })
        }
    })

//GET USER INFO:
router.get("/getuserinfo", fetchUser, async (req, res) => {
    const userId = req.user.id;
    const user = await User.findOne({ _id: userId }).select("-password");
    res.send(user);
})


//CHANGE PASSWORD
router.put("/changepassword", fetchUser, async (req, res) => {
    let status = false;
    try {
        let userId = req.user.id;
        const password = req.body.password;
        const newPassword = req.body.newPassword;
        if (password === newPassword) {
            return res.json({ status, error: "new password and old password cannot be same" })
        }
        let user = await User.findOne({ _id: userId });
        const compare = await bcrypt.compare(password, user.password)
        if (!compare) {
            return res.json({ status, error: 'wrong password' })
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);
        let pass = { password: hash }
        user = await User.findByIdAndUpdate(req.user.id, { $set: pass }, { new: true });
        status = true;
        res.json({ status, msg: "successfully updated" })

    } catch (error) {
        return res.json({ status, error: "Internal error occured" })
    }
})


module.exports = router;