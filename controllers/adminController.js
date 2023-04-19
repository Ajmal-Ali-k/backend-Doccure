require("dotenv/config");
const DoctorModel = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const AdminModel = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const DepartmentModel = require("../models/departmentModel");
const cloudinary = require('cloudinary').v2;
const {CloudinaryConfig} =require('../utilities/cloudinary')



//admin login

const adminLogin = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  try {
    if (email && password) {
      const admin = await AdminModel.findOne({ email });
      if (!admin) {
        return res
          .status(200)
          .send({ message: "admin not found", success: false });
      }
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res
          .status(200)
          .send({ message: "invalid email or password", success: false });
      }
      const adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24,
      });
      const adminemail = admin.email;
      res.status(200).send({
        message: "login success",
        success: true,
        adminemail,
        adminToken
      });
    } else {
      return res
        .status(200)
        .send({ message: "All field must be filles", success: false });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        success: false,
        message: `admin login controller ${error.message}`,
      });
  }
};


//new doctor listing

const getPendingDoctors = async (req, res) => {
  try {
    const pendingDoctors = await DoctorModel.aggregate([
      {
        $match: { status: "pending" },
      },
    ]);
    
    
      res.status(200).send({ success: true, pendingDoctors });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `pending doctor controller ${error}`,
    });
  }
};


//approve the request of new doctor 
const approveDocter = async(req,res) =>{
  try {
   
    const {data} = req.body
    console.log(data,'this is approve id')
    const Doctor = await DoctorModel.findOneAndUpdate({_id:data},{$set:{status:"approved"}})
    if(Doctor){
      console.log("approved")
      res.status(200).send({message:`Doctor ${Doctor.name} request approved`,success:true})
    }else{
      return res.status(200).send({message:"doctor not exist",success:false})
    }
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message:`approve doctor error ${error}`,
      success:false
    })
  }
}


//reject the result of new doctor

const rejectDocter = async(req,res) =>{
  try {
    const {data} = req.body
    const Doctor = await DoctorModel.findOneAndUpdate({_id:data},{$set:{status:"rejected"}})
    if(Doctor){
      res.status(200).send({message:`Doctor ${Doctor.name} request rejected`,success:true})
      console.log("approved")
    }else{
      return res.status(200).send({message:"doctor not exist",success:false})
    }
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message:`reject doctor error ${error}`,
      success:false
    })
  }
}

const newDoctorDetails = async(req,res)=>{
  try {
    const newDoctor = await DoctorModel.findOne({id:req.body.id})
    if(newDoctor){
      res.status(200).send({success:true,newDoctor})
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

const addDepartment =async (req,res)=>{
  try {

    const {department,image,discription} =  req.body.data
    if(department && image && discription){
      const existDepartment = await DepartmentModel.findOne({department:department})
      if(existDepartment){
        return res.status(200).send({
          message:"this department already exist",
          success:false
        })

      }
      const finalimage = await cloudinary.uploader.upload(image,{
        folder:"Department"
      }).catch((err)=>{
        console.log(err,'image uploaded')
      })
      const newDepartment = new DepartmentModel({
        department:department,
        image:finalimage.secure_url,
        discription:discription
      })
      newDepartment.save()
      res.status(200).send({
        message:"added new department",
        success:true
      })

    }else{
      return res.status(200).send({
        message:"fill all the fileds",
        success:false
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message:`add department controller ${error}`,
      success:false
    })
  }

}


const getDepartments = async (req,res) =>{
  try {
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

const deleteDepartment = async (req,res) =>{
  try {
    console.log(req.body)
    const {id} = req.body
    console.log(id)
    const department = await DepartmentModel.findByIdAndDelete(id)
    res.status(200).send({
      success:true,
      message:'deleted successfully'
    })
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message:`delete department controller ${error}`,
      success:false
    })
    
  }
}

module.exports = {
  getPendingDoctors,
  adminLogin,
  approveDocter,
  rejectDocter,
  addDepartment,
  getDepartments,
  newDoctorDetails,
  deleteDepartment

};
