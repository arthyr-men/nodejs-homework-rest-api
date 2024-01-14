const { Router } = require("express");
const router = Router();
const validateBody = require("../../middlewares/validateBody");
const {
  registerSchema,
  loginSchema,
  updateSubsSchema,
  updateAvatarSchema,
  resendVerify,
} = require("../../schemas/usersJoiSchema");
const authenticate = require("../../middlewares/authenticate");
const UserController = require("../../controllers/UserController");
const upload = require("../../middlewares/upload");

router.get("/current", authenticate, UserController.currentUser)

router.get("/verify/:verificationToken", UserController.verificationRequest);

router.post(
  "/register",
  validateBody(registerSchema),
  UserController.createUser
);

router.post(
  "/verify",
  validateBody(resendVerify),
  UserController.resendVerificationRequest
);

router.post("/login", validateBody(loginSchema), UserController.loginUser);

router.patch("/logout", authenticate, UserController.logout);

router.patch(
  "/",
  authenticate,
  validateBody(updateSubsSchema),
  UserController.updateSubscription
);

router.patch(
  "/avatars",
  authenticate,
  validateBody(updateAvatarSchema),
  upload.single("avatarURL"),
  UserController.changeAvatar
);

module.exports = router;
