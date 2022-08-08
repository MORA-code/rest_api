const express = require("express");
const mongoose = require("mongoose");
const moviesRoutes = require("./routes/moviesRoutes");

const app = express();

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