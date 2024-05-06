const mongoose = require("mongoose");
require("dotenv").config();

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "approved", "cancelled"],
    },
  },
  {
    collection: "Appointment",
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
