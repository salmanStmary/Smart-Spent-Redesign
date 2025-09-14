# SmartSpend Finance App

A comprehensive personal finance management application built with Next.js, MongoDB, and Tailwind CSS.

## Features

- User authentication and account management
- Expense tracking and categorization
- Budget creation and monitoring
- Financial analytics and reporting
- Savings goals tracking
- Educational resources

## Getting Started

### Prerequisites

- Node.js 16.x or later
- MongoDB (local installation or MongoDB Atlas)

### Setting Up MongoDB

#### Option 1: Local MongoDB

1. Install MongoDB Community Edition on your machine:
   - [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

2. Start the MongoDB service:
   - Windows: `mongod`
   - macOS/Linux: `sudo systemctl start mongod`

3. Run the setup script:
   \`\`\`bash
   npm run setup-mongo
   \`\`\`

#### Option 2: MongoDB Atlas

1. Create a free MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster and get your connection string
3. Set the connection string as an environment variable:
   \`\`\`
   MONGODB_URI=your_mongodb_atlas_connection_string
   MONGODB_DB=smartspend
   \`\`\`

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/smartspend.git
   cd smartspend
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create a `.env.local` file with the following variables:
   \`\`\`
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   MONGODB_URI=mongodb://localhost:27017/smartspend
   MONGODB_DB=smartspend
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Account

You can log in with the following demo account:
- Email: demo@example.com
- Password: password123

## Deployment

The application can be easily deployed to Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Set the environment variables in the Vercel dashboard
4. Deploy!

## License

This project is licensed under the MIT License - see the LICENSE file for details.
