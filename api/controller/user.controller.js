const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const response = require("../utils/default-response");
const { validateBody } = require("../utils/validate-body");
const cloudinary = require("../utils/config.cloudinary");

const userLoginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const userRegisValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  mobile: Joi.number().min(10).required(),
  images: Joi.array()
    .items({
      cloudinary_id: Joi.string().required(),
      url: Joi.string().required(),
    })
    .optional(),
});

const userUpdateValidation = Joi.object({
  email: Joi.string().email().optional(),
  mobile: Joi.number().min(10).optional(),
  mobile: Joi.number().min(10).optional(),
  images: Joi.array()
    .items({
      cloudinary_id: Joi.string().required(),
      url: Joi.string().required(),
    })
    .optional(),
});

exports.userRegis = async (req, res) => {
  try {
    const { value, error } = validateBody(req.body, userRegisValidation);
    if (error) {
      return response.BAD_REQUEST(res, error);
    }

    const { email, password, mobile } = value;

    const userDetails = await User.findOne({ email });

    if (userDetails) {
      return response.BAD_REQUEST(res, "User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      mobile,
      otp: 0,
      isActive: true,
      isDisabledByAdmin: false,
    });

    const savedUser = await newUser.save();

    return response.CREATED(res, savedUser, "User registered successfully");
  } catch (error) {
    console.log("Error userRegis", error);
    return response.INTERNAL_SERVER_ERROR(res, error.message);
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { value, error } = validateBody(req.body, userLoginValidation);
    if (error) {
      return response.BAD_REQUEST(res, error);
    }

    //username can be email or username
    const { email, password } = value;

    const userDetails = await User.findOne({ email });

    if (!userDetails) {
      return response.UNAUTHORIZED(
        res,
        "Invalid username or password (code 1001)"
      );
    }

    if (userDetails.isDisabledByAdmin) {
      return response.UNAUTHORIZED(
        res,
        "Your account has been disabled by admin"
      );
    }

    if (!userDetails.isActive) {
      return response.UNAUTHORIZED(res, "Your account is not active");
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      userDetails.password
    );
    if (!isPasswordMatch) {
      return response.UNAUTHORIZED(
        res,
        "Invalid username or password (code 1002)"
      );
    }

    const token = jwt.sign({ _id: userDetails._id }, process.env.SECRET_KEY);

    return response.OK(res, token, "Login Success");
  } catch (error) {
    console.log("Error userLogin", error);
    return response.INTERNAL_SERVER_ERROR(res, error.message);
  }
};

exports.userUpdate = async (req, res) => {
  try {
    const { value, error } = validateBody(req.body, userUpdateValidation);
    if (error) {
      return response.BAD_REQUEST(res, error);
    }

    const userDetails = await User.findById(req.params.userId);
    if (!userDetails) {
      return response.NOT_FOUND(res, "User not found");
    }

    if (userDetails.isDisabledByAdmin || !userDetails.isActive) {
      return response.FORBIDDEN(
        res,
        "Your account has been disabled by admin or not active"
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.userId },
      value,
      { new: true }
    );

    return response.OK(res, updatedUser, "User updated successfully");
  } catch (error) {
    console.log("Error userUpdate", error);
    return response.INTERNAL_SERVER_ERROR(res, error.message);
  }
};

exports.uploadImageToProfile = async (req, res) => {
  try {
    if (!req.file) {
      return response.BAD_REQUEST(res, "Please upload an image");
    }
    if (req.user[0].profile.cloudinary_id) {
      await cloudinary.uploader.destroy(req.user[0].profile.cloudinary_id);
    }
    const uploadedResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "userProfile",
    });
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user[0]._id },
      {
        profile: {
          cloudinary_id: uploadedResponse.public_id,
          url: uploadedResponse.secure_url,
        },
      },
      { new: true }
    );

    return response.OK(res, updatedUser, "Image uploaded successfully");
  } catch (error) {
    console.log("Error uploadImageToProfile", error);
    return response.INTERNAL_SERVER_ERROR(res, error.message);
  }
};

exports.uploadImageToBanner = async (req, res) => {
  try {
    if (!req.file) {
      return response.BAD_REQUEST(res, "Please upload an image");
    }

    const uploadedResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "userBanner",
    });
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user[0]._id },
      {
        banner: {
          cloudinary_id: uploadedResponse.public_id,
          url: uploadedResponse.secure_url,
        },
      },
      { new: true }
    );
    if (req.user[0].banner.cloudinary_id) {
      await cloudinary.uploader.destroy(req.user[0].banner.cloudinary_id);
    }

    return response.OK(res, updatedUser, "Image uploaded successfully");
  } catch (error) {
    console.log("Error uploadImageToBanner", error);
    return response.INTERNAL_SERVER_ERROR(res, error.message);
  }
};

exports.uploadImageToGallery = async (req, res) => {
  try {
    if (!req.files) {
      return response.BAD_REQUEST(res, "Please upload an image");
    }

    const uploadedResponse = await Promise.all(
      req.files.map(async (file) => {
        return await cloudinary.uploader.upload(file.path, {
          folder: "userGallery",
        });
      })
    );
    if (req.user[0].gallery.length > 0) {
      await Promise.all(
        req.user[0].gallery.map(async (item) => {
          await cloudinary.uploader.destroy(item.cloudinary_id);
        })
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user[0]._id },
      {
        gallery: uploadedResponse.map((item) => ({
          cloudinary_id: item.public_id,
          url: item.secure_url,
        })),
      },
      { new: true }
    );

    return response.OK(res, updatedUser, "Image uploaded successfully");
  } catch (error) {
    console.log("Error uploadImageToGallery", error);
    return response.INTERNAL_SERVER_ERROR(res, error.message);
  }
};

exports.publicProfile = async (req, res) => {
  try {
    let userDetails = await User.findById(req.params.userId).select(
      "-password -otp  -__v "
    );

    if (!userDetails) {
      return response.NOT_FOUND(res, "User not found");
    }

    if (userDetails.isDisabledByAdmin || !userDetails.isActive) {
      return response.FORBIDDEN(
        res,
        "User account has been disabled by admin or not active"
      );
    }

    return response.OK(res, userDetails, "User details");
  } catch (error) {
    console.log("Error publicProfile", error);
    return response.INTERNAL_SERVER_ERROR(res, error.message);
  }
};
