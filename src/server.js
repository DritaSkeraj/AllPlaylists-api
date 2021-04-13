const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const services = require("./services");
const cookieParser = require("cookie-parser");
const corsOptions = require("./utils/server/corsOptions");
const passport = require("passport");
const oauth = require("./services/auth/oauth.strategies")
//➡ Initial Setup
const { PORT, MONGO_CONNECTION_STRING } = process.env;
const server = express();
const httpServer = http.createServer(server);
const listEndpoints = require("express-list-endpoints");
//➡ Middlewares
server.use(express.json());
server.use(passport.initialize());
console.log(corsOptions)
server.use(cors(corsOptions));
server.use(cookieParser());

//➡ Services
server.use("/api", services);
//➡ Error handling
require("./middlewares/errorHandling")(server);

mongoose
	.connect(MONGO_CONNECTION_STRING, {
		useCreateIndex: true,
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useFindAndModify: true,
	})
	.then(() => console.log("✔ Connected to DB..."))
	.catch((e) => console.log("❌ DB connection error: ", e));
server.listen(PORT, () => {
	if (server.get("env") === "production") {
		console.log("🚀 Server is running on CLOUD on PORT: ", PORT);
        //console.log(listEndpoints(server));
	} else {
		console.log("🚀 Server is running LOCALLY on PORT: ", PORT);
        //console.log(listEndpoints(server));
	}
});
