const express = require("express");
const router = express.Router();
const Discussion = require("../models/Discussion")
const fetchUser = require("../middlewares/fetchuser")

//GET DISCUSSIONS
router.get("/getdiscussion", async (req, res) => {
    let status = false
    try {
        const disscussion = await Discussion.find();
        status = true
        res.json({ status, disscussion });
    } catch (error) {
        res.json({ status, msg: "some internal error occured" })
    }
})

//ADD DISCUSSIONS
router.post("/add-discuss", fetchUser, async (req, res) => {
    let status = false;
    try {
        const videoId = req.body.videoId;
        const discussion = await Discussion.findOne({ videoId: videoId })
        if (discussion) {
            status = true;
            return res.json({ status, id: discussion._id, msg: "already exists" })
        }
        const newDiscussion = await Discussion.create({
            title: req.body.title,
            videoId: req.body.videoId,
            likes: [],
            comments: []
        })
        status = true
        res.json({ status, id: newDiscussion._id, msg: "created" })
    } catch (error) {
        res.json({ status, msg: "some internal error occured" })
    }
})

//ADD LIKE
router.post("/addlike", fetchUser, async (req, res) => {
    let status = false;
    userId = req.user.id;
    try {
        let discussion = await Discussion.findByIdAndUpdate(req.body.id, { $push: { likes: userId } }, { new: true });
        if (!discussion) {
            return res.json({ status, msg: "invalid like request" })
        }
        status = true;
        res.json({ status, msg: "successfully liked" })
    } catch (error) {
        res.json({ status, msg: "some internal error occured" })
    }

})

//REMOVE LIKE 
router.post("/unlike", fetchUser, async (req, res) => {
    let status = false;
    userId = req.user.id;
    try {
        let discussion = await Discussion.findByIdAndUpdate(req.body.id, { $pull: { likes: userId } }, { new: true });
        if (!discussion) {
            return res.json({ status, msg: "invalid unlike request" })
        }
        status = true;
        res.json({ status, msg: "successfully unliked" })
    } catch (error) {
        res.json({ status, msg: "some internal error occured" })
    }
});

//ADD COMMENT
router.post("/addcomment",fetchUser,async(req,res)=>
{
    
})


module.exports = router;