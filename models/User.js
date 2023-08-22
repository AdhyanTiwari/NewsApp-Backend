const { default: mongoose } = require("mongoose");
const NewsSchema = require("../models/News");
const YoutubeSchema = require("./Youtube");

const UserSchema = mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now()
        },
    saved_news: [NewsSchema],
    saved_youtube:[YoutubeSchema]
})

module.exports = mongoose.model("User", UserSchema);