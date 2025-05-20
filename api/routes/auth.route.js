import express from 'express';
import multer from "multer";
import { register, registernext, login, logout, me, verify, verifyEmail } from '../controllers/auth.controller.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });
// Authentication Routes
router.post('/register', register); // Protect registration route
router.post('/registernext', upload.single("profilePicture"), registernext); // Protect additional registration details route
router.post('/login',login); // Login route
router.post('/logout', logout); // Logout route (GET is more appropriate)
router.get('/me', me); // Protected route to get user details
router.get("/verify", verify);
router.get("/verify-email", verifyEmail);// Email verification route

export default router;