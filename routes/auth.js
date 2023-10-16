require("dotenv").config()//importing environmental variables from .env file to maintain privacy 
const { default: mongoose } = require("mongoose");
const express = require("express");//used to deal with and create post put get and delete requests
const router = express.Router();
const bcrypt = require("bcrypt")//used for encryption using hashing and salting
const UserSchema = require("../models/User");//MongoDB schema imported
const User=mongoose.model("User",UserSchema);//MongoDB Model User
const { body, validationResult } = require('express-validator');//used to validate data like isEmail etc or throw error 
const jwt = require('jsonwebtoken');//used to create and authenticate web tokens
const fetchUser = require("../middlewares/fetchuser")//middleware to check authentication created by me

//CREATE USER 
router.post("/createuser", [
    body("email").isEmail(),//express validator
    body("name").isLength({ min: 3 }),
    body("password").isLength({ min: 5 })], async (req, res) => {
        let status = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status, msg: errors.array() });
            //returns error if the express validator conditions don't satisfy
        }
        try {
            let user = await User.findOne({ email: req.body.email })
            console.log(user);
            if (user) {
                return res.json({ status, msg: "User Already exists" })
            }
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt);
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: hash,
                date: req.body.date,
                saved_news: [],
                saved_youtube:[]
            })
            data = {//this is to be sent in the jwt token to authenticate the user
                user: {
                    id: user._id
                }
            }
            const token = jwt.sign(data, process.env.JWT_SECRET)
            status = true;
            res.json({ status, token })//returning the jwt token
        } catch (error) {
            res.json({ status, msg: "Someother error occured" })
        }


    })


//LOGIN USER
router.post("/login", [
    body("email").isEmail(),
    body("password").isLength({ min: 5 })], 
    async (req, res) => {
        let status = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status, msg: errors.array() });
        }
        try {
            let users = await User.findOne({ email: req.body.email })
            if (!users) {
                return res.json({ status, msg: "User does not exists" })
            }

            let compare = await bcrypt.compare(req.body.password, users.password);//returns boolean
            // here in compare we are comparing the password given by user(req.body.password) and the hash stored in the database
            if (!compare) {
                return res.json({ status, msg: "Wrong credentials" })
            }
            const data = await {
                user: {
                    id: users._id
                }
            }
            const token = jwt.sign(data, process.env.JWT_SECRET)//sending the token to authenticate the user using his id
            status = true;
            res.json({ status, token })
        } catch (error) {
            res.json({ status, msg: "Someother error occured" })
        }
    })

//GET USER INFO:
router.get("/getuserinfo",
 fetchUser,//the fetchUser is a middleware created by me to verify the user and get it's user identity 
 async (req, res) => {
    const userId = req.user.id;//we are able to access the req.user.id because of the fetchUser middleware
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
            return res.json({ status, msg: "new password and old password cannot be same" })
        }
        let user = await User.findOne({ _id: userId });
        const compare = await bcrypt.compare(password, user.password)
        if (!compare) {
            return res.json({ status, msg: 'wrong password' })
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);
        let pass = { password: hash }
        user = await User.findByIdAndUpdate(req.user.id, { $set: pass }, { new: true });
        status = true;
        res.json({ status, msg: "successfully updated" })

    } catch (error) {
        return res.json({ status, msg: "Internal error occured" })
    }
})


module.exports = router;