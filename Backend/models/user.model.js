const mongoose = require("mongoose")

let userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    role:{
        type:String,
        enum:["student","librarian"],
        default:"student"
    },
    token: {
        type: String,
        default: null
    }
}, {versionKey:false, timestamps: true})


let User = mongoose.model('user', userSchema)

module.exports = User