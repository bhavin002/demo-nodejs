const router = require("express").Router();
const UserMiddleware = require("../middleware/user.middleware");
const upload = require("../utils/config.multer");

const { bookAppointment } = require("../controller/appointment.controller");

// Appointment routes
router.post("/book", bookAppointment);

module.exports = router;
