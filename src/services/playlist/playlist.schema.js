const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    authorUsername: {
      type: String,
      required: true,
    },
    songs: {
      type: [
        {
          id: {
            type: String,
            required: true,
          },
          platform: {
            type: String,
            enum: ["spotify", "youtube", "deezer"],
            required: true,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const Playlist = mongoose.model("Playlist", PlaylistSchema);
module.exports = Playlist;
