const userRouter = require("express").Router();
const passport = require("passport");
const cloudinaryMulter = require("../../middlewares/cloudinary");
const { handleTokens, redirect } = require("../../middlewares/handleTokens");

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

  (req, res, next) => {
    passport.authenticate("spotify", {
      state: req.query.state,
      scope: [
        "user-read-email",
        "user-read-private",
        "user-read-playback-state",
        "streaming",
        "user-modify-playback-state",
        "playlist-modify-public",
        "user-library-modify",
        "user-top-read",
        "playlist-read-collaborative",
        "user-read-currently-playing",
        "playlist-read-private",
        "user-follow-read",
        "user-read-recently-played",
        "playlist-modify-private",
        "user-library-read",
      ],
      showDialog: true,
    })(req, res, next);
  }
);
userRouter.get(
  "/spotifyRedirect",
  (req, res, next) => {
    passport.authenticate("spotify", {
      scope: [
        "user-read-email",
        "user-read-private",
        "user-read-playback-state",
        "streaming",
        "user-modify-playback-state",
        "playlist-modify-public",
        "user-library-modify",
        "user-top-read",
        "playlist-read-collaborative",
        "user-read-currently-playing",
        "playlist-read-private",
        "user-follow-read",
        "user-read-recently-played",
        "playlist-modify-private",
        "user-library-read",
      ],
      showDialog: true,
    })(req, res, next);
  },
  redirect
  //handleTokens
);

userRouter.get("/googleLogin", (req, res, next) => {
  passport.authenticate("google", {
    state: req.query.state,
    scope: [
      "email",
      "profile",
      "openid",
      "https://www.googleapis.com/auth/youtube",
    ],
    showDialog: true,
    prompt: "consent",
    accessType: "offline",
  })(req, res, next);
});
userRouter.get(
  "/googleRedirect",
  (req, res, next) => {
    passport.authenticate("google", {
      state: req.query.state,
      scope: [
        "email",
        "profile",
        "openid",
        "https://www.googleapis.com/auth/youtube",
      ],
      showDialog: true,
      prompt: "consent",
      accessType: "offline",
    })(req, res, next);
  },
  //passport.authenticate("google", { scope: [ "email", "profile" ] }),
  redirect
  //handleTokens
);

userRouter.get("/deezerLogin", (req, res, next) => {
  passport.authenticate("deezer", { state: req.query.state, scope: [
    "basic_access",
    "email",
    "manage_library"
  ] })(req, res, next);
});

userRouter.get(
  "/deezerRedirect",
  (req, res, next) => {
    passport.authenticate("deezer", { state: req.query.state, scope: [
      "basic_access",
      "email",
      "manage_library"
    ] })(req, res, next);
  },
  redirect
  //handleTokens
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
