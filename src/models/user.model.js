// Importing required modules
import mongoose, { Schema } from "mongoose"; // mongoose to work with MongoDB, Schema to define structure
import bcrypt from "bcrypt"; // bcrypt is used to hash passwords (lock them safely)
import jwt from "jsonwebtoken"; // jwt is used to create secure login tokens

// Creating a new schema (blueprint) for the User collection
const userSchema = new Schema(
  {
    // Username field
    username: {
      type: String, // It's a text field
      required: true, // Mandatory - can't register without username
      unique: true, // No two users can have same username
      lowercase: true, // Always saved in lowercase (to avoid A vs a issues)
      trim: true, // Removes extra spaces from start and end
      index: true, // Helps in fast search (like adding an index in a book)
    },

    // Email field - works similar to username
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Full name of the user
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // User's profile picture (stored as URL from Cloudinary or other service)
    avatar: {
      type: String,
      required: true,
    },

    // Optional cover image for the profile (also stored as URL)
    coverImage: {
      type: String,
    },

    // Array of videos watched by the user
    // Each item is an ID that points to a Video in the Video collection
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video", // This means it refers to the "Video" collection
      },
    ],

    // Password of the user (will be hashed later)
    password: {
      type: String,
      required: [true, "the password is required"],
    },

    // Refresh token to allow user to stay logged in without retyping credentials
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  }
);

// 🔒 This runs **before saving** any new user
userSchema.pre("save", async function (next) {
  // If password hasn't changed (example: during profile update), skip hashing
  if (!this.isModified("password")) return next();

  // If it’s a new password, hash it with bcrypt (like putting it in a safe)
  // The number '10' means how strong the lock is (higher = more secure but slower)
  this.password = await bcrypt.hash(this.password, 10);

  // Continue with saving the user
  next();
});

// ✅ Method to check if the entered password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
  // Compares the entered password with the hashed one stored in DB
  return await bcrypt.compare(password, this.password);
  // Analogy: A person gives a key (entered password), and we try to open the safe
};

// 🎫 Method to generate Access Token (used for login sessions)
userSchema.methods.generateAccessToken = function () {
  // Create a signed JWT token with selected user data
  return jwt.sign(
    {
      _id: this._id, // Unique user ID
      email: this.email, // Email (not sensitive, safe to include)
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET, // Secret key from .env file (used like a stamp)
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // Example: "10d" → valid for 10 days
    }
  );
  // Real-life: Like giving the user a concert ticket that expires in 10 days
};

// 🔁 Method to generate Refresh Token (used to get a new access token when old one expires)
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id, // We only need ID to verify later
    },
    process.env.REFRESH_TOKEN_SECRET, // Different secret used only for refresh token
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY, // Example: 13 days
    }
  );
  // Real-life: Like giving a backstage pass that can be exchanged for a new ticket
};

// ⛳ Finally, export the User model so it can be used in other files
export const User = mongoose.model("User", userSchema);
