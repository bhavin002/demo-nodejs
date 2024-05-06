const enquirySchema = require("../models/enquiry.model");
const response = require("../utils/default-response");
const { validateBody } = require("../utils/validate-body");
const Joi = require("joi");

const enquiryValidation = Joi.object({
  userId: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile: Joi.number().min(10).required(),
  message: Joi.string().required(),
  status: Joi.string()
    .optional()
    .valid("pending", "approved", "cancelled")
    .default("pending"),
});

exports.addEnquiry = async (req, res) => {
  try {
    const { value, error } = validateBody(req.body, enquiryValidation);
    if (error) {
      return response.BAD_REQUEST(res, error);
    }

    const { userId, name, email, mobile, message, status } = value;

    const newEnquiry = new enquirySchema({
      userId,
      name,
      email,
      mobile,
      message,
      status,
    });

    const savedEnquiry = await newEnquiry.save();

    return response.CREATED(res, savedEnquiry);
  } catch (error) {
    return response.INTERNAL_SERVER_ERROR(res, error);
  }
};
