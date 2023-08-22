const { default: mongoose } = require("mongoose");

const NewsSchema = mongoose.Schema({
    source: {
        name: String
    },
    title: String,
    description: String,
    url: String,
    urlToImage: String,
    publishedAt: Date
})

module.exports = NewsSchema;