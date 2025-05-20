// filepath: c:\Users\ehisd\Desktop\Hitmeupv2.0\api\routes\task.route.js
import express from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getRandomTask,
  uploadTaskImage,
  searchTasks,
  getPostedTasks,
} from "../controllers/task.controller.js";
import { verifyToken } from "../middleware/jwt.js"; // Import middleware
import upload from "../middleware/upload.js";

const router = express.Router();

// Define routes
router.post("/",verifyToken ,upload.single("file"), createTask); // Create a new task
router.get("/", verifyToken, getTasks); // Get all tasks
router.post("/:id/upload-image", upload.single("image"), uploadTaskImage);// Route to upload an image for a task
router.get("/random", getRandomTask); // Get a random task
router.get("/search", searchTasks); // Get a random task
router.get("/posted", verifyToken, getPostedTasks); // Get all tasks posted by the logged-in user
router.get("/:id", verifyToken, getTaskById); // Get a single task by ID
router.put("/:id",verifyToken, updateTask); // Update a task by ID
router.delete("/:id",verifyToken, deleteTask); // Delete a task by ID

export default router;