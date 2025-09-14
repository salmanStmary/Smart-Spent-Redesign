/**
 * MongoDB Setup Script
 *
 * This script helps set up MongoDB for local development.
 * Run with: node scripts/setup-mongo.js
 */

const { MongoClient } = require("mongodb")

async function setupMongo() {
  console.log("Checking MongoDB connection...")

  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/smartspend"
  const dbName = process.env.MONGODB_DB || "smartspend"

  try {
    const client = new MongoClient(uri)
    await client.connect()

    console.log("Connected to MongoDB successfully!")

    // Create database if it doesn't exist
    const db = client.db(dbName)

    // Create collections
    console.log("Setting up collections...")
    await db.createCollection("users")
    await db.createCollection("expenses")
    await db.createCollection("budgets")
    await db.createCollection("savingsGoals")

    // Create indexes
    console.log("Creating indexes...")
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("expenses").createIndex({ userId: 1 })
    await db.collection("expenses").createIndex({ date: -1 })
    await db.collection("budgets").createIndex({ userId: 1 })
    await db.collection("budgets").createIndex({ category: 1, userId: 1 }, { unique: true })
    await db.collection("savingsGoals").createIndex({ userId: 1 })

    console.log("MongoDB setup complete!")
    await client.close()
  } catch (error) {
    console.error("MongoDB setup failed:", error)
    console.log("\nTroubleshooting tips:")
    console.log("1. Make sure MongoDB is installed and running on your machine")
    console.log("2. Check if MongoDB is running on the default port (27017)")
    console.log("3. If using a custom connection string, set the MONGODB_URI environment variable")
  }
}

setupMongo().catch(console.error)
