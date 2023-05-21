require("dotenv/config");
const DoctorModel = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const cloudinary = require("cloudinary").v2;
const { CloudinaryConfig } = require("../utilities/cloudinary");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const moment = require("moment");

const DoctorSignup = async (req, res) => {
  try {
    const {
      name,
      number,
      email,
      address,
      fee,
      specialization,
      certificate,
      photo,
      expirience,
      password,
      confirmpassword,
    } = req.body.data;

    if (
      name &&
      number &&
      email &&
      address &&
      fee &&
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
          message: "This email already exist",
          success: false,
        });
      }
      if (password != confirmpassword) {
        return res.status(200).send({
          message: "password is not match",
          success: false,
        });
      }
      const finalimage = await cloudinary.uploader
        .upload(certificate, {
          folder: "Certificate",
        })
        .catch((err) => {
          console.log(err, "this is cloudinary error");
        });
      const profile = await cloudinary.uploader
        .upload(photo, {
          folder: "Doctor_profile",
        })
        .catch((err) => {
          console.log(err, "doctor profile upload cloudinary ");
        });
      console.log(finalimage, "this is cloudinary image");
      const salt = await bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(password.trim(), salt);
      const newDoctor = DoctorModel({
        name,
        number,
        email,
        address,
        specialization,
        expirience,
        fee,
        certificate: finalimage.secure_url,
        photo: profile.secure_url,
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
const DoctorLogin = async (req, res) => {
  try {
    console.log(req.body.data);
    const { email, password } = req.body.data;
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
      const doctorToken = jwt.sign(
        { role: "doctorLogin", id: doctor._id },
        process.env.JWT_SECRET,
        {
          expiresIn: 60 * 60 * 24 * 3,
        }
      );
      const doctorID = doctor._id;
      const doctorName = doctor.name;
      res.status(200).send({
        message: "login success",
        success: true,
        doctorName,
        doctorToken,
        doctorID,
      });
    } else {
      return res
        .status(200)
        .send({ message: "All field must be filles", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Doctor login controller ${error.message}`,
    });
  }
};

const createSlot = async (req, res) => {
  try {
    const Id = req.doctor.id;
    const { data } = req.body;

    if (data) {
      await DoctorModel.findByIdAndUpdate(
        { _id: Id },
        { $push: { slots: data } }
      );
      return res.status(200).send({
        success: true,
        message: "Slot added Succesfully",
      });
    }
    console.log("slot added");
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `create Slot controller ${error.message}`,
    });
  }
};

const get_slot = async (req, res) => {
  try {
    const Id = req.doctor.id;

    await DoctorModel.findOne({ _id: Id }).then((data) => {
      const result = data.slots;

      res.status(200).send({
        success: true,
        result,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `get slot controller ${error.message}`,
    });
  }
};

// Function to generate time slots within the doctor's working hours
const generateTimeSlots = (start, end, duration) => {
  const timeSlots = [];
  const slotDuration = parseInt(duration);

  const [hours, minutes] = start.split(":");
  let currentTime = new Date();
  currentTime.setHours(hours);
  currentTime.setMinutes(minutes);

  const [hrs, min] = end.split(":");
  const ends = new Date();
  ends.setHours(hrs);
  ends.setMinutes(min);

  while (currentTime < ends) {
    const endTime = new Date(currentTime);
    endTime.setMinutes(endTime.getMinutes() + slotDuration);

    if (endTime <= ends) {
      const objectId = new ObjectId();
      const endingTime = moment(endTime);
      const staring = new Date(currentTime);
      const startingTime = moment(staring);
      timeSlots.push({
        start: startingTime.format("HH:mm"),
        end: endingTime.format("HH:mm"),
        booked: false,
        objectId: objectId.toString(),
      });
    }

    currentTime = endTime;
  }

  return timeSlots;
};

const slotCreation = async (req, res) => {
  try {
    const { date, startTime, endTime, slotDuration } = req.body.data;
    const Id = req.doctor.id;
    const isExist = await DoctorModel.findOne({
      _id: Id,
      slots: {
        $elemMatch: {
          $and: [
            { date: date },
            { startTime: startTime },
            { endTime: endTime },
          ],
        },
      },
    });
    console.log(isExist, "thsi is is exist");
    if (isExist) {
      return res.status(200).send({
        success: false,
        message: "This time already exists",
      });
    }
    const already = await DoctorModel.findOne({
      _id: Id,
      slots: {
        $elemMatch: {
          $and: [{ date: date }],
        },
      },
    });
    console.log(already, "thsi is is exist");
    if (already) {
      return res.status(200).send({
        success: false,
        message: "This day time already Scheduled",
      });
    }

    const timeSlots = generateTimeSlots(startTime, endTime, slotDuration);

    const doctor = await DoctorModel.updateOne(
      { _id: Id },
      {
        $push: {
          slots: {
            date,
            startTime,
            endTime,
            slotDuration,
            timeSlots,
          },
        },
      }
    );

    res.status(200).send({
      success: true,
      message: "slot created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `slotCeation controller ${error}`,
    });
  }
};

module.exports = {
  DoctorSignup,
  DoctorLogin,
  createSlot,
  get_slot,
  slotCreation,
};
