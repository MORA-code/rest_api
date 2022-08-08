const express = require("express");
const mongoose = require("mongoose");

const app = express();

const init = async () => {
	await mongoose.connect("mongodb://localhost:27017/practice_rest_api");
	app.listen(process.env.PORT || 8000);
};

init();