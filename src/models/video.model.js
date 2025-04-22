// Importing required tools from mongoose
import mongoose, { Schema } from "mongoose"; // mongoose is the library, Schema lets us define data structure

// Importing a plugin to help with pagination (i.e., break down long lists into pages)
import mongooseAggregatePaginate from "mongoose-paginate-v2";

// Creating a new schema (blueprint) for a video document
const videoSchema = new Schema({

    // Video file URL (usually a Cloudinary or CDN URL)
    video: {
        type: String,
        required: true // Must be provided when saving a video
        // Real-life: Just like you can’t list a YouTube video without uploading the video file
    },

    // Thumbnail image URL - small preview image shown before playing video
    thumnail: {
        type: String,
        required: true
        // Example: Like the image you see before you hit play on YouTube
    },

    // Description of the video
    descripton: {
        type: String,
        required: true
        // Real-life: Like the video summary you write when uploading on YouTube
    },

    // Title of the video
    title: {
        type: String,
        required: true
        // Example: The name of the video that appears as a heading
    },

    // Number of times this video has been viewed
    views: {
        type: Number,
        default: 0
        // When video is first uploaded, no views → start from 0
    },

    // Length of the video in seconds or minutes (depends on how you store it)
    duration: {
        type: Number,
        required: true
        // Real-life: YouTube shows “12:45” as video length — this field stores that info
    },

    // Flag to check if the video is published or still in draft
    isPublished: {
        type: Boolean,
        default: true
        // If false, video might be private or scheduled but not public
    },

    // Owner of the video: this connects the video back to the user who uploaded it
    owner: {
        type: Schema.Types.ObjectId, // This is a reference to another document
        ref: "User" // It means the ID stored here points to a user in the User collection
        // Analogy: Like “uploaded by @username” written under a video
    }

}, {
    timestamps: true // Automatically creates `createdAt` and `updatedAt` fields for tracking
    // Example: Like when you upload a video, the upload date is recorded
});


// ⬇️ Apply the pagination plugin to the schema
// This plugin gives extra functionality like .paginate() to split data into pages
mongoose.plugin(mongooseAggregatePaginate);

// ⛳ Export the model named "video" (this will create/use the 'videos' collection in MongoDB)
export const Video = mongoose.model("video", videoSchema);
