const router = require("express").Router();
const UserMiddleware = require("../middleware/user.middleware");
const upload = require("../utils/config.multer");

const {
  userLogin,
  userRegis,
  userUpdate,
  uploadImageToProfile,
  uploadImageToBanner,
  uploadImageToGallery,
} = require("../controller/user.controller");

router.post("/login", userLogin);
router.post("/register", userRegis);
router.patch("/update/:userId", UserMiddleware, userUpdate);
router.post(
  "/upload-profile",
  UserMiddleware,
  upload.single("profile"),
  uploadImageToProfile
);
router.post(
  "/upload-banner",
  UserMiddleware,
  upload.single("banner"),
  uploadImageToBanner
);
router.post(
  "/upload-gallery",
  UserMiddleware,
  upload.array("gallery"),
  uploadImageToGallery
);

module.exports = router;
