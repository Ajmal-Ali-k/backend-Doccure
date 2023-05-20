const mongoose = require("mongoose");

// const daySchema = new mongoose.Schema({
//   day: {
//     type: String,
//     trim: true,
//   },

//   status: {
//     type: String,
//     trim: true,
//     default: "active",
//   },
//   time: [
//     {
//       start: {
//         type: Date,
//         trim: true,
//       },
//       end: {
//         type: Date,
//         trim: true,
//       },
//       slots: {
//         type: Number,
//         trim: true,
//       },
//     },
//   ],
// });

const doctorSchema = new mongoose.Schema(
  {
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
    fee: {
      type: String,
      required: [true, "fee is required"],
    },
    certificate: {
      type: String,
      required: [true, "certificate is required"],
    },
    photo: {
      type: String,
      required: [true, "photo is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    status: {
      type: String,
    },
    // availability: [daySchema],
    slots: [
      {
        date: {
          type: String,
        },
        startTime: {
          type: String,
        },
        endTime: {
          type: String,
        },
        status: {
          type: String,
          default: "active",
        },
        slotDuration:{
          type: String,
        },
        timeSlots: {
          type:Array
        }
      },
    ],
    block: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const doctorModel = mongoose.model("doctors", doctorSchema);
module.exports = doctorModel;
