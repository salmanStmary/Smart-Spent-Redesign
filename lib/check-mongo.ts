import { MongoClient } from "mongodb"

export async function checkMongoConnection() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/smartspend"

  try {
    const client = new MongoClient(uri)
    await client.connect()
    await client.db("admin").command({ ping: 1 })
    await client.close()
    console.log("MongoDB connection successful!")
    return true
  } catch (error) {
    console.error("MongoDB connection failed:", error)
    return false
  }
}
