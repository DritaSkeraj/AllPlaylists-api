const userRouter = require("express").Router();
const passport = require("passport");
const cloudinaryMulter = require("../../middlewares/cloudinary");
const {handleTokens, redirect} = require("../../middlewares/handleTokens");

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

   (req,res,next)=>{
    
    passport.authenticate("spotify",{state:req.query.state})(req,res,next)
  }
);
userRouter.get(
  "/spotifyRedirect",
  (req,res,next)=>{
   
   passport.authenticate("spotify")(req,res,next)
 },
  redirect
  //handleTokens
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

userRouter.get(
  "/deezerLogin",
  passport.authenticate("deezer", { scope: [ "email", "profile" ] })
);
userRouter.get(
  "/deezerRedirect",
  passport.authenticate("deezer" ),
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
