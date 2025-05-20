import User from "../models/user.model.js";
import Usernext from "../models/usernext.model.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import { sendVerificationEmail } from "../utils/emailService.js"; // Import the email service

dotenv.config(); // Load environment variables
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Brevo (Sendinblue)

  // Register a new user
  export const register = async (req, res, next) => {
    try {
        const { firstname, lastname, email, password, UserType } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        // Hash the password
        const hash = bcrypt.hashSync(password, 10);

        // Create a new user in the database
        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hash,
            UserType,
            isVerified: false, // Set to false initially
        });


        const savedUser = await newUser.save();

        // Generate a token with the userId
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // Token expires in 7 days
    });

    // Set the token as an HTTP-only cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

       // Generate a verification link
    const verificationToken = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });
    // Generate a verification link
    const verificationLink = `http://localhost:3000/auth/verify-email?token=${verificationToken}`;

    // Send the verification email
    await sendVerificationEmail(email, verificationLink);
 next();

    res.status(201).json({ message: "User registered successfully! Please verify your email." });
  } catch (err) {
    console.error("Error in register function:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};



// Register next controller
export const registernext = async (req, res) => {
  try {
    const { username, NIN, gender, birthDate } = req.body;

// Retrieve userId from the token (or session)
    const token = req.cookies.accessToken; // Assuming the token is stored in cookies
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. Please log in again." });
    }
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     const userId = decoded.id;


    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

   // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Handle profile picture upload (if provided)
    let profilePictureUrl = "/default-profile.png"; // Default profile picture
    if (req.file) {
      const uploadResult = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "profile_pictures",
      });
      profilePictureUrl = uploadResult.secure_url;
    }

    const usernext = new Usernext({
      username,
      NIN,
      gender,
      birthDate,
      profilePicture: profilePictureUrl,
      userId: mongoose.Types.ObjectId(userId),
    });

    await usernext.save();

    res.status(201).send("Additional registration data saved successfully!");
  } catch (err) {
    console.error("Error in registernext:", err);
    res.status(500).send("Something went wrong!");
  }
};


// Login a user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate user credentials (example only)
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "User not found!" });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    // Generate a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // Token expires in 7 days
    });

    console.log("Generated Token:", token);

    // Set the token as an HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent access via JavaScript
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Prevent CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


//logout a user
export const logout = async(_req, res) => {
    res.clearCookie("token", {
        sameSite:"strict",
        secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
    }).status(200).send("User Logged out!");
}

//authenticate a user
export const me = async (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies); // Debugging: Log cookies

    const token = req.cookies.token; // Read the token from cookies
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid token" });

      // Return user info
      res.status(200).json({ id: user.id, email: user.email, isVerified: true });
    });
  } catch (err) {
    next(err);
  }
};

//verify a token
export const verify = (req, res) => {
  console.log("Cookies:", req.cookies); // Log all cookies

  const token = req.cookies.token; // Get the token from the cookie
  if (!token) {
    console.error("No token found in cookies");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    console.log("Token verified:", decoded);
    res.status(200).json({ message: "Authenticated", user: decoded, token });
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};
 
// Verify Email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query; // Extract the token from the query parameter

    if (!token) {
      return res.status(400).json({ message: "Verification token is required." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified." });
    }

    // Mark the user as verified
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully. You can now log in." });
  } catch (err) {
    console.error("Error verifying email:", err);
    res.status(400).json({ message: "Invalid or expired token." });
  }
};