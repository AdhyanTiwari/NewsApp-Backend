const express = require("express");
const router = express.Router();
const fetchUser = require("../middlewares/fetchuser");
const YoutubeSchema = require("../models/Youtube");
const { default: mongoose } = require("mongoose");
const Youtube = mongoose.model("Youtube", YoutubeSchema);
const User = require("../models/User");
const { json } = require("body-parser");

//GET VIDEOS
router.get("/getvideos", fetchUser, async (req, res) => {
    const userId = req.user.id;
    const status = false;
    try {
        const user = await User.findOne({ _id: userId });
        res.json(user.saved_youtube)
    } catch (error) {
        res.json({ status: false, error: "some error occured" });
    }

})

//ADD VIDEOS
router.post("/addvideo", fetchUser, async (req, res) => {
    const id = req.user.id;
    try {
        let find_video = false;
        let user = await User.findOne({ _id: id })
        user.saved_youtube.forEach(e => {
            if (e.videoId === req.body.videoId) {
                find_video = true;
            }
        })
        if (find_video) {
            return res.json({ status: false, msg: "already saved" })
        }
        let video = new Youtube({
            title: req.body.title,
            videoId: req.body.videoId
        })
        user.saved_youtube.push(video);
        user.save()
        res.json({ status: true, msg: "added successfully" })
    } catch (error) {
        res.json({ status: false, error: "some error occured" })
    }
})

//DELETE VIDEO
router.delete("/deletevideo", fetchUser, async (req, res) => {
    try {
        let user = req.user.id;
        let videoId = req.body.id;
        let video = await User.findOneAndUpdate({ _id: user }, { $pull: { saved_youtube: { _id: videoId } } }, { safe: true, multi: false })
        res.json({ status: true, msg: "successfully deleted" })
    } catch (error) {
        res.json({ status: false, error: "some error occured" })
    }
})

module.exports = router;