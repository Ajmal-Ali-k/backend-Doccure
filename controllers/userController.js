require("dotenv/config");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
var validator = require("validator");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const DepartmentModel = require("../models/departmentModel");
const AppoinmentModel = require("../models/appoinmentModel");
const mongoose = require("mongoose");
const {sendotp,varifyotp} =require('../helpers/otp')

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (email && password) {
      const user = await userModel.findOne({ email });

      if (!user) {
        return res
          .status(200)
          .send({ message: "user not found", success: false });
      }
      if (user.block === true) {
        return res
          .status(200)
          .send({ message: "your account is blocked", success: false });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(200)
          .send({ message: "invalid email or password", success: false });
      }
      const clientToken = jwt.sign(
        { role: "clientLogin", id: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: 60 * 60 * 24 * 3,
        }
      );

      const clientName = user.username;
      const clientId = user._id;
      res.status(200).send({
        message: "Login success",
        success: true,
        clientName,
        clientId,
        clientToken,
      });
    } else {
      return res
        .status(200)
        .send({ message: "All field must be filled", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error on Login Controller ${error.message}`,
    });
  }
};

const registerController = async (req, res) => {
  try {
    const {
      username,
      age,
      sex,
      number,
      email,
      password,
      confirmPassword,
      address,
    } = req.body;
    console.log(req.body);
    //validation
    if (
      username &&
      age &&
      sex &&
      number &&
      email &&
      password &&
      confirmPassword &&
      address
    ) {
      if (!validator.isEmail(email)) {
        return res
          .status(200)
          .send({ message: "email is not valid", message: false });
      }
      if (!validator.isStrongPassword(password)) {
        return res
          .status(200)
          .send({ message: "password not strong enough", success: false });
      }
      if (!validator.isMobilePhone(number, "en-IN")) {
        return res
          .status(200)
          .send({ message: "phone number is not valid", success: false });
      }
      const existUser = await userModel.findOne({ email: req.body.email });
      if (existUser) {
        return res
          .status(200)
          .send({ success: false, message: "user already exist" });
      }
      if (password != confirmPassword) {
        return res
          .status(200)
          .send({ message: "password not same", success: false });
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
        password: hashedPassword,
      });
      await newClient.save();
      res.status(201).send({ message: "signup successfully", success: true });
    } else {
      return res
        .status(200)
        .send({ message: "All field must be filled ", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register controller ${error.message}`,
    });
  }
};

