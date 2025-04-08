// Load environment variables from the .env file
import dotenv from "dotenv";

// Import custom DB connection function
import connectDB from "./db/index.js";

// Import the configured express app
import { app } from "./app.js";

// Import mongoose to connect to MongoDB
import mongoose from "mongoose";

// Import your database name constant
import { DB_NAME } from "./constants.js";

// Load .env variables
dotenv.config({
    path: './.env'
});

// Call the DB connection function
connectDB()
.then(() => {
    // If DB connection is successful, start the server
    (async () => {
        try {
            // Connect mongoose to MongoDB using URL from .env and DB name
            await mongoose.connect(`${process.env.MONGO_DB}/${DB_NAME}`);

            // Start listening for incoming requests on the defined port
            app.listen(process.env.PORT || 8000, () => {
                console.log(`Server is running on port ${process.env.PORT}`);
            });

        } catch (error) {
            console.log("Error while connecting with mongoose: ", error);
        }
    })();

})
.catch((err) => {
    // Handle DB connection error
    console.log(`Database connection failed!`, err);
});
