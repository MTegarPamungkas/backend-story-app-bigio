const mongoose = require("mongoose");
const Category = require("./frameworks/database/models/Category"); // Path to your Category model
const connectDB = require("./config/database");
require("dotenv").config();

connectDB();

const categories = [
  { name: "Fiction", description: "Fictional stories." },
  { name: "Adventure", description: "Adventure stories." },
  { name: "Science Fiction", description: "Sci-fi stories set in the future." },
  { name: "Fantasy", description: "Fantasy stories with magical elements." },
];

async function seedCategories() {
  try {
    await Category.deleteMany({}); // Clear existing categories
    await Category.insertMany(categories);
    console.log("Categories have been seeded.");
  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedCategories();
