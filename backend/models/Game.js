const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

   genre: {
  type: String,
  enum: ["Action","Adventure","RPG","Shooter","Sports","Racing","Horror","Puzzle","Strategy","Simulation","MOBA"],
  required: true,
},

    platform: {
  type: [String],
  enum: ["PC", "PlayStation", "Xbox", "Nintendo", "Mobile"],
  required: true,
},

    mode: {
      type: String,
      enum: ["Single Player", "Multiplayer", "Both"],
      required: true,
    },

    priceType: {
      type: String,
      enum: ["Free", "Paid"],
      required: true,
    },

    publisher: {
      type: String,
      required: true,
    },

    releaseYear: {
      type: Number,
      required: true,
    },

    rating: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    trailer: {
      type: String,
    },

    minimumRequirements: {
      type: String,
    },

    recommendedRequirements: {
      type: String,
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Game", gameSchema);