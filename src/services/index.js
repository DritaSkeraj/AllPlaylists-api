const services = require("express").Router();
const { authRoute } = require("./auth");
const userRouter = require("./user/user.routers");
const playlistRouter = require("./playlist/playlist.routers");

services.use("/users", userRouter);
services.use("/auth", authRoute);
services.use("/playlists", playlistRouter);

module.exports = services;