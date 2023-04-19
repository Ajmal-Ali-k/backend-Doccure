const mongoose = require("mongoose")

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
    },
    number: {
        type: Number,
        required: [true, "number is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
    },
    address: {
        type: String,
        required: [true, "address is required"],
    },
    specialization: {
        type: String,
        required: [true, "specialisation is required"],
    },
    expirience: {
        type: String,
        required: [true, "expirience is required"],
    },
    certificate: {
        type: String,
        required: [true, "certificate is required"],
    },
    photo:{
        type:String,
        required:[true,"photo is required"]
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    status:{
        type:String,
    
    }
},{timestamps:true});

const doctorModel = mongoose.model("doctors", doctorSchema);
module.exports = doctorModel;
