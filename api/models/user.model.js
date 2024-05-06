const mongoose = require("mongoose");
require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: false,
    },
    mapLocation: {
      type: String,
      required: false,
    },
    profileViews: {
      type: Number,
      default: 0,
      required: true,
    },
    banner: {
      cloudinary_id: {
        type: String,
        required: false,
      },
      url: {
        type: String,
        required: false,
      },
    },
    profile: {
      cloudinary_id: {
        type: String,
        required: false,
      },
      url: {
        type: String,
        required: false,
      },
    },
    gallery: [
      {
        cloudinary_id: {
          type: String,
          required: false,
        },
        url: {
          type: String,
          required: false,
        },
      },
    ],
    treatments: [
      {
        type: String,
        required: false,
      },
    ],
    otp: {
      type: Number,
      required: false,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    isDisabledByAdmin: {
      type: Boolean,
      required: true,
    },
  },
  {
    collection: "User",
  }
);

module.exports = mongoose.model("User", userSchema);
