const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const response = require("../utils/default-response");

const UserMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies["rv-token"] || req.headers["rv-token"];
    if (!token) {
      return response.UNAUTHORIZED(
        res,
        "Token is required to access this resource"
      );
    }
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.find({
      _id: verifyUser._id,
      isActive: true,
      isDisabledByAdmin: false,
    });
    if (user.length === 0) {
      return response.NOT_FOUND(res, "User not found");
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.log("Error UserMiddleware", error);
    if (error.name === "TokenExpiredError") {
      return response.FORBIDDEN(res, "Token is expired");
    }
    return response.INTERNAL_SERVER_ERROR(res, error.message);
  }
};

module.exports = UserMiddleware;
