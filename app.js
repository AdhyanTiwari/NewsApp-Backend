require("dotenv").config()
const express = require("express");//used to deal with and create post put get and delete requests
const mongoose = require("mongoose");//helps to connect and perform actions on mongoDB database
const bodyParser = require("body-parser");//middleware to access the json files in json format
const cors = require("cors")//used to prevent the cors error 

mongoose.connect(process.env.MONGO_URI);
const app = express();
app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/api/auth", require("./routes/auth"));//used to make various post, get requests on /api/auth
app.use("/api/news", require("./routes/news"));
app.use("/api/videos", require("./routes/youtube"));
app.use("/api/discussion", require("./routes/discussion"));


app.listen(5000, () => {
    console.log("Started listening at port 5000")
})