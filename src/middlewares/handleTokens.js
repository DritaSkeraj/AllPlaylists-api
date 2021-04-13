const handleTokens = async (req, res, next) => {
  try {
    const { token, refreshToken } = req.user.tokens;
    res.cookie("token", token,{
		path:'/',
		 httpOnly: true,
		  
		secure:true,
		sameSite:"none" });
    res.cookie("refreshToken", refreshToken,{
		path:'/',
		 httpOnly: true,
		  
		secure:true,
		sameSite:"none" });
    res.cookie("isAuthUser", true,{
		path:'/',
		 httpOnly: true,
		  
		secure:true,
		sameSite:"none" });
    res.redirect(`${process.env.FE_URL}/main`);
  } catch (error) {
    console.log("Handle tokens error", error);
    next(error);
  }
};

const redirect = async (req, res, next) => {
  try {
    res.redirect(`${process.env.FE_URL}main`);
  } catch (err) {
    console.log("Handle tokens error", error);
    next(error);
  }
};

module.exports = { handleTokens, redirect };
