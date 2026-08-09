const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.warn("[AI Studio] No MONGO_URI provided — using in-memory games dataset");
    return;
  }

  try {
    mongoose.set('bufferCommands', false);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log("MongoDB Connected");
  } catch (error) {
    console.warn("Database Connection Failed — using in-memory games dataset");
    console.warn(error.message);
  }
};

module.exports = connectDB;
