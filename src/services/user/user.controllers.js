const { UserModel } = require(".");
const ApiError = require("../../utils/errors/ApiError");

exports.getUserProfile = async (req, res, next) => {
	try {
		res.status(200).send(req.user);
	} catch (error) {
		console.log("user get profile error: ", error);
		next(error);
	}
};

exports.editUserProfile = async (req, res, next) => {
	try {
		const userId = req.user._id;

		const editedProfile = await UserModel.findByIdAndUpdate(
			userId,
			{
				$set: { ...req.body },
			},
			{ new: true }
		);
		if (!editedProfile) throw new ApiError(404, "User not found");

		res.status(201).send(editedProfile);
	} catch (error) {
		console.log("user edit profile error: ", error);
		next(error);
	}
};

exports.editUserImage = async (req, res, next) => {
	try {
		const userId = req.user._id;
		const imgUrl = req.file.path;
		const editedProfile = await UserModel.findByIdAndUpdate(
			userId,
			{
				$set: {
					image: imgUrl,
				},
			},
			{ new: true }
		);
		if (!editedProfile) throw new ApiError(404, "User not found");

		res.status(201).send(editedProfile);
	} catch (error) {
		console.log("user edit image error: ", error);
		next(error);
	}
};

exports.deleteUserProfile = async (req, res, next) => {
	try {
		console.log("🔴🔴🔴🔴🔴")
		const user = req.user;
		const deletedProfile = await UserModel.findByIdAndDelete(user._id);

		if (!deletedProfile) throw new ApiError(404, "User not found");

		res.status(200).send("Successfuly deleted");
	} catch (error) {
		console.log("user delete error: ", error);
		next(error);
	}
};
exports.getUserByUsername = async (req, res, next) => {
	try {
		const { username } = req.params;
		const user = await UserModel.findOne({ username });
		if (!user) throw new ApiError(404, "User not found!");

		res.status(200).send(user);
	} catch (error) {
		console.log("get user by id error: ", error);
		next(error);
	}
};
exports.getAllUsers = async (req, res, next) => {
	try {
		const users = await UserModel.find({});

		res.status(200).send(users);
	} catch (error) {
		console.log("get all users error: ", error);
		next(error);
	}
};

exports.getUserById = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const user = await UserModel.findById(userId);

		if (!user) throw new ApiError(404, "User not found!");
		res.status(200).send(user);
	} catch (error) {
		console.log("get userbyId error: ", error);
		next(error);
	}
};
