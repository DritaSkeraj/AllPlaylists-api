const playlistRouter = require("express").Router();
const { validateToken } = require("../../middlewares/validateToken");
const {
    createPlaylist,
    getPlaylists, 
    getPlaylist
} = require("./playlist.controllers");

playlistRouter.post("/", validateToken, createPlaylist);
playlistRouter.get("/", validateToken, getPlaylists);
playlistRouter.get("/:id", validateToken, getPlaylist);

module.exports = playlistRouter;