const express = require("express");
const router = express.Router();
const fetchUser = require("../middlewares/fetchuser")
const News = require("../models/News")

//GET NEWS
router.get("/getnews", fetchUser, async (req, res) => {
    const id = req.user.id;
    try {
        const news = await News.find({ user: id });
        res.json(news);
    } catch (error) {
        res.json({ status: false, error: "some error occured" });
    }
})


//ADD NEWS
router.post("/addnews", fetchUser, async (req, res) => {
    const id = req.user.id;
    try {
        let news = await News.findOne({ title: req.body.title, user: id })
        if (news) {
            return res.json({ status: false, msg: "already saved" })
        }
        news = await News.create({
            user: id,
            source: {
                name: req.body.source.name
            },
            title: req.body.title,
            description: req.body.description,
            url: req.body.url,
            urlToImage: req.body.urlToImage,
            publishedAt: req.body.publishedAt
        })
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
        let news = await News.findOneAndDelete({ user: user, _id: newsId })
        res.json({ status: true, msg: "successfully deleted" })
    } catch (error) {
        res.json({ status: false, error: "some error occured" })
    }
})
module.exports = router;