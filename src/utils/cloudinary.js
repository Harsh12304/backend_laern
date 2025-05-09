// Importing Cloudinary's version 2 SDK for file uploads
import { v2 as cloudinary } from "cloudinary";

// Node's built-in File System module for file operations
import fs from "fs";

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file to Cloudinary and removes the local temporary file afterward
 * 
 * @param {string} localFilePath - Path to the temporary file on server
 * @returns {object|null} - Cloudinary response object or null if upload fails
 * 
 * PREVIOUS BUG: The function wasn't deleting local files after successful uploads,
 * only attempting deletion in the error handler. This caused temporary files to 
 * accumulate in the public/temp directory.
 */
const uploadOnCloudinary = async (localFilePath) => {
  try {
    // Exit early if no file path is provided
    if (!localFilePath) {
      console.log("No file path provided for upload");
      return null;
    }

    // DEBUGGING: Log the file path to ensure it's correct
    console.log("Attempting to upload file:", localFilePath);

    // Check if the file actually exists before trying to upload
    // BUG FIX: Added this check to prevent errors when file doesn't exist
    if (!fs.existsSync(localFilePath)) {
      console.warn("⚠️ File doesn't exist, cannot upload:", localFilePath);
      return null;
    }

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Auto-detect whether it's an image, video, etc.
    });

    console.log("✅ File successfully uploaded to Cloudinary:", response.url);
    
    // CRITICAL BUG FIX: Delete the local file after successful upload
    // This was missing in the original code, causing files to remain in temp directory
    try {
      // Double-check file exists before deletion (defensive programming)
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        console.log("🗑️ Local file deleted after successful upload:", localFilePath);
      } else {
        console.warn("⚠️ Strange: File existed for upload but not for deletion:", localFilePath);
      }
    } catch (deleteError) {
      // Handle deletion errors separately to not affect the main upload flow
      console.error("❌ Error deleting local file after successful upload:", deleteError);
      // We don't return null here as the upload was still successful
    }
    
    return response;

  } catch (uploadError) {
    console.error("❌ Cloudinary upload failed:", uploadError);
    
    // Clean up the local file if upload fails
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        console.log("🗑️ Local file deleted after upload failure:", localFilePath);
      } else {
        console.warn("⚠️ File already missing, cannot delete:", localFilePath);
      }
    } catch (deleteError) {
      console.error("❌ Error deleting local file after failed upload:", deleteError);
    }
    
    return null;
  }
};

export { uploadOnCloudinary };

/**
 * COMPREHENSIVE EXPLANATION OF THE BUGS AND FIXES:
 * 
 * 1. MAIN BUG: The original code only attempted to delete files in the error handler,
 *    not after successful uploads. This caused files to accumulate in the temp directory.
 * 
 * 2. POTENTIAL ISSUES WITH AVATAR VS COVER IMAGE:
 *    - If only cover images were being deleted but not avatars, this could be because:
 *      a) There might be path discrepancies between how avatar and cover image paths are constructed
 *      b) The avatar upload might be happening in a different flow or callback
 *      c) File permission issues for specific file types
 * 
 * 3. ERROR HANDLING IMPROVEMENTS:
 *    - Added separate try/catch blocks for deletion to prevent deletion errors from affecting upload results
 *    - Added more logging to trace exactly what's happening with each file
 *    - Added existence checks before all file operations to prevent errors
 * 
 * 4. CODE ROBUSTNESS:
 *    - Better logging to make debugging easier
 *    - More defensive programming with existence checks
 *    - Separation of concerns between upload and cleanup operations
 */