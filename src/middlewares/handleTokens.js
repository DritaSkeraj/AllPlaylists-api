const handleTokens = async (req, res, next) => {
	try {
		const { token, refreshToken } = req.user.tokens;
		res.cookie("token", token, { httpOnly: true });
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			path: "/api/auth/refreshToken",
		});
		res.cookie("isAuthUser", true);
		res.redirect(`${process.env.FE_URL}/main`);
	} catch (error) {
		console.log("Handle tokens error", error);
		next(error);
	}
};

const redirect = async (req, res, next) => {
	try{
		res.redirect(`${process.env.FE_URL}/main`);
	} catch(err){
		console.log("Handle tokens error", error);
		next(error);
	}
}

module.exports = {handleTokens, redirect};
