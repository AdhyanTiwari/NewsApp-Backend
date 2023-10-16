const { default: mongoose } = require("mongoose");
const NewsSchema = require("../models/News");
const YoutubeSchema = require("./Youtube");


const CommentSchema = mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: true
    }
})

module.exports = CommentSchema;