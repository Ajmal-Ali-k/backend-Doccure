const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      ref: "users",
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      ref: "doctors",
    },
    status: {
      type: String,
      trim: true,
      default: "pending",
    },
    consultationFee: {
      type: Number,
    },
    date: {
      type: String,
    },
    start:{
      type:String,
    },
    end:{
      type:String,
    },
    transactionId: {
      type:String,
    },
    slotId:{
      type:String,
    }
  
  },
  { timestamps: true }
);
const appointmentModel = mongoose.model("appointment",appointmentSchema);
module.exports =appointmentModel 