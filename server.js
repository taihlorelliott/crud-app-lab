// require express package
const express = require("express");
//require dotenv to work
const dotenv = require('dotenv')
//loads the environment variables from .env file
dotenv.config()
//require mongoose to work
const mongoose = require('mongoose')

const app = express();

// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
  });

//importing the floss model
const Floss = require("./models/floss.js")

//tell express to expect data
app.use(express.urlencoded({ extended: false }));

//=============== gets =====================
//home page
app.get ("/", async (req, res) => {
    res.render("home.ejs")
});

//add new page
app.get ("/floss/new", async (req, res) => {
    res.render("floss/new.ejs")
})

//edit page
app.get ("/edit", async (req, res) => {
    res.render("floss/edit.ejs")
})

//index page (craft cabinet)
app.get ("/index", async (req, res) => {
    const allFloss = await Floss.find();
    res.render("floss/index.ejs", { floss: allFloss })
})

//show page/information page
app.get ("/floss/:flossId", async (req, res) => {
    const addedFloss = await Floss.findById(req.params.flossId);
    res.render("floss/show.ejs", {floss: addedFloss});
})

//==================== posts =====================

//post floss
app.post("/floss", async (req, res) => {
    console.log(req.body);
    await Floss.create(req.body);
    res.redirect("/index")
})

app.listen(3002, () => {
  console.log("Listening on port 3002");
});