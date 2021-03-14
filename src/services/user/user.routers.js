const userRouter = require("express").Router();
const passport = require("passport");
const cloudinaryMulter = require("../../middlewares/cloudinary");

const { validateToken } = require("../../middlewares/validateToken");
const {
	getUserProfile,
	getAllUsers,
	getUserById,
	editUserProfile,
	deleteUserProfile,
	editUserImage,
	getUserByUsername,
	spotifyAuthenticate,
} = require("./user.controllers");

userRouter.get("/me", validateToken, getUserProfile);
userRouter.get("/", validateToken, getAllUsers);
userRouter.get("/:userId", validateToken, getUserById);
userRouter.put("/me/edit", validateToken, editUserProfile);
userRouter.delete("/me/profile/delete", validateToken, deleteUserProfile);
userRouter.get("/user/:username", validateToken, getUserByUsername);
userRouter.put("/me/update/image", cloudinaryMulter.single("image"), validateToken,	editUserImage);

userRouter.get("/users/spotifyLogin", passport.authenticate("spotify", { scope: ["profile", "email"] }))
userRouter.get("/users/spotifyRedirect", passport.authenticate("spotify"), spotifyAuthenticate)

module.exports = userRouter;
