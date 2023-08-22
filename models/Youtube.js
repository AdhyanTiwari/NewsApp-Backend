const { default: mongoose } = require("mongoose");

const YoutubeSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    videoId: {
        type: String,
        required: true
    }
})

module.exports = YoutubeSchema;