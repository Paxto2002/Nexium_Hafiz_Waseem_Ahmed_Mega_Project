import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to your .env.local file");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Helper function to connect to database
export async function connectToDB() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "chefDB");
    return { client, db };
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// Helper function to insert recipe
export async function insertRecipe(recipeData) {
  try {
    const { db } = await connectToDB();
    const result = await db.collection("recipes").insertOne({
      ...recipeData,
      created_at: new Date(),
    });
    return result;
  } catch (error) {
    console.error("Error inserting recipe:", error);
    throw error;
  }
}

// Helper function to get user recipes
export async function getUserRecipes(userId) {
  try {
    const { db } = await connectToDB();
    const recipes = await db
      .collection("recipes")
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .toArray();
    return recipes;
  } catch (error) {
    console.error("Error getting user recipes:", error);
    throw error;
  }
}
