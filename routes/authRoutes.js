const router = require("express").Router();
const { body } = require("express-validator");
const authController = require("../controllers/authController");

router.post(
	"/register", 
	[
		body("username", "The username field should be at least 3 characters and a valid string!").isString().isLength({ min: 3 }),
		body("email", "The email field should be a valid email!").isEmail(),
		body("password", "The password field should be at least 5 characters and a valid string!").isString().isLength({ min: 5 }),
	],
	authController.register
);

router.post(
	"/login",
	authController.login
);

module.exports = router;