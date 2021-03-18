const whitelist = [process.env.FE_URL, process.env.CALLBACK_URL_SPOTIFY, process.env.CALLBACK_URL_DEEZER];
const corsOptions = {
	origin: (origin, callback) => {
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true, //Allow cookie
};

module.exports = corsOptions;
