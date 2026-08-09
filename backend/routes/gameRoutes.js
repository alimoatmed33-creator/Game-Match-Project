const express = require("express");

const router = express.Router();

const { getAllGames,getGameById,createGame,updateGame,deleteGame,searchGames,getFeaturedGames,filterGames } = require("../controllers/gameController");

router.get("/", getAllGames);

router.get("/search", searchGames);

router.get("/featured", getFeaturedGames);

router.get("/filter", filterGames);

router.get("/:id", getGameById);

router.post("/", createGame);

router.put("/:id", updateGame);

router.delete("/:id", deleteGame);
module.exports = router;



