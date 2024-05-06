const router = require("express").Router();
const { addEnquiry } = require("../controller/enquiry.controller");

// Enquiry routes
router.post("/add", addEnquiry);

module.exports = router;
