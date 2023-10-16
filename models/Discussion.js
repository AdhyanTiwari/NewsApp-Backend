const mongoose = require("mongoose");
const CommentSchema = require("../models/Comment");


const DiscussionSchema = mongoose.Schema({
    source: {
        name: String
    },
    title: String,
    description: String,
    url: String,
    urlToImage: String,
    publishedAt: Date,
    likes: [{ type: mongoose.Schema.ObjectId, ref: "users", unique: true }],
    comments: [CommentSchema]
})

module.exports = mongoose.model("Discussion", DiscussionSchema);