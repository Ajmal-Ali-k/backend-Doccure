require("dotenv/config");
const DoctorModel = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const  validator = require("validator");
const cloudinary = require('cloudinary').v2;
const {CloudinaryConfig} =require('../utilities/cloudinary')
const jwt = require("jsonwebtoken")





const DoctorSignup = async (req, res) => {

  try {
    const {
      name,
      number,
      email,
      address,
      specialization,
      certificate,
      photo,
      expirience,
      password,
      confirmpassword

    
    } = req.body.data

  
    if (
      name &&
      number &&
      email &&
      address &&
      specialization &&
      certificate &&
      photo &&
      expirience &&
      password &&
      confirmpassword 

    ) {

      if (!validator.isEmail(email)) {
        return res.status(200).send({
          message: "email is not valid",
          success: false,
        });
      }
      if (!validator.isStrongPassword(password)) {
        return res.status(200).send({
          message: "password is not strong",
          success: false,
        });
      }
      if (!validator.isMobilePhone(number, "en-IN")) {
        return res
          .status(200)
          .send({ message: "Phone Number is not Valid", success: false });
      }
      const existDoc = await DoctorModel.findOne({ email: email });
      if (existDoc) {
        if (existDoc.status === "rejected") {
          return res.status(200).send({
            message: "this account is already rejected",
            success: false,
          });
        }
        return res.status(200).send({
          message: "doctor already exist",
          success: false,
        });
      }
      if (password != confirmpassword) {
        return res.status(200).send({
          message: "password is not match",
          success: false,
        });
      }
      const finalimage = await cloudinary.uploader.upload(certificate,{
        folder:"Certificate"
      }).catch((err)=>{
        console.log(err,"this is cloudinary error")
      })
      const profile = await cloudinary.uploader.upload(photo,{
        folder:"Doctor_profile"
      }).catch((err)=>{
        console.log(err,'doctor profile upload cloudinary ')
      })
      console.log(finalimage,"this is cloudinary image")
      const salt = await bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(password.trim(), salt);
      const newDoctor = DoctorModel({
        name,
        number,
        email,
        address,
        specialization,
        expirience,
        certificate:finalimage.secure_url,
        photo:profile.secure_url,
        password: hashedPassword,
        status: "pending",
      });
      await newDoctor.save();

      return res.status(200).send({
        message: "signup success fully compleated ",
        success: true,
      });
    } else {
      return res.status(200).send({
        message: "All field must be filled",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error in Doctor signup controller ${error.message}`,
    });
  }
};
const DoctorLogin = async (req,res)=>{
  try {
    console.log(req.body.data)
    const {email,password} = req.body.data
    if (email && password) {
      const doctor = await DoctorModel.findOne({ email });
      if (!doctor) {
        return res
          .status(200)
          .send({ message: "Doctor not found", success: false });
      }
      const isMatch = await bcrypt.compare(password, doctor.password);
      if (!isMatch) {
        return res
          .status(200)
          .send({ message: "invalid email or password", success: false });
      }
      const doctorToken = jwt.sign({ role:"doctorLogin",id: doctor._id }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24 *3,
      });
      const doctorName = doctor.name;
      res.status(200).send({
        message: "login success",
        success: true,
        doctorName,
        doctorToken
      });
    } else {
      return res
        .status(200)
        .send({ message: "All field must be filles", success: false });
    }
    
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:`Doctor login controller ${error.message}`
    })
    
  }
}



module.exports = {
  DoctorSignup,
  DoctorLogin
};
