const whitelist = ['https://all-playlists-fe.herokuapp.com', process.env.CALLBACK_URL_SPOTIFY, process.env.CALLBACK_URL_DEEZER];
const corsOptions = {
	origin: (origin, callback) => {
		console.log(`Òrigin is` + origin)
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			console.log("allowed")
			callback(null, true);
		
		} else {
			console.log("denied")
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true, //Allow cookie
	exposedHeaders: ["set-cookie"]
};

module.exports = corsOptions;
