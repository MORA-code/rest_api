const fs = require("fs");
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
		
		res.status(200).json({
			message: "Single movie fetched successfully!",
			movie: movie
		});
	})
	.catch(error => {
		error.message = null;
		throw error;
	})
};

exports.createMovie = (req, res, next) => {
	console.log(req.file);
	const { title, description } = req.body;
	const coverUrl = req.file?.path.replace("\\", "/"); 
	if(!coverUrl) {
		const error = new Error("No cover url provided!");
		error.statusCode = 401;
		throw error;
	}
	
	const movie = new Movie({
		title: title,
		description: description,
		coverUrl: coverUrl,
		creator: { name: "MORA" }
	});
	movie.save()
	.then(result => {
		res.status(201).json({ message: "Created successfully!", data: result });
	})
	.catch(error => {
		error.message = null;
		error.statusCode = 500;
		throw error;
	});
};

exports.deleteMovie = (req, res, next) => {
	const movieId = req.params.movieId;
	try {
		new mongoose.Types.ObjectId(movieId);
	} catch(error) {
		error.statusCode = 404;
		error.message = 'Invalid type of movie id!';
		throw error;
	}
	
	Movie.findById(movieId)
	.then(movie => {
		if(!movie) {
			const error = new Error("Movie with the given id not found!");
			error.statusCode = 404;
			return next(error);
		}
		Movie.findByIdAndRemove(movieId)
		.then(movie => {
			console.log(movie);
			res.status(200).json({ message: "Removed successfully!", data: movie._id });
		})
	})
	.catch(error => {
		error.message = null;
		error.statusCode = 500;
		throw error;
	});
};

function clearPreviousCover(url) {
	fs.unlink(url, (error) => console.log(error));
}

exports.editMovie = (req, res, next) => {
	const movieId = req.params.movieId;
	const { title: updatedTitle, description: updatedDescription } = req.body;
	const coverUrl = req.file?.path.replace("\\", "/");
	
	try {
		new mongoose.Types.ObjectId(movieId);
	} catch(error) {
		error.statusCode = 404;
		error.message = 'Invalid type of movie id!';
		throw error;
	}
	
	let movieDoc;
	Movie.findById(movieId)
	.then(movie => {
		movieDoc = movie;
		movie.title = updatedTitle ?? movie.title;
		movie.description = updatedDescription ?? movie.description;
		
		if(coverUrl) {
			clearPreviousCover(movie.coverUrl);
			movie.coverUrl = coverUrl;
		}
		
		return movie.save();
	})
	.then(result => {
		res.status(200).json({
			message: "Movie got updated successfully!",
			updatedMovieId: movieDoc._id
		});
	}).catch(error => {
		throw error;
	})
}; 