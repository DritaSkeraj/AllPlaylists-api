const userRouter = require("express").Router();
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
} = require("./user.controllers");

userRouter.get("/me", validateToken, getUserProfile);
userRouter.get("/", validateToken, getAllUsers);
userRouter.get("/:userId", validateToken, getUserById);
userRouter.put("/me/edit", validateToken, editUserProfile);
userRouter.delete("/me/profile/delete", validateToken, deleteUserProfile);
userRouter.get("/user/:username", validateToken, getUserByUsername);
userRouter.put("/me/update/image", cloudinaryMulter.single("image"), validateToken,	editUserImage);

module.exports = userRouter;
