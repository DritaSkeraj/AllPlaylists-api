const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const SpotifyStrategy = require("passport-spotify").Strategy;
const DeezerStrategy = require("passport-deezer").Strategy;
const mongoose = require("mongoose");
const UserModel = require("../user/user.schema");
const { generateTokens, verifyJWT } = require("../../utils/auth/jwt");
const axios = require("axios");
const uniqid = require("uniqid");
const jwt = require("jsonwebtoken");

/**
 * 
     User clicks signup w spotify

     USer clicks signin w spotify

 */

getSpotifyPlaylists = async (accessToken) => {
  try {
    return await axios.get("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (err) {
    console.log("error getting spotify playlists: ", err);
  }
};

getYoutubePlaylists = async (accessToken) => {
  try {
    return await axios.get(
      `https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&maxResults=25&mine=true&key=process.env.GOOGLE_ID`
      // `https://developers.google.com/apis-explorer/#p/youtube/v3/youtube.playlists.list?
      // part=snippet,contentDetails
      // &mine=true`
      , {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  } catch (err) {
    console.log("error getting yt playlists: ", err);
  }
};

// getPlaylistTracks = async(playlistUri, accessToken) => {
//   try{
//     return await axios.get(`https://api.spotify.com/v1/playlists/${playlistUri}/tracks`, {
//       headers: { Authorization: `Bearer ${accessToken}`}
//     })
//   }catch(err) {
//     console.log("error getting playlist tracks: ")
//   }
// }

passport.use(
  "spotify",
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_ID,
      clientSecret: process.env.SPOTIFY_SECRET,
      callbackURL: process.env.CALLBACK_URL_SPOTIFY,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, next) => {
      // getting playlists from spotify account
      console.log("accessToken: ", accessToken, "refreshToken: ", refreshToken);
      const mySpotifyPlaylists = await getSpotifyPlaylists(accessToken);
      const sPlaylists = mySpotifyPlaylists.data.items;

      // decoding state form front-end url
      const decoded = Buffer.from(request.query.state, "base64").toString();
      const [key, value] = decoded.split("=");
      const { _id } = await verifyJWT(value);

      //adding the user's account in the DB
      try {
        let user = await UserModel.findById(_id);

        if (user) {
          await user.update({ spotifyAccount: { profile, sPlaylists } });
          next(null, { user });
        } else {
          const error = new Error("This account not exist");
          next(error, null);
        }
      } catch (error) {
        next(error, null);
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
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, next) => {
      try {
        // getting playlists from yt account
        console.log(
          "yt accessToken: ",
          accessToken,
          "yt refreshToken: ",
          refreshToken
        );
        const myYoutubePlaylists = await getYoutubePlaylists(accessToken);
        const ytPlaylists = myYoutubePlaylists.data;
        console.log("youtube playlists: ", ytPlaylists);

        const decoded = Buffer.from(request.query.state, "base64").toString();
        const [key, value] = decoded.split("=");
        //console.log("value: ", value)
        const { _id } = await verifyJWT(value);
        //console.log("_id: ", _id)
        //console.log("google profile: ", profile)
        let user = await UserModel.findById(_id);

        if (user) {
          //console.log("main user acc: ", user)
          //await user.update({googleAccount:profile})
          try {
            await UserModel.findByIdAndUpdate(_id, { googleAccount: {profile, ytPlaylists}});
          } catch (err) {
            const error = new Error("couldn't update user");
            next(error, null);
          }
          next(null, { user });
        } else {
          //console.log("no user")
          const error = new Error("This account not exist");
          next(error, null);
        }
      } catch (error) {
        next(error, null);
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
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, next) => {
      const decoded = Buffer.from(request.query.state, "base64").toString();
      const [key, value] = decoded.split("=");
      //console.log("token: ", value)
      const { _id } = await verifyJWT(value);
      //console.log("_id: ", _id)
      //console.log("deezer profile: ", profile)
      try {
        let user = await UserModel.findById(_id);

        if (user) {
          //console.log(user)
          await user.update({ deezerAccount: profile });
          next(null, { user });
        } else {
          //console.log("no user")
          const error = new Error("This account does not exist");
          next(error, null);
        }
      } catch (error) {
        next(error, null);
      }
    }
  )
);

passport.serializeUser(function (user, next) {
  next(null, user);
});
