const express = require("express");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();
require("./db/conn");

const PORT = process.env.PORT;

app.get("/", (req, res) => res.send("Express on Vercel new one"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());
app.use(cors());

const { publicProfile } = require("./controller/user.controller");

app.get("/public/:userId", publicProfile);

const userRouter = require("./routes/user.route");
const appointmentRouter = require("./routes/appointment.route");
const enquiryRouter = require("./routes/enquiry.route");

app.use("/user", userRouter);
app.use("/appointment", appointmentRouter);
app.use("/enquiry", enquiryRouter);

app.listen(PORT, () => {
  console.log(`Server Running At PORT : ${PORT}`);
});

module.exports = app;