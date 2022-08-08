const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const moviesRoutes = require("./routes/moviesRoutes");

const app = express();

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "*");
	res.setHeader("Access-Control-Allow-Headers", "*");
	next();
});

const storageConfig = multer.diskStorage({
	filename: (req, file, cb) => {
		cb(null, Math.random().toString());
	},
	
	destination: (req, file, cb) => {
		cb(null, "images");
	}
});

app.use("/images", express.static("images"));
app.use(express.json());
app.use(multer({ storage: storageConfig }).single("coverImage"));

app.use("/movies", moviesRoutes);

app.use((req, res) => {
	res.status(404).json({ message: "Route not found!" });
});

app.use((error, req, res, next) => {
	res.status(error.statusCode ?? 500)
		.json({ message: error.message ?? "Internal Server Error!" });
});

const init = async () => {
	await mongoose.connect("mongodb://localhost:27017/practice_rest_api");
	app.listen(process.env.PORT || 8000);
};

init();