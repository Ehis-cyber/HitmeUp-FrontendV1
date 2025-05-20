import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { sendMessage, getMessages, markMessageAsRead } from "../controllers/message.controller.js";

const router = express.Router(); // Initialize the router

// Define routes for message-related operations
// POST /api/messages/send - Send a message
router.post("/send", verifyToken, sendMessage); // Send a message
router.get("/", verifyToken, getMessages); // Get all messages for the authenticated user
router.put("/:messageId/read", verifyToken, markMessageAsRead);

export default router;



