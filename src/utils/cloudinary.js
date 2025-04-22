// Importing Cloudinary's version 2 SDK — it's a popular service to upload images, videos, or files to the cloud (i.e., internet storage).
import { v2 as cloudinary } from "cloudinary";

// This is Node's built-in File System module, which helps us interact with files on our local machine
import fs from "fs";

// Configuring the cloudinary SDK with our credentials stored in a secret `.env` file
// Think of it like logging into your Cloudinary account so that the SDK knows which account to upload to.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Your cloud name (like your Cloudinary username)
  api_key: process.env.CLOUDINARY_API_KEY,        // Public API key
  api_secret: process.env.CLOUDINARY_API_SECRET,  // Secret key (used to verify you're the account owner)
});

// This function is responsible for uploading a file to Cloudinary.
// It accepts one input: the local file path of the image or video that has been temporarily stored on your server.
const uploadOnCloudinary = async (localFilePath) => {
  try {
    // Check: If no file path is provided, exit and return null.
    if (!localFilePath) return null;

    // Uploading file to Cloudinary.
    // This is like going to a courier office and saying:
    // "Here’s my package (file). Upload it to the cloud for me."
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // This automatically detects whether it's an image, video, or something else
    });

    // If the file is uploaded successfully, log the secure Cloudinary URL in the console
    // This URL can now be stored in the database or returned to the frontend
    console.log("file is been uploaded on cloudinary", response.url);
    return response;

  } catch (error) {
    // If there’s any error during upload (e.g. internet issue or bad file), delete the local file
    // Think of it as throwing away a failed package that couldn't be delivered
    fs.unlinkSync(localFilePath); // Deletes the file from the `temp` folder
    return null;
  }
};

// Exporting this function so we can use it in other parts of our project (e.g. in route handlers)
export { uploadOnCloudinary };


// below is the code if the above don't understand below explained in more simpl way


// import multer from "multer"

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "./public/temp" )
//     },
//     filename: function (req, file, cb) {

//         // not needed becoz it is used to add our customize name to store the file name
//         //  Eg.logo-harsh.png like we use third party website to compress or resize the image and
//         //  after downloading we get our file name then website name then the image type 👇

//      /* const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) 
//       cb(null, file.fieldname + '-' + uniqueSuffix)*/ 


//       //it is not good to take originalname because the possibility is there will be 5 file of same name
//       //  with different extensions but here we are using because 
//       // it will be there for few moment after that we will upload it in cloudinary 👇
//       cb(null, file.originalname) 
//     }
//   })
  
//   export const upload = multer({ 
//     storage, 
// })