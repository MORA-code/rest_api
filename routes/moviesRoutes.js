const router = require("express").Router();
const moviesController = require("../controllers/moviesController");

router.get("/", moviesController.getMovies);

router.get("/:movieId", moviesController.getSingleMovie);

router.post("/", moviesController.createMovie);

router.delete("/:movieId", moviesController.deleteMovie);

router.put("/:movieId", moviesController.editMovie);

module.exports = router;