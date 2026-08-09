require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("../config/db");

const Game = require("../models/Game");

const games = require("./games");

const seedDatabase = async () => {
  try {

    await connectDB();

    await Game.deleteMany();

    await Game.insertMany(games);

    console.log("Database Seeded Successfully");

    process.exit();

  } catch (error) {

    console.log(error);

    process.exit(1);

  }
};

seedDatabase();