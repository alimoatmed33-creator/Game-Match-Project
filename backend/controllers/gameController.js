const Game = require("../models/Game");
const rawSeedGames = require("../seed/games");
const mongoose = require("mongoose");

// Initialize in-memory seed dataset with string _id properties
let memoryGames = rawSeedGames.map((game, index) => ({
  _id: String(index + 1),
  ...game,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc Get all games
// @route GET /api/games
const getAllGames = async (req, res) => {
  try {
    if (isDbConnected()) {
      const dbGames = await Game.find();
      if (dbGames && dbGames.length > 0) {
        return res.status(200).json({
          success: true,
          count: dbGames.length,
          data: dbGames,
        });
      }
    }
  } catch (error) {
    console.warn("MongoDB query failed, falling back to in-memory store:", error.message);
  }

  return res.status(200).json({
    success: true,
    count: memoryGames.length,
    data: memoryGames,
  });
};

// @desc Get game by ID
// @route GET /api/games/:id
const getGameById = async (req, res) => {
  const { id } = req.params;

  try {
    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const game = await Game.findById(id);
      if (game) {
        return res.status(200).json({
          success: true,
          data: game,
        });
      }
    }
  } catch (error) {
    console.warn("MongoDB getGameById failed, falling back to in-memory store:", error.message);
  }

  const memoryGame = memoryGames.find((g) => g._id === id || String(g._id) === String(id));
  if (!memoryGame) {
    return res.status(404).json({
      success: false,
      message: "Game not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: memoryGame,
  });
};

// @desc Create new game
// @route POST /api/games
const createGame = async (req, res) => {
  try {
    if (isDbConnected()) {
      const game = await Game.create(req.body);
      return res.status(201).json({
        success: true,
        message: "Game created successfully",
        data: game,
      });
    }
  } catch (error) {
    console.warn("MongoDB createGame failed, falling back to in-memory store:", error.message);
  }

  const newGame = {
    _id: String(Date.now()),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memoryGames.push(newGame);

  return res.status(201).json({
    success: true,
    message: "Game created successfully",
    data: newGame,
  });
};

// @desc Update game
// @route PUT /api/games/:id
const updateGame = async (req, res) => {
  const { id } = req.params;

  try {
    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const game = await Game.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (game) {
        return res.status(200).json({
          success: true,
          message: "Game updated successfully",
          data: game,
        });
      }
    }
  } catch (error) {
    console.warn("MongoDB updateGame failed, falling back to in-memory store:", error.message);
  }

  const index = memoryGames.findIndex((g) => g._id === id || String(g._id) === String(id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Game not found",
    });
  }

  memoryGames[index] = {
    ...memoryGames[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  return res.status(200).json({
    success: true,
    message: "Game updated successfully",
    data: memoryGames[index],
  });
};

// @desc Delete game
// @route DELETE /api/games/:id
const deleteGame = async (req, res) => {
  const { id } = req.params;

  try {
    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const game = await Game.findByIdAndDelete(id);
      if (game) {
        return res.status(200).json({
          success: true,
          message: "Game deleted successfully",
        });
      }
    }
  } catch (error) {
    console.warn("MongoDB deleteGame failed, falling back to in-memory store:", error.message);
  }

  const index = memoryGames.findIndex((g) => g._id === id || String(g._id) === String(id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Game not found",
    });
  }

  memoryGames.splice(index, 1);

  return res.status(200).json({
    success: true,
    message: "Game deleted successfully",
  });
};

// @desc Search games by name
// @route GET /api/games/search
const searchGames = async (req, res) => {
  const keyword = (req.query.q || "").toLowerCase();

  try {
    if (isDbConnected()) {
      const games = await Game.find({
        name: { $regex: keyword, $options: "i" },
      });

      if (games && games.length > 0) {
        return res.status(200).json({
          success: true,
          count: games.length,
          data: games,
        });
      }
    }
  } catch (error) {
    console.warn("MongoDB searchGames failed, falling back to in-memory store:", error.message);
  }

  const results = memoryGames.filter(
    (g) =>
      g.name.toLowerCase().includes(keyword) ||
      (g.genre && g.genre.toLowerCase().includes(keyword)) ||
      (g.publisher && g.publisher.toLowerCase().includes(keyword))
  );

  return res.status(200).json({
    success: true,
    count: results.length,
    data: results,
  });
};

// @desc Get featured games
// @route GET /api/games/featured
const getFeaturedGames = async (req, res) => {
  try {
    if (isDbConnected()) {
      const games = await Game.find({ featured: true });
      if (games && games.length > 0) {
        return res.status(200).json({
          success: true,
          count: games.length,
          data: games,
        });
      }
    }
  } catch (error) {
    console.warn("MongoDB getFeaturedGames failed, falling back to in-memory store:", error.message);
  }

  const results = memoryGames.filter((g) => g.featured);

  return res.status(200).json({
    success: true,
    count: results.length,
    data: results,
  });
};

// @desc Filter games by genre
// @route GET /api/games/filter
const filterGames = async (req, res) => {
  const genre = req.query.genre;

  try {
    if (isDbConnected()) {
      const games = await Game.find({ genre });
      if (games && games.length > 0) {
        return res.status(200).json({
          success: true,
          count: games.length,
          data: games,
        });
      }
    }
  } catch (error) {
    console.warn("MongoDB filterGames failed, falling back to in-memory store:", error.message);
  }

  const results = genre
    ? memoryGames.filter((g) => g.genre && g.genre.toLowerCase() === genre.toLowerCase())
    : memoryGames;

  return res.status(200).json({
    success: true,
    count: results.length,
    data: results,
  });
};

module.exports = {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  filterGames,
  getFeaturedGames,
  searchGames,
};
