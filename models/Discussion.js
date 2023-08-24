const mongoose = require("mongoose");
const CommentSchema = require("../models/Comment");


const DiscussionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    videoId: {
        type: String,
        required: true,
        unique: true
    },
    likes: [{ type: mongoose.Schema.ObjectId, ref: "users", unique: true }],
    comments: [CommentSchema]
})

module.exports = mongoose.model("Discussion", DiscussionSchema);