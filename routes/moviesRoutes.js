const router = require("express").Router();
const { body } = require("express-validator");
const moviesController = require("../controllers/moviesController");
const isAuth = require("../middlewares/isAuth");

router.get("/", moviesController.getMovies);

router.get("/:movieId", moviesController.getSingleMovie);

router.post(
	"/",
	isAuth,
	[
		body("title").isString().withMessage("The description should be valid string!").isLength({ min: 3 }).withMessage("The title field should be at least 3 characters long!"),
		body("description").isString().withMessage("The description should be valid string!").isLength({ min: 5 }).withMessage("The description field should be at least 3 characters long!"),
	],
	moviesController.createMovie
);

router.delete("/:movieId", isAuth, moviesController.deleteMovie);

router.put(
	"/:movieId", 
	isAuth,
	[
		body("title").isString().withMessage("The description should be valid string!").isLength({ min: 3 }).withMessage("The title field should be at least 3 characters long!"),
		body("description").isString().withMessage("The description should be valid string!").isLength({ min: 5 }).withMessage("The description field should be at least 3 characters long!"),
	],
	moviesController.editMovie
);

module.exports = router;