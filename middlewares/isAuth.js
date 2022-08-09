const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	const token = req.get("Authorization");
	console.log(token);
	if(!token) {
		throw new Error("Not authenticated!");
	}
	
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, "superlongsecretkey"); //will decode and verify
	} catch(error) {
		throw error;
	}
	
	if(!decodedToken) { //was not able to verify
		const error = new Error("The token is not a valid jwt token!");
		error.statusCode = 400;
		throw error;
	}
	
	req.userId = decodedToken.userId;
	next();
};