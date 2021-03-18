const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const SpotifyStrategy = require("passport-spotify").Strategy;
const DeezerStrategy = require("passport-deezer").Strategy;
const mongoose = require("mongoose");
const UserModel = require("../user/user.schema");
const {generateTokens} = require("../../utils/auth/jwt");
const uniqid = require("uniqid");

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
          nickname: profile.displayName,
          email: profile.emails
        };
  
        try {
          const user = await UserModel.findOne({ spotifyId: profile.id });
  
          if (user) {
            const tokens = await generateTokens(user);
            next(null, { user, tokens });
          } else {
            const createdUser = new UserModel({...newUser, spotifyId: profile.id});
            await createdUser.save();
            const tokens = await generateTokens(createdUser);
            next(null, { user: createdUser, tokens });
          }
        } 
        // try {
        //   /*
        //     1. find the user by id
        //     2. check if that user has a spotify account
        //     3. if not, update the user
        //   */
        //  //1
        //   const id = "6053c787656e3c1848ea218f";
        //   const user = await UserModel.findById(id)
  
        //   if (user) {
        //     //2
        //   if(user.spotifyAccount.hasOwnProperty("_id")){
        //     console.log("user already has a spotify account registered");
        //   } else {
        //     //3
        //     const updatedUser = await UserModel.findByIdAndUpdate(
        //       id,
        //       {
        //         spotifyAccount: {...newUser, _id: uniqid()},
        //       },
        //       {
        //         runValidators: true,
        //         new: true,
        //       }
        //     );
        //   }
        //     //const tokens = await generateTokens(user);
        //     next(null, { user }); //, tokens });
        //     return updatedUser;
        //   } else {
        //     const createdUser = new UserModel({...newUser, spotifyId: profile.id});
        //     await createdUser.save();
        //     const tokens = await generateTokens(createdUser);
        //     next(null, { user: createdUser, tokens });
        //   }
        // } 
        catch (error) {
          next(error);
        }
      }
    )
  );

  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: process.env.CALLBACK_URL_GOOGLE,
      },
      async (request, accessToken, refreshToken, profile, next) => {
        console.log("google Profile: ", profile)
        const newUser = {
          googleId: profile.id,
          name: profile.name.givenName,
          surname: profile.name.familyName,
          email: profile.emails[0].value,
          refreshTokens: []
        };
  
        try {
          const user = await UserModel.findOne({ googleId: profile.id });
          console.log(user);
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

  
  passport.use(
    "deezer",
    new DeezerStrategy(
      {
        clientID: process.env.DEEZER_ID,
        clientSecret: process.env.DEEZER_SECRET,
        callbackURL: process.env.CALLBACK_URL_DEEZER,
      },
      async (request, accessToken, refreshToken, profile, next) => {
        console.log("deezer Profile: ", profile)
        const newUser = {
          deezerId: profile.id,
          name: profile.name,
          //surname: profile.name.split(" ")[1],
          picture: profile.picture,
          refreshTokens: []
        };
  
        try {
          const user = await UserModel.findOne({ deezerId: profile.id });
          console.log(user);
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
  