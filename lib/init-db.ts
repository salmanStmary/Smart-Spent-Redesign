import { connectToDatabase } from "./db"
import { checkMongoConnection } from "./check-mongo"
import bcrypt from "bcryptjs"

export async function initializeDatabase() {
  try {
    console.log("Checking MongoDB connection...")
    const isConnected = await checkMongoConnection()

    if (!isConnected) {
      console.error("Failed to connect to MongoDB. Please ensure MongoDB is running.")
      return
    }

    console.log("Initializing database...")
    const { db } = await connectToDatabase()

    // Create collections if they don't exist
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    if (!collectionNames.includes("users")) {
      await db.createCollection("users")
      console.log("Created users collection")
    }

    if (!collectionNames.includes("expenses")) {
      await db.createCollection("expenses")
      console.log("Created expenses collection")
    }

    if (!collectionNames.includes("budgets")) {
      await db.createCollection("budgets")
      console.log("Created budgets collection")
    }

    if (!collectionNames.includes("savingsGoals")) {
      await db.createCollection("savingsGoals")
      console.log("Created savingsGoals collection")
    }

    // Create indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("expenses").createIndex({ userId: 1 })
    await db.collection("expenses").createIndex({ date: -1 })
    await db.collection("budgets").createIndex({ userId: 1 })
    await db.collection("budgets").createIndex({ category: 1, userId: 1 }, { unique: true })
    await db.collection("savingsGoals").createIndex({ userId: 1 })

    // Check if we need to create a demo user
    const userCount = await db.collection("users").countDocuments()

    if (userCount === 0) {
      console.log("Creating demo user...")

      // Create demo user
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash("password123", salt)

      const demoUser = {
        name: "Demo User",
        email: "demo@example.com",
        password: hashedPassword,
        preferences: {
          currency: "usd",
          notifications: {
            email: true,
            push: false,
            weeklyReport: true,
            budgetAlerts: true,
            savingsGoalAlerts: false,
          },
        },
        createdAt: new Date(),
      }

      const result = await db.collection("users").insertOne(demoUser)
      const userId = result.insertedId.toString()

      console.log("Demo user created with ID:", userId)

      // Create sample data for demo user
      await createSampleData(db, userId)
    }

    console.log("Database initialization complete")
  } catch (error) {
    console.error("Database initialization failed:", error)
  }
}

async function createSampleData(db, userId) {
  // Sample expenses
  const expenses = [
    {
      description: "Rent",
      amount: -1200,
      category: "housing",
      date: new Date(2023, 3, 1),
      userId,
    },
    {
      description: "Salary",
      amount: 3500,
      category: "income",
      date: new Date(2023, 3, 5),
      userId,
    },
    {
      description: "Grocery Shopping",
      amount: -120.5,
      category: "food",
      date: new Date(2023, 3, 10),
      userId,
    },
    {
      description: "Electric Bill",
      amount: -85.2,
      category: "utilities",
      date: new Date(2023, 3, 15),
      userId,
    },
    {
      description: "Internet",
      amount: -65.99,
      category: "utilities",
      date: new Date(2023, 3, 15),
      userId,
    },
    {
      description: "Restaurant",
      amount: -64.3,
      category: "food",
      date: new Date(2023, 3, 18),
      userId,
    },
    {
      description: "Gas",
      amount: -45,
      category: "transport",
      date: new Date(2023, 3, 20),
      userId,
    },
    {
      description: "Movie Tickets",
      amount: -32,
      category: "entertainment",
      date: new Date(2023, 3, 22),
      userId,
    },
    {
      description: "Doctor Visit",
      amount: -75,
      category: "healthcare",
      date: new Date(2023, 3, 25),
      userId,
    },
    {
      description: "Online Course",
      amount: -99,
      category: "education",
      date: new Date(2023, 3, 28),
      userId,
    },
  ]

  await db.collection("expenses").insertMany(expenses)
  console.log("Sample expenses created")

  // Sample budgets
  const budgets = [
    {
      category: "housing",
      amount: 1300,
      period: "monthly",
      userId,
    },
    {
      category: "food",
      amount: 500,
      period: "monthly",
      userId,
    },
    {
      category: "transport",
      amount: 250,
      period: "monthly",
      userId,
    },
    {
      category: "utilities",
      amount: 200,
      period: "monthly",
      userId,
    },
    {
      category: "entertainment",
      amount: 200,
      period: "monthly",
      userId,
    },
  ]

  await db.collection("budgets").insertMany(budgets)
  console.log("Sample budgets created")

  // Sample savings goals
  const savingsGoals = [
    {
      name: "Emergency Fund",
      current: 5000,
      target: 10000,
      color: "bg-emerald-500",
      userId,
    },
    {
      name: "Vacation",
      current: 1200,
      target: 3000,
      color: "bg-blue-500",
      userId,
    },
    {
      name: "New Car",
      current: 3500,
      target: 15000,
      color: "bg-purple-500",
      userId,
    },
  ]

  await db.collection("savingsGoals").insertMany(savingsGoals)
  console.log("Sample savings goals created")
}
