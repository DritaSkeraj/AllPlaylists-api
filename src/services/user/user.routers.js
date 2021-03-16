const userRouter = require("express").Router();
const passport = require("passport");
const cloudinaryMulter = require("../../middlewares/cloudinary");
const handleTokens = require("../../middlewares/handleTokens");

const { validateToken } = require("../../middlewares/validateToken");
const {
  getUserProfile,
  getAllUsers,
  getUserById,
  editUserProfile,
  deleteUserProfile,
  editUserImage,
  getUserByUsername,
} = require("./user.controllers");

userRouter.get(
  "/spotifyLogin",
  passport.authenticate("spotify", { scope: ["profile", "email"] })
);
userRouter.get(
  "/spotifyRedirect",
  passport.authenticate("spotify"),
  handleTokens
);

userRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: [ "email", "profile" ] })
);
userRouter.get(
  "/googleRedirect",
  passport.authenticate("google", { scope: [ "email", "profile" ] }),
  handleTokens
);

userRouter.get("/me", validateToken, getUserProfile);
userRouter.get("/", validateToken, getAllUsers);
userRouter.get("/:userId", validateToken, getUserById);
userRouter.put("/me/edit", validateToken, editUserProfile);
userRouter.delete("/me/profile/delete", validateToken, deleteUserProfile);
userRouter.get("/user/:username", validateToken, getUserByUsername);
userRouter.put(
  "/me/update/image",
  cloudinaryMulter.single("image"),
  validateToken,
  editUserImage
);

module.exports = userRouter;
