const express = require("express");
const router = express.Router();
const fetchUser = require("../middlewares/fetchuser")
const NewsSchema = require("../models/News");
const { default: mongoose } = require("mongoose");
const News = mongoose.model("News", NewsSchema)
const UserSchema = require("../models/User");
const User= mongoose.model("User",UserSchema)
const { json } = require("body-parser");

//GET NEWS
router.get("/getnews", fetchUser, async (req, res) => {
    const id = req.user.id;
    try {
        let user = await User.findOne({ _id: id });
        res.json(user.saved_news);
    } catch (error) {
        res.json({ status: false, error: "some error occured" });
    }
})


//ADD NEWS
router.post("/addnews", fetchUser, async (req, res) => {
    const id = req.user.id;
    try {
        let find_title = false;
        let user = await User.findOne({ _id: id })
        user.saved_news.forEach(e => {
            if (e.title === req.body.title) {
                find_title = true;
            }
        })
        if (find_title) {
            return res.json({ status: false, msg: "already saved" })
        }
        let news = new News({
            source: {
                name: req.body.source.name
            },
            title: req.body.title,
            description: req.body.description,
            url: req.body.url,
            urlToImage: req.body.urlToImage,
            publishedAt: req.body.publishedAt
        })
        user.saved_news.push(news);
        user.save()
        res.json({ status: true, msg: "added successfully" })
    } catch (error) {
        res.json({ status: false, error: "some error occured" })
    }
})


//DELETE NEWS
router.delete("/deletenews", fetchUser, async (req, res) => {
    try {
        let user = req.user.id;
        let newsId = req.body.id;
        let news = await User.findOneAndUpdate({ _id: user }, { $pull: { saved_news: { _id: newsId } } },{ safe: true, multi: false })
        res.json({ status: true, msg: "successfully deleted" })
    } catch (error) {
        res.json({ status: false, error: "some error occured" })
    }
})
module.exports = router;