const passport = require("passport");
//const GoogleStrategy = require("passport-google-oauth20").Strategy;
const SpotifyStrategy = require("passport-spotify").Strategy;
const mongoose = require("mongoose");
const UserModel = require("../user/user.schema");
const {generateTokens} = require("../../utils/auth/jwt");

passport.use(
    "spotify",
    new SpotifyStrategy(
      {
        clientID: process.env.SPOTIFY_ID,
        clientSecret: process.env.SPOTIFY_SECRET,
        callbackURL: process.env.CALLBACK_URL_SPOTIFY,
      },
      async (request, accessToken, refreshToken, profile, next) => {
        console.log("spotify profile: ", profile);
        const newUser = {
          spotifyId: profile.id,
          nickname: profile.display_name,
          email: profile.emails
        };
  
        try {
          const user = await UserModel.findOne({ spotifyId: profile.id });
  
          if (user) {
            const tokens = await generateTokens(user);
            next(null, { user, tokens });
          } else {
            const createdUser = new UserModel(newUser);
            await createdUser.save();
            const tokens = await generateTokens(createdUser);
            next(null, { user: createdUser, tokens });
          }
        } catch (error) {
          next(error);
        }
      }
    )
  );
  
  passport.serializeUser(function (user, next) {
    next(null, user);
  });
  