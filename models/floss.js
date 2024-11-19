//require mongoose package
const mongoose = require('mongoose')

const flossSchema = new mongoose.Schema({
    flossNum: Number,
    flossColor: String,
    numOfSkiens: Number,
})

//creates the model
const Floss = mongoose.model("Floss", flossSchema)


//export the model
module.exports = Floss;