const approvedDoctors = async (req, res) => {
  try {
    const Doctors = await doctorModel.aggregate([
      {
        $match: { status: "approved" },
      },
    ]);
    if (Doctors[0]) {
      res.status(200).send({ success: true, Doctors });
    } else {
      return res.status(200).send({ success: false, message: "no doctors" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `approved Doctor controller ${error.message}`,
    });
  }
};

const getDepartments = async (req, res) => {
  try {
    console.log("hiihsddfu");
    const departments = await DepartmentModel.find({});
    if (departments) {
      res.status(200).send({
        departments,
        success: true,
      });
    } else {
      return res.status(200).send({
        message: "no department find",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `get department controller ${error}`,
      success: false,
    });
  }
};

const filteredDoctors = async (req, res) => {
  console.log(req.body.data, "this is the checked data");
};
const doctorDetails = async (req, res) => {
  console.log(req.query.id);
  const id = req.query.id;

  try {
    const Doctor = await doctorModel.findOne({ _id: id });
    if (Doctor) {
      res.status(200).send({ success: true, Doctor });
    } else {
      return res
        .status(200)
        .send({ message: "doctor not found", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `new doctor details error ${error}`,
      success: false,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    console.log(req.body.data);
    const {
      username,
      lastName,
      photo,
      number,
      dateOfBirth,
      bloodGroup,
      email,
      address,
      city,
      state,
      zipCode,
      country,
    } = req.body.data;
    const Id = req.user.id;
    console.log(email);
    const { data } = req.body;
    const user = await userModel.findByIdAndUpdate(
      { _id: Id },
      {
        username,
        lastName,
        photo,
        number,
        dateOfBirth,
        bloodGroup,
        email,
        address,
        city,
        state,
        zipCode,
        country,
      }
    );

    res.status(200).send({
      message: `profile updated Successfully`,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `update profile controller ${error.message}`,
      success: false,
    });
  }
};

const getUserData = async (req, res) => {
  try {
    const Id = req.user.id;
    const user = await userModel.findOne({ _id: Id });
    if (user) {
      const balence = user.wallet;
      return res.status(200).send({
        success: true,
        user,
        balence
      });
    } else {
      return res.status(500).send({
        success: true,
        message: `something went wrong${error.message}`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      messge: `get usercontroller${error.message}`,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    console.log(req.body);
    const { oldPassword, newPassword, confirmPassword } = req.body.data;
    const Id = req.user.id;
    const user = await userModel.findOne({ _id: Id });

    if (newPassword !== confirmPassword) {
      return res.status(200).send({
        message: `Confirm Password not match`,

        success: false,
      });
    }
    if (!user) {
      return res.status(200).send({
        message: `user not found`,

        success: false,
      });
    }
    if (!validator.isStrongPassword(newPassword)) {
      return res
        .status(200)
        .send({ message: "password not strong enough", success: false });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).send({
        message: `invalid password`,
      });
    }
    //hash and store new password
    const newhashed = await bcrypt.hash(newPassword, 10);

    await userModel
      .updateOne({ _id: Id }, { $set: { password: newhashed } })
      .then((result) => {
        res.status(200).send({
          message: `password successfully updated`,
          success: true,
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `chnge password controller${error.message}`,
    });
  }
};

const filterSlot = async (req, res) => {
  try {
    const { id, selectedDate } = req.body.data;
    console.log(req.body);

    const doctorID = new mongoose.Types.ObjectId(id);
    const data = await doctorModel.aggregate([
      { $match: { _id: doctorID } },
      {
        $project: {
          slots: {
            $filter: {
              input: "$slots",
              as: "slots",
              cond: { $eq: ["$$slots.date", selectedDate] },
            },
          },
        },
      },
    ]);
    const slots = data[0].slots[0]?.timeSlots;
    const DocumentId = data[0].slots[0]?._id;
    console.log(DocumentId, "thsi doc id");
    // console.log(slots,"this is slot")
    // if (!slots) {
    //   console.log("filterd  slots not found")
    //   return res.status(200).send({
    //     success: false,
    //     message: `Slots not available in this date`,
    //   });
    // }
    res.status(200).send({
      success: true,
      slots,
      DocumentId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `filter controller error`,
    });
  }
};

const createBooking = async (req, res) => {
  try {
    const { slot, totalAmount, doctor, order_id, timing, date, documentId } =
      req.body;
    const { start, end } = timing;
    const user = req.user.id;
    if (
      slot &&
      totalAmount &&
      doctor &&
      order_id &&
      timing &&
      date &&
      documentId
    ) {
      await AppoinmentModel.create({
        user: user,
        doctor: doctor,
        consultationFee: totalAmount,
        date: date,
        start: start,
        end: end,
        transactionId: order_id,
        slotId: slot[0],
      }).then(async (result) => {
        const appoinmentId = result._id;
        console.log(result, "thsi is the result id");
        await doctorModel
          .updateOne(
            { _id: doctor, "slots.timeSlots.objectId": slot[0] },
            { $set: { "slots.$[outer].timeSlots.$[inner].booked": true } },
            {
              arrayFilters: [
                { "outer._id": documentId },
                { "inner.objectId": slot[0] },
              ],
            }
          )
          .then((result) => {
            console.log("update successfull");
            res.status(200).send({ success: true, appoinmentId });
          })
          .catch((error) => {
            console.error("Update failed", error);
            res.status(200).send({ success: false });
          });
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `booking controller error`,
    });
  }
};

const getSlots = async (req, res) => {
  try {
    const { id, selectedDate } = req.body;
    const doctorID = new mongoose.Types.ObjectId(id);
    const data = await doctorModel.aggregate([
      { $match: { _id: doctorID } },
      {
        $project: {
          slots: {
            $filter: {
              input: "$slots",
              as: "slots",
              cond: { $eq: ["$$slots.date", selectedDate] },
            },
          },
        },
      },
    ]);
    const slots = data[0].slots;
    console.log(slots, "this is slot");
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `getSlots  controller error`,
    });
  }
};

const appoinmentdata = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, "this is params id");
    const data = await AppoinmentModel.findOne({ _id: id })
      .populate("doctor")
      .populate("user");
    console.log(data);
    if (data) {
      res.status(200).send({
        success: true,
        data,
      });
    } else {
      res.status(200).send({
        success: false,
        message: `some thing went wrong`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `appoinmentdata error: ${error}`,
    });
  }
};

const appoinments = async (req, res) => {
  try {
    const Id = req.user.id;
    const appointments = await AppoinmentModel.find({ user: Id }).populate(
      "doctor"
    ).sort({date:-1});

    res.status(200).send({
      success: true,
      appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `appoinments error: ${error}`,
    });
  }
};


const cancelAppoinment = async (req,res)=>{
  try {
    const {id} = req.query
    const appoinment = await AppoinmentModel.findOneAndUpdate({_id:id},
      {$set:{status:"cancelled"}}, { new: true });

      if(!appoinment){
        return res.status(200).send({
          success:false,
          message: 'Appointment not found.',
        })
      }
    const refundAmount = appoinment.consultationFee * 0.5;

    const userId = (appoinment.user).toString();
    // Update the user's wallet with the refunded amount
    await userModel.updateOne({ _id: userId }, { $inc: { wallet: refundAmount } }).then((result)=>{
      res.status(200).send({success:true, message:"cancelled successfully"})
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      message:`cancel appoinment ${error}`,
    })
  }
}




const forgotpost = async (req,res)=>{
 
  console.log(req.query.email)
  let findUser = await userModel.findOne({ email: req.query.email},{_id:0,number:1}).then((user)=>{
    console.log(user,111  )
    if(user){
         sendotp(user.number);
        res.status(200).send({mobile:user.number ,success:true})
    }else{
      res.send({response:"email not found",success:false});
    }
  })
}

const forgotOtpVerify = async (req, res) => {
  try {
    let {otp, mobile} = req.body;
    console.log(otp, mobile);
    await varifyotp(mobile, otp).then((response) => {
      console.log("waiting for verification");
      if(response){
        console.log("verification approved");
        res.status(200).send({success:true})
      }else{
        console.log("verification failed");
        res.status(200).send({success:false})
      }
    })
  } catch (error) {
  console.log(error)    
  }
}
const changePwod = async(req,res)=>{
  try {
    const {mobile, newPassword} = req.body;
    console.log(req.body)
    const user = await userModel.findOne({number : mobile });

    if (!user) {
      return res.status(200).send({
        message: `user not found`,
        success: false,
      });
    }
    if (!validator.isStrongPassword(newPassword)) {
      return res
        .status(200)
        .send({ message: "password not strong enough", success: false });
    }
    //hash and store new password
    const newhashed = await bcrypt.hash(newPassword, 10);

    await userModel
      .updateOne({ number: mobile }, { $set: { password: newhashed } })
      .then((result) => {
        res.status(200).send({
          message: `password successfully updated`,
          success: true,
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `chnge password controller${error.message}`,
    });
  }

}

module.exports = {
  loginController,
  registerController,
  approvedDoctors,
  getDepartments,
  filteredDoctors,
  doctorDetails,
  updateProfile,
  getUserData,
  changePassword,
  filterSlot,
  createBooking,
  appoinmentdata,
  appoinments,
  cancelAppoinment,
  forgotpost,
  forgotOtpVerify,
  changePwod

};
