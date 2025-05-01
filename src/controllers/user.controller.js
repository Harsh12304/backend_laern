import { asyncHandler } from '../utils/asyncHandler.js'; // Utility to handle async errors in route handlers
import { apiError } from '../utils/apiError.js'; // Custom error handling class
import { User } from '../models/user.model.js'; // User model for database operations
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Utility to upload files to Cloudinary
import { apiResponse } from '../utils/apiResponse.js'; // Utility to format API responses

// Controller function to handle user registration
const registerUser = asyncHandler(async (req, res) => {
    // Extract user details from the request body
    const { email, fullname } = req.body;

    // Log the email for debugging purposes
    console.log(email);

    // Validate that all required fields are provided and not empty
    if ([email, fullname, username, password].some((field => field?.trim() === ""))) {
        throw new apiError(400, "All fields are required");
    }

    // Check if a user with the same email or username already exists in the database
    const existedUser = User.findOne({
        $or: [{ email }, { username }]
    });
    if (existedUser) {
        throw new apiError(409, "User with this email or username already exists");
    }

    // Extract file paths for avatar and cover image from the uploaded files
    const avatarLocalPath = req.files?.avatar[0]?.path; // Path to the uploaded avatar file
    const coverImageLocalPath = req.files?.coverImage[0]?.path; // Path to the uploaded cover image file

    // Ensure that the avatar file is provided
    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar is required");
    }

    // Upload the avatar file to Cloudinary and get the URL
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    // Upload the cover image file to Cloudinary (if provided) and get the URL
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // Ensure that the avatar upload was successful
    if (!avatar) {
        throw new apiError(400, "Avatar is required");
    }

    // Create a new user in the database with the provided details
    User.create({
        fullname, // Full name of the user
        avatar: avatar.url, // URL of the uploaded avatar
        coverImage: coverImage?.url || "", // URL of the uploaded cover image (or empty string if not provided)
        email, // User's email
        password, // User's password
        username: username.toLowerCase(), // Convert username to lowercase for consistency
    });

    // Retrieve the newly created user from the database, excluding sensitive fields
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new apiError(500, "Something went wrong while creating user");
    }

    // Return a success response with the created user data
    return res.status(201).json(
        new apiResponse(200, createdUser, "User created successfully")
    );
});

// Export the registerUser function for use in routes
export { registerUser };