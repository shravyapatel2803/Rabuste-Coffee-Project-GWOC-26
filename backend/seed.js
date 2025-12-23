// backend/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Art from "./models/Art.js";

dotenv.config();

const myArtData = [
  {
    title: "Coffee Art 1",
    artist: "Artist Name",
    description: "Description here.",
    // PASTE YOUR FULL URL INSIDE THE QUOTES BELOW
    image: "https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG", 
    available: true,
  },
  {
    title: "Coffee Art 2",
    artist: "Artist Name",
    description: "Description here.",
    // ANOTHER URL EXAMPLE
    image: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    available: false,
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB...");
    
    // Clear old data
    await Art.deleteMany({});
    
    // Add new data with your URLs
    await Art.insertMany(myArtData);
    console.log("URLs added successfully!");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedDB();