const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'name is required']
    },
    lastName:{
        type:String

    },
    dateOfBirth:{
        type:String,
    },
    bloodGroup:{
        type:String,
    },
    photo:{
        type:String
    },
    age:{
        type:Number,
        required:[true,'age is required']
    },
    sex:{
        type:String,
        required:[true,'select a gender']
    },
    email:{
        type:String,
        required:[true,'email is required']
    },
    number:{
        type:Number,
        required:[true,'phone number is required']
    },
    address:{
        type:String,
        required:[true ,'address is required']
    },
    city:{
        type:String,

    },
    state:{
        type:String
    },
    zipCode:{
        type:String
    },
    country:{
        type:String
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    block:{
        type:Boolean,
        default:false
    }
    

},{timestamps:true})


const userModel = mongoose.model('users',userSchema)

module.exports = userModel;