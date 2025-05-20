import express from "express";
import {
    register,
    login,
    logout,
    me,
    registernext,
    //uploadMiddleware
} from "../controllers/auth.controller.js";
import { deleteUser, getProfile, updateSettings } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/jwt.js";
import  authMiddleware  from "../middleware/auth.js";

const router = express.Router();

// Authentication Routes
router.post("/register", register); // Use POST for registration
router.post("/registernext", registernext); // Use POST for additional registration details
router.post("/login", login); // Use POST for login
router.post("/logout", logout); // Logout can remain as GET
router.get("/me", verifyToken, me); // Protected route to get user details
router.get('/profile', authMiddleware, getProfile); // Route to fetch user profile
router.post('/settings', authMiddleware, updateSettings);// Route to update user settings
// User Management Routes
router.delete("/:id", verifyToken, deleteUser); // Protected route to delete a user

export default router;