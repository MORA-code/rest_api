const router = require("express").Router();
const { body } = require("express-validator");
const moviesController = require("../controllers/moviesController");

router.get("/", moviesController.getMovies);

router.get("/:movieId", moviesController.getSingleMovie);

router.post(
	"/", 
	[
		body("title").isString().withMessage("The description should be valid string!").isLength({ min: 3 }).withMessage("The title field should be at least 3 characters long!"),
		body("description").isString().withMessage("The description should be valid string!").isLength({ min: 5 }).withMessage("The description field should be at least 3 characters long!"),
	],
	moviesController.createMovie
);

router.delete("/:movieId", moviesController.deleteMovie);

router.put(
	"/:movieId", 
	[
		body("title").isString().withMessage("The description should be valid string!").isLength({ min: 3 }).withMessage("The title field should be at least 3 characters long!"),
		body("description").isString().withMessage("The description should be valid string!").isLength({ min: 5 }).withMessage("The description field should be at least 3 characters long!"),
	],
	moviesController.editMovie
);

module.exports = router;