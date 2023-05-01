require("dotenv/config");
const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')
var validator = require('validator');
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const DepartmentModel =require('../models/departmentModel')


const loginController = async(req,res) => {
    try {
        console.log("hiiiiiiiiiiiii guys")
        const{email,password} = req.body;
        if(email && password ){
            const user = await userModel.findOne({email});
            console.log(user)
            if(!user){
                return res.status(200).send({message:'user not found',success:false});
            }
            if(user.block === true){
                return res.status(200).send({message:"your account is blocked",success:false})
            }
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch){
                return res.status(200).send({message:"invalid email or password",success:false})
            }
            const clientToken = jwt.sign({role:"clientLogin",id:user._id},process.env.JWT_SECRET,{
                expiresIn :60 *60 *24,
            })
            console.log(user,"this is the user")
            const clientName = user.username;
            const clientId = user._id
            res.status(200).send({
                message:"Login success",
                success:true,
                clientName,
                clientId,
                clientToken,
            });
        }else{
            return res.status(200).send({message:"All field must be filled",success:false})
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:`Error on Login Controller ${error.message}`
        })
    }

}

const registerController = async (req, res) => {
    try {
        const { username, age, sex, number, email, password, confirmPassword, address } = req.body;
    console.log(req.body)
        //validation
        if (username && age && sex && number && email && password && confirmPassword && address) {
            if (!validator.isEmail(email)) {
                return res.status(200).send({ message: "email is not valid", message: false });

            }
            if (!validator.isStrongPassword(password)) {
                return res.status(200).send({ message: "password not strong enough", success: false });
            }
            if (!validator.isMobilePhone(number, "en-IN")) {
                return res.status(200).send({ message: "phone number is not valid", success: false })
            }
            const existUser = await userModel.findOne({ email: req.body.email })
            if (existUser) {
                return res.status(200).send({ success: false, message: 'user already exist' })
            }
            if (password != confirmPassword) {
                return res.status(200).send({ message: "password not same", success: false });
            }
            const salt = await bcrypt.genSaltSync(10);
            const hashedPassword = await bcrypt.hash(password.trim(), salt);
            const newClient = new userModel({
                username,
                age,
                sex,
                number,
                email,
                address,
                password: hashedPassword
            })
            await newClient.save();
            res.status(201).send({ message: "signup successfully", success: true });


        } else {
            return res.status(200).send({ message: "All field must be filled ", success: false })
        }



    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: `Register controller ${error.message}` })

    }

}


const approvedDoctors = async (req,res) =>{
    try {
        const Doctors = await doctorModel.aggregate([
            {
              $match: { status: "approved" },
            },
          ]);
          if (Doctors[0]) {
            res.status(200).send({ success: true, Doctors });
          } else {
            return res
              .status(200)
              .send({ success: false, message: "no doctors" });
          }
        
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: `approved Doctor controller ${error.message}` })
    }
}

const getDepartments = async (req,res) =>{
    try {
        console.log("hiihsddfu")
      const departments = await DepartmentModel.find({})
      if(departments){
        res.status(200).send({
          departments,
          success:true
        })
  
      }else{
        return res.status(200).send({
          message:'no department find',
          success:false
        })
      }
      
    } catch (error) {
      console.log(error)
      res.status(500).send({
        message:`get department controller ${error}`,
        success:false
      })
      
    }
  }

  const filteredDoctors = async (req,res)=>{
    console.log(req.body.data,"this is the checked data")

  }
  const doctorDetails = async(req,res)=>{
    console.log(req.query.id)
    const id= req.query.id
   
    try {
      const Doctor = await doctorModel.findOne({_id:id})
      if(Doctor){
        res.status(200).send({success:true,Doctor})
        console.log(Doctor)
      }
      else{
        return res.status(200).send({message:"doctor not found",success:false})
      }
    } catch (error) {
      console.log(error)
      res.status(500).send({
        message:`new doctor details error ${error}`,
        success:false
      })
      
    }
  }


module.exports = {
    loginController,
    registerController,
    approvedDoctors,
    getDepartments,
    filteredDoctors,
    doctorDetails
}