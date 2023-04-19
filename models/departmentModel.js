const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
    department:{
        type:String,
        required:[true,"department name is required"]

    },
    image:{
        type:String,
        required:[true,"department image is required"]
    },
    discription:{
        type:String,
        required:[true,"discription required"]
    }
})

const DepartmentModel = mongoose.model('department',DepartmentSchema)
module.exports = DepartmentModel;
