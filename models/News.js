const { default: mongoose } = require("mongoose");

const NewsSchema = mongoose.Schema({
    user:mongoose.Schema.Types.ObjectId,
    source: {
        name: String
    },
    title: String,
    description: String,
    url: String,
    urlToImage: String,
    publishedAt: Date


})

module.exports = mongoose.model("savedNews", NewsSchema);