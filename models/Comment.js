const { default: mongoose } = require("mongoose");
const NewsSchema = require("../models/News");
const YoutubeSchema = require("./Youtube");

const TempCommentSchema = mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    edited: Boolean
})

const CommentSchema = mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    myComment: [TempCommentSchema]
})

module.exports = CommentSchema;