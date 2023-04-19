require("dotenv/config");
const cloudinary = require('cloudinary').v2;


// Configuration 
const CloudinaryConfig = cloudinary.config({
    cloud_name:process.env.COULD_NAME ,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });
  
 module.export = {CloudinaryConfig}