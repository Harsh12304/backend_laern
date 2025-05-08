// Load environment variables from the .env file
import dotenv from "dotenv";

// Import custom DB connection function
import connectDB from "./db/index.js";

// Import the configured express app
import { app } from "./app.js";

// Load .env variables
dotenv.config({
    path: './.env'
});

// Call the DB connection function and start the server
connectDB()
  .then(() => {
    // Start listening for incoming requests on the defined port
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed!", err);
  });
