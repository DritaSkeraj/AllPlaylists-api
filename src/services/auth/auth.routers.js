const authRouter = require("express").Router();
const handleTokens = require("../../middlewares/handleTokens");
const { validateToken } = require("../../middlewares/validateToken");
const {
	refreshTokenHandler,
	logout,
	signup,
	login,
} = require("./auth.controllers");

authRouter.get("/refreshToken", refreshTokenHandler);
authRouter.get("/logout", validateToken, logout);
authRouter.get("/test", validateToken, (req, res) => {
	res.send(req.user);
});
authRouter.post("/login", login);
authRouter.post("/signup", signup);

module.exports = authRouter;
