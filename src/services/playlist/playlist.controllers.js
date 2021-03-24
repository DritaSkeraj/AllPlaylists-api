const { PlaylistModel } = require(".");
const ApiError = require("../../utils/errors/ApiError");

exports.createPlaylist = async (req, res, next) => {
  try {
    const authorId = req.user._id;
    const { name, author, tracks } = req.body;
    const foundPlaylistWithName = await PlaylistModel.findOne({ name });
    if (foundPlaylistWithName)
      throw new ApiError(400, "Playlist name already exists!");
    const newPlaylist = PlaylistModel({ ...req.body, authorId });
    await newPlaylist.save();
    res.status(200).send(newPlaylist);
  } catch (error) {
    console.log("Create playlist error: ", error);
    next(error);
  }
};

exports.getPlaylists = async (req, res, next) => {
  try {
    const user = req.user.username;
    const playlists = await PlaylistModel.find({ authorUsername: user });
    res.status(200).send(playlists);
  } catch (error) {
    console.log("Get playlists error: ", error);
    next(error);
  }
};

exports.getPlaylist = async (req, res, next) => {
  try {
    const user = req.user.username;
    const playlist = await PlaylistModel.findById(req.params.id);
    console.log("playlist: ", playlist)
    if (user !== playlist.authorUsername)
      throw new ApiError(401, "Unauthorized!");
    else {
    const { id } = req.params;
    const playlist = await PlaylistModel.findById(id);

    if (!playlist) throw new ApiError(404, "Playlist not found!");
    res.status(200).send(playlist);
    }
  } catch (error) {
    console.log("Get specific playlist error: ", error);
    next(error);
  }
};

exports.deletePlaylist = async (req, res, next) => {
  try {
    const user = req.user.username;
    const playlist = await PlaylistModel.findById(req.params.id);
    if (user !== playlist.authorUsername)
      throw new ApiError(401, "Unauthorized!");
    else {
    const { id } = req.params;
    const playlists = await PlaylistModel.findByIdAndDelete(id);
    res.status(200).send(playlists);
    }
  } catch (error) {
    console.log("Delete playlist error: ", error);
    next(error);
  }
};

exports.addSong = async (req, res, next) => {
  try {
    const user = req.user.username;
    const playlist = await PlaylistModel.findById(req.params.playlistId);
    if (user !== playlist.authorUsername)
      throw new ApiError(401, "Unauthorized!");
    else {
    const id = req.body.id;
    const platform = req.body.platform;
    const songToAdd = { id, platform };
    const playlist = await PlaylistModel.findByIdAndUpdate(
      req.params.playlistId,
      {
        $push: {
          songs: songToAdd,
        },
      },
      {
        runValidators: true,
        new: true,
      }
    );
    res.status(200).send(playlist);
    }
  } catch (error) {
    console.log("Error adding song in the playlist: ", error);
    next(error);
  }
};

exports.getPlaylistsSongs = async (req, res, next) => {
  try {
    const user = req.user.username;
    const playlist = await PlaylistModel.findById(req.params.playlistId);
    if (user !== playlist.authorUsername)
      throw new ApiError(401, "Unauthorized!");
    else {
    const playlist = await PlaylistModel.findById(req.params.playlistId);
    if (!playlist) throw new ApiError(404, "Playlist not found!");
    res.status(200).send(playlist.songs);
    }
  } catch (error) {
    console.log("Error getting playlists songs: ", error);
    next(error);
  }
};

exports.getSong = async (req, res, next) => {
  try {
    const user = req.user.username;
    const playlist = await PlaylistModel.findById(req.params.playlistId);
    if (user !== playlist.authorUsername)
      throw new ApiError(401, "Unauthorized!");
    else {
    const song = await PlaylistModel.findById(req.params.playlistId, {
      songs: {
        $elemMatch: { id: req.params.songId },
      },
    });
    const result = song.songs[0];
    console.log("song::::", result);
    if (!song) throw new ApiError(404, "Song Not found!");
    res.status(200).send(result);
  }
  } catch (error) {
    console.log("Error getting song: ", error);
    next(error);
  }
};

exports.deleteSong = async (req, res, next) => {
  try {
    const user = req.user.username;
    const playlist = await PlaylistModel.findById(req.params.playlistId);
    if (user !== playlist.authorUsername)
      throw new ApiError(401, "Unauthorized!");
    else {
      const modifiedPlaylist = await PlaylistModel.findByIdAndUpdate(
        req.params.playlistId,
        {
          $pull: {
            songs: { _id: req.params.songId },
          },
        }
      );
      res.status(200).send(modifiedPlaylist);
    }
  } catch (error) {
    console.log("Error deleting song from playlist: ", error);
    next(error);
  }
};
