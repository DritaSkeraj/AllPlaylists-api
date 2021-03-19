const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const SpotifyStrategy = require("passport-spotify").Strategy;
const DeezerStrategy = require("passport-deezer").Strategy;
const mongoose = require("mongoose");
const UserModel = require("../user/user.schema");
const { generateTokens,verifyJWT } = require("../../utils/auth/jwt");
const axios = require("axios");
const uniqid = require("uniqid");
const jwt = require("jsonwebtoken");

/**
 * 
     User clicks signup w spotify

     USer clicks signin w spotify


 */

const getCurrentUser = async () => {
  try {
    // const url = `https://jsonplaceholder.typicode.com/todos/1`;
    // const response = await axios.get(url)
    // console.log({"currentUser: ": response.data})
    const url = `${process.env.BE_URL}users/me`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDUzZDlmNTZhZDNlODQ3OGMwM2I2Y2MiLCJpYXQiOjE2MTYxNTMxNjQsImV4cCI6MTYxNjE1NDA2NH0.dOwxOyh6gszQGisz5v2L_PT57sriDmlZHfGkoDpcpB4`,
      },
    });
    console.log({ "currentUser: ": response.data });
  } catch (err) {
    console.log({ "error while getting current user: ": err });
  }
};

passport.use(
  "spotify",
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_ID,
      clientSecret: process.env.SPOTIFY_SECRET,
      callbackURL: process.env.CALLBACK_URL_SPOTIFY,
      passReqToCallback:true,
    },
    async (request, accessToken, refreshToken, profile, next) => {
      //console.log("spotify profile: ", profile);
        const decoded = Buffer.from(request.query.state,"base64").toString()
       const [key,value] =decoded.split("=")
       console.log(value)
       const {_id} = await verifyJWT(value)
       console.log(_id)
      try {
        let user = await UserModel.findById(_id);

        if (user) {
          console.log(user)
           await user.update({spotifyAccount:profile})
          next(null, { user });
        } else {
          console.log("no user")
           const error = new Error("This account not exist")
           next(error, null);
        }
      } catch (error) {
        next(error, null);
      }

      // try {
      //   /*
      //     1. find the user by id
      //     2. check if that user has a spotify account
      //     3. if not, update the user
      //   */
      //  //1
      //   const currentUser = await getCurrentUser();
      //   const id = "6053d9f56ad3e8478c03b6cc";
      //   const user = await UserModel.findById(id)
      //   console.log("👩‍💻 user: ", user);

      //   if (user) {
      //     //2
      //   if(user.spotifyAccount.hasOwnProperty("_id")){
      //     console.log("user already has a spotify account registered");
      //   } else {
      //     //3
      //     try{
      //     console.log("user doesnt have a spotify account registered. trying to add it. The new user is: ", newUser)
      //     let userToAdd = {
      //       ...user.spotifyAccount,
      //       ...newUser,
      //       "name": "bond. james bond"
      //     }
      //     console.log("➕user to add: ", userToAdd)
      //     const updatedUser = await UserModel.findByIdAndUpdate(
      //       id,
      //       {
      //         $set: {spotifyAccount: userToAdd},
      //       }
      //       // ,{
      //       //   runValidators: true,
      //       //   new: true,
      //       // }
      //     );
      //     //const tokens = await generateTokens(user);
      //     next(null, { user }); //, tokens });
      //     console.log("updatedUser: ", updatedUser)
      //     console.log("new user", {...newUser})
      //     return updatedUser;
      //     } catch(err){
      //       console.log("some error: ", err);
      //       next(err)
      //     }
      //   }
      //   } else {
      //     console.log("no such user with jwt account")
      //     // const createdUser = new UserModel({...newUser, spotifyId: profile.id});
      //     // await createdUser.save();
      //     // const tokens = await generateTokens(createdUser);
      //     // next(null, { user: createdUser, tokens });
      //   }
      // }
      // catch (error) {
      //   next(error);
      // }
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
      console.log("google Profile: ", profile);
      const newUser = {
        googleId: profile.id,
        name: profile.name.givenName,
        surname: profile.name.familyName,
        email: profile.emails[0].value,
        refreshTokens: [],
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
      console.log("deezer Profile: ", profile);
      const newUser = {
        deezerId: profile.id,
        name: profile.name,
        //surname: profile.name.split(" ")[1],
        picture: profile.picture,
        refreshTokens: [],
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
