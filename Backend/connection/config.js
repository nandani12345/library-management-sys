const mongoose = require('mongoose')
require("dotenv").config()

const connect = mongoose.connect(process.env.MONGO_URL)

let connection = mongoose.connection

connection.on("connected", ()=>{
    console.log("database connected")
})
connection.on("error", (error)=>{
    console.log("database connection error", error)
})
module.exports = mongoose
