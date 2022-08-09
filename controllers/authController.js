const { validationResult } = require("express-validator");
const hasher = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.register = (req, res, next) => {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		const error = new Error();
		error.message = errors.array();
		error.statusCode = 400;
		return next(error);
	}
	
	const { username, password, email } = req.body;
	User.findOne({ email: email })
	.then(user => {
		if(user) {
			const error = new Error("User with the given email already exists!");
			error.statusCode = 409;
			return next(error);
		}
		
		hasher.hash(password, 12)
		.then(hashedPassword => {
			const user = new User({ username, email, password: hashedPassword });
			return user.save();
		})
		.then(result => {
			res.status(201)
				.json({ message: "User registered successfully!", userId: result._id });
		})
	})
	.catch(error => {
		next(error);
	});
};

exports.login = (req, res, next) => {
	const { email, password } = req.body;
	User.findOne({ email: email })
	.then(user => {
		if(!user) {
			const error = new Error("The user with the given email was not found!");
			error.statusCode = 404;
			return next(error);
		}
		
		hasher.compare(password, user.password)
		.then(doMatch => {
			if(doMatch) {
				
				const token = jwt.sign({
					email: user.email,
					userId: user._id
				}, "superlongsecretkey", { expiresIn: "1h" });
				
				res.status(200).json({ message: "Logged in!", data: { token, userId: user._id } })
				
			} else {
				const error = new Error("The password is not correct!");
				error.statusCode = 404;
				return next(error); 
			}
		})
	})
	.catch(error => next(error));
};