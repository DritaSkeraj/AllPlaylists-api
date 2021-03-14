const services = require("express").Router();
const { authRoute } = require("./auth");
const userRouter = require("./user/user.routers");

services.use("/users", userRouter);
services.use("/auth", authRoute);

module.exports = services;