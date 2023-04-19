require("dotenv/config");
const mongoose = require('mongoose')
const colors = require('colors')




const MONGO_URL = process.env.MONGODB_URL
const connectDB = async()=>{
    try {
        await mongoose.connect(MONGO_URL)
        console.log(`MONGODB connected ${mongoose.connection.host}`.bgBlue.white);
        
    } catch (error) {
        console.log(`mongodb server issue ${error}`.bgRed.white)
        
    }
}
module.exports =connectDB;