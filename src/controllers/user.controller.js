import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from '../utils/apiResponse.js';

/**
 * Controller function to handle user registration
 * Processes user details and files (avatar and cover image)
 * 
 * IDENTIFIED BUGS:
 * 1. There was an issue with coverImage path extraction
 * 2. Inconsistent error handling for avatar vs. cover image
 * 3. No verification if files were properly uploaded to temporary location
 */
const registerUser = asyncHandler(async (req, res) => {
    // Extract user details from request body
    const { email, fullname, username, password } = req.body;

    // Log data for debugging purposes
    console.log("Registration attempt for:", email);

    // Validate that all required fields are provided and not empty
    if ([email, fullname, username, password].some((field) => field?.trim() === "")) {
        throw new apiError(400, "All fields are required");
    }

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    });
    
    if (existedUser) {
        throw new apiError(409, "User with this email or username already exists");
    }

    // DEBUGGING: Log the uploaded files object to understand its structure
    console.log("Uploaded files:", req.files);

    // CRITICAL BUG FIX: Extract file paths correctly
    // Make sure we check if the arrays exist and have elements before accessing
    let avatarLocalPath;
    if (req.files && 
        req.files.avatar && 
        Array.isArray(req.files.avatar) && 
        req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path;
        console.log("Avatar local path:", avatarLocalPath);
    } else {
        console.log("No avatar file found in request");
    }

    let coverImageLocalPath;
    if (req.files && 
        req.files.coverImage && 
        Array.isArray(req.files.coverImage) && 
        req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
        console.log("Cover image local path:", coverImageLocalPath);
    } else {
        console.log("No cover image file found in request");
    }

    // Validate avatar is provided (required field)
    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is required");
    }

    // DEBUGGING: Log paths before Cloudinary upload
    console.log("Paths before upload - Avatar:", avatarLocalPath, "Cover:", coverImageLocalPath);

    // Upload files to Cloudinary
    // BUG FIX: Both uploads should be awaited for proper error handling
    const avatarUpload = await uploadOnCloudinary(avatarLocalPath);
    const coverImageUpload = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    // DEBUGGING: Log Cloudinary responses
    console.log("Cloudinary response - Avatar:", avatarUpload?.url || "Failed", 
              "Cover:", coverImageUpload?.url || "N/A");

    // Ensure avatar upload was successful
    if (!avatarUpload) {
        throw new apiError(500, "Avatar upload failed, please try again");
    }

    // Create user in database
    const user = await User.create({
        fullname,
        avatar: avatarUpload.url,
        coverImage: coverImageUpload?.url || "", // Use cover image URL if available
        email,
        password,
        username: username.toLowerCase(),
    });

    // Retrieve user without sensitive fields
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    
    if (!createdUser) {
        throw new apiError(500, "Something went wrong while creating user");
    }

    // Return success response
    return res.status(201).json(
        new apiResponse(201, createdUser, "User created successfully")
    );
});

export { registerUser };

/**
 * COMPREHENSIVE EXPLANATION OF THE BUGS AND FIXES:
 * 
 * 1. COVER IMAGE PATH EXTRACTION:
 *    - Original code had a typo in property name for coverImageLocalPath
 *    - It was incorrectly checking req.files.coverImageLocalPath instead of req.files.coverImage
 * 
 * 2. FILE EXISTENCE CHECKS:
 *    - Added proper validation of req.files structure before accessing properties
 *    - Ensured all array checks are in place to prevent "cannot read property of undefined" errors
 * 
 * 3. IMPROVED ERROR HANDLING:
 *    - Added validation after Cloudinary upload to ensure avatar was uploaded successfully
 *    - Added more logging to track the flow of file handling
 * 
 * 4. CONSISTENT HTTP STATUS CODES:
 *    - Using 201 for successful creation consistently in both the status and apiResponse
 * 
 * These fixes ensure that:
 * - Both avatar and cover image files are properly extracted from the request
 * - Both files are uploaded to Cloudinary with proper error handling
 * - The temporary files should be deleted by the updated uploadOnCloudinary function
 */