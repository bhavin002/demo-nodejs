const Joi = require("joi");

const User = require("../models/user.model");
const Appointment = require("../models/appointment.model");
const response = require("../utils/default-response");
const { validateBody } = require("../utils/validate-body");

const bookAppointmentValidation = Joi.object({
  userId: Joi.string().required(),
  patientName: Joi.string().required(),
  mobile: Joi.number().min(10).required(),
  message: Joi.string().optional(),
  appointmentDate: Joi.date().required(),
  appointmentTime: Joi.string().required(),
  status: Joi.string()
    .optional()
    .valid("pending", "approved", "cancelled")
    .default("pending"),
});

exports.bookAppointment = async (req, res) => {
  try {
    const { value, error } = validateBody(req.body, bookAppointmentValidation);
    if (error) {
      return response.BAD_REQUEST(res, error);
    }

    const {
      userId,
      patientName,
      mobile,
      message,
      appointmentDate,
      appointmentTime,
      status,
    } = value;

    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return response.NOT_FOUND(res, "User not found");
    }

    if (userDetails.isDisabledByAdmin || !userDetails.isActive) {
      return response.FORBIDDEN(
        res,
        "Your account has been disabled by admin or not active"
      );
    }

    const newAppointment = new Appointment({
      userId,
      patientName,
      mobile,
      message,
      appointmentDate,
      appointmentTime,
      status,
    });

    const savedAppointment = await newAppointment.save();

    return response.CREATED(
      res,
      savedAppointment,
      "Appointment booked successfully"
    );
  } catch (error) {
    console.log("Error bookAppointment", error);
    return response.INTERNAL_SERVER_ERROR(res, error.message);
  }
};
