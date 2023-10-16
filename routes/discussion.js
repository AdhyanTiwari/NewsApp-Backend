const express = require("express");
const router = express.Router();
const Discussion = require("../models/Discussion");
const fetchUser = require("../middlewares/fetchuser");
const CommentSchema = require("../models/Comment");
const { default: mongoose } = require("mongoose");
const Comment = mongoose.model("Comment", CommentSchema);

//GET DISCUSSIONS
router.get("/getdiscussion", fetchUser, async (req, res) => {
    let status = false
    try {
        const discussion = await Discussion.find();
        status = true
        res.json({ status, discussion });
    } catch (error) {
        res.json({ status, msg: "some internal error occured" })
    }
})

//ADD DISCUSSIONS
router.post("/add-discuss", fetchUser, async (req, res) => {
    const id = req.user.id;
    try {
        let find_title = false;
        let DiscussionId = ""
        let user = await Discussion.find()
        user.forEach(e => {
            if (e.title === req.body.title) {
                find_title = true;
                DiscussionId = e._id;
            }
        })
        if (find_title) {
            return res.json({ status: true, id: DiscussionId })
        }
        let news = Discussion.create({
            source: {
                name: req.body.source.name
            },
            title: req.body.title,
            description: req.body.description,
            url: req.body.url,
            urlToImage: req.body.urlToImage,
            publishedAt: req.body.publishedAt
        })
        res.json({ status: true, id: news._id })
    } catch (error) {
        res.json({ status: false, error: "some error occured" })
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
router.post("/addcomment", fetchUser, async (req, res) => {
    let status = false;
    let userId = req.user.id;
    try {
        let comment = new Comment({
            comment: req.body.comment,
            user: userId
        })
        let discussion = await Discussion.findByIdAndUpdate(req.body.id, { $push: { comments: comment } }, { new: true });
        if (!discussion) {
            return res.json({ status, msg: "invalid comment request" })
        }
        status = true;
        res.json({ status, msg: "successfully commented" })
    } catch (error) {
        res.json({ status, msg: "some internal error occured" })
    }
})


module.exports = router;