// require express package
const express = require("express");
//require dotenv to work
const dotenv = require('dotenv')
//loads the environment variables from .env file
dotenv.config()
//require mongoose to work
const mongoose = require('mongoose')
// require the method-override package to work
const methodOverride = require("method-override");
// require the morgan package to work
const morgan = require('morgan');

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
//the string in this will be a query param
app.use(methodOverride("_method"));
//helps with finding bugs sometimes, not 100% necessary
app.use(morgan("dev"));

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
app.get ("/floss/:flossId/edit", async (req, res) => {
    const addedFloss = await Floss.findById(req.params.flossId);
    res.render('floss/edit.ejs', {
        floss: addedFloss
    })
})

//index page (craft cabinet)
app.get ("/index", async (req, res) => {
    const allFloss = await Floss.find();
    await allFloss.sort((a, b) => {
        return a.flossNum - b.flossNum 
    })
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


//================= delete =======================
//delete floss from cabinet
app.delete("/floss/:flossId", async (req, res) => {
    await Floss.findByIdAndDelete(req.params.flossId);
    res.redirect("/index");
  });

//================= put ======================
app.put('/floss/:flossId', async (req, res) => {
    await Floss.findByIdAndUpdate(req.params.flossId, req.body);
    res.redirect(`/floss/${req.params.flossId}`)
})

app.listen(3002, () => {
  console.log("Listening on port 3002");
});