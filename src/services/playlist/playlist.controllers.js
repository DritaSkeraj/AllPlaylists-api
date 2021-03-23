const { PlaylistModel } = require(".");
const ApiError = require("../../utils/errors/ApiError");

exports.createPlaylist = async(req, res, next) => {
    try{
        const { name, author, tracks } = req.body;
        const foundPlaylistWithName = await PlaylistModel.findOne({name});
        if(foundPlaylistWithName)
            throw new ApiError(400, "Playlist name already exists!")
        const newPlaylist = PlaylistModel({ ... req.body });
        await newPlaylist.save();
        res.status(200).send(newPlaylist);
    } catch(error) {
        console.log("Create playlist error: ", error);
        next(error);
    }
}

exports.getPlaylists = async(req, res, next) => {
    try{
        const user = req.user.username;
        const playlists = await PlaylistModel.find({authorUsername: user});
        res.status(200).send(playlists);
    } catch(error) {
        console.log("Get playlists error: ", error);
        next(error);
    }
}

exports.getPlaylist = async(req, res, next) => {
    try{
        const { playlistId } = req.params;
        const playlist = await PlaylistModel.findById(playlistId);

        if(!playlist)
            throw new ApiError(404, "Playlist not found!");
        res.status(200).send(playlist)
    } catch(error) {
        console.log("Get specific playlist error: ", error);
        next(error);
    }
}