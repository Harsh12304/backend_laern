// Import the Router class from Express to define route handlers
import { Router } from "express";

// Import the registerUser controller function to handle user registration logic
import { registerUser } from "../controllers/user.controller.js";

// Import the multer middleware for handling file uploads
import { upload } from "../middleware/multer.middleware.js";

// Create a new instance of the Express Router
const router = Router();

// Define a POST route for user registration
router.route("/register").post(
    // Use multer middleware to handle file uploads for avatar and coverImage
    upload.fields([
        {
            name: "avatar", // Field name for the avatar file in the request
            maxCount: 1,    // Maximum number of files allowed for this field
        },
        {
            name: "coverImage", // Field name for the cover image file in the request
            maxCount: 1,       // Maximum number of files allowed for this field
        }
    ]),
    // Pass the registerUser controller to handle the request after file upload
    registerUser
);

// Export the router to make it available for use in other parts of the application
export default router;