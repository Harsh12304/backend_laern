// Importing multer, which is a Node.js middleware for handling `multipart/form-data`
// This is mainly used for uploading files (like images, PDFs, etc.)
import multer from "multer";

// Setting up where and how files will be temporarily stored before they are uploaded to Cloudinary
const storage = multer.diskStorage({
  
  // This function sets the destination folder to store uploaded files locally
  // In this case, it's "./public/temp"
  // Think of it like a parcel counter where the file is temporarily kept
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // Temporary storage location
  },

  // This function determines the file name used to store the file temporarily
  filename: function (req, file, cb) {

    /**
     * You might be wondering why we're using `file.originalname` even though
     * multiple files with the same name could be uploaded at the same time.
     *
     * That's a valid concern — normally we'd want to give the file a unique name like:
     * "profilepic-23141234.png" to avoid overwriting files.
     *
     * But in this case, it’s fine because:
     * - This file will live only for a few moments in the `/public/temp` folder
     * - Right after this, the file is uploaded to Cloudinary and removed from here
     * 
     * So we just use the original name to keep things simple.
     */
    cb(null, file.originalname);
  }
});

// Creating the multer instance using the custom `storage` configuration
// You’ll use this in your route to handle file uploads
export const upload = multer({ storage });
