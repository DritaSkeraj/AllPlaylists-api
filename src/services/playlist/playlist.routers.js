const playlistRouter = require("express").Router();
const { validateToken } = require("../../middlewares/validateToken");
const {
    createPlaylist,
    getPlaylists, 
    getPlaylist,
    deletePlaylist, 
    addSong,
    getPlaylistsSongs, 
    getSong, 
    deleteSong
} = require("./playlist.controllers");

playlistRouter.post("/", validateToken, createPlaylist);
playlistRouter.get("/", validateToken, getPlaylists);
playlistRouter.get("/:id", validateToken, getPlaylist);
playlistRouter.delete("/:id", validateToken, deletePlaylist)
playlistRouter.post("/:playlistId/song/", validateToken, addSong)
playlistRouter.get("/:playlistId/song/", validateToken, getPlaylistsSongs)
playlistRouter.get("/:playlistId/song/:songId", validateToken, getSong)
playlistRouter.delete("/:playlistId/song/:songId", validateToken, deleteSong)

module.exports = playlistRouter;