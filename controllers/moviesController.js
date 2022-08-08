const mongoose = require("mongoose");
const Movie = require("../models/movie");

exports.getMovies = (req, res, next) => {
	Movie.find()
	.then(movies => {
		res.status(200).json({ message: "Fetched successfully!", data: movies });
	}).catch(error => {
		throw error;
	});
};

exports.getSingleMovie = (req, res, next) => {
	const { movieId } = req.params;
	try {
		new mongoose.Types.ObjectId(movieId);
	} catch(error) {
		error.statusCode = 404;
		error.message = 'Invalid type of movie id!';
		throw error;
	}
	
	Movie.findOne({ _id: movieId })
	.then(movie => {
		if(!movie) {
			const error = new Error("No movie find with the given id!");
			error.statusCode = 404;
			throw error;
		}
	})
	.catch(error => {
		error.message = null;
		throw error;
	})
};