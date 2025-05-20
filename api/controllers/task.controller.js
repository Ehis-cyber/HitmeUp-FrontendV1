import Task from "../models/task.model.js";
import cloudinary from "cloudinary";
import client from '../utils/smartyGeocoder.js';
import axios from "axios";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fetch and filter tasks
export const getTasks = async (req, res) => {
  try {
    const {
      keyword,
      location,
      jobType,
      experience,
      employmentType,
      duration,
      salaryRange,
      sort,
    } = req.query;

    // Build the query object
    const query = {};

    // Keyword filter
    if (keyword) {
      query.taskTitle = { $regex: keyword, $options: "i" }; // Case-insensitive search
    }

    // Location filter
    if (location) {
      query.location = location;
    }

    // Job type filter
    if (jobType) {
      query.category = jobType;
    }

    // Experience filter
    if (experience) {
      query.experience = experience; // Match the exact experience level
    }

    // Duration filter
    if (duration) {
      query.duration = duration;
    }

    // Employment type filter
    if (employmentType) {
      query.category = { $in: employmentType.split(",") }; // Split comma-separated values
    }

    // Salary range filter
    if (salaryRange && typeof salaryRange === "object" && "0" in salaryRange && "1" in salaryRange) {
      const min = Number(salaryRange[0]);
      const max = Number(salaryRange[1]);
      query.payment = { $gte: min, $lte: max };
    } else if (salaryRange) {
      console.warn("Invalid salaryRange:", salaryRange);
    }
    
    // Fetch tasks from the database
    let tasks = await Task.find(query);

    // Sort tasks
    if (sort === "newest") {
      tasks = tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "oldest") {
      tasks = tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get a single task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (err) {
    console.error("Error fetching task:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new task
export const createTask = async (req, res) => {
  try {
    const {
      taskTitle,
      jobDescription,
      skills,
      payment,
      duration,
      taskersNeeded,
      location,
      category,
      experience,
      clientName,
    } = req.body;

    // Map clientName to companyName
    const companyName = clientName;

    let companyLogo_userimage = null;

    // Geocode the location
    const geocodeResponse = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address: location,
        key: process.env.GOOGLE_MAPS_API_KEY, // Your Google Maps API key
      },
    });

    const geocodeData = geocodeResponse.data;
    if (geocodeData.results.length === 0) {
      return res.status(400).json({ message: "Invalid location." });
    }
    // Extract the broader administrative region (e.g., "Lagos")
    const addressComponents = geocodeData.results[0].address_components;
    const state = addressComponents.find((component) =>
      component.types.includes("administrative_area_level_1")
    )?.long_name;

    // Check if a file is uploaded
    if (req.file) {
      try{
      // Upload the file to Cloudinary
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "tasks", // Optional: Specify a folder in Cloudinary
      });
      companyLogo_userimage = result.secure_url; // Get the secure URL of the uploaded image
    } catch (uploadError) {
      console.error("Error uploading file to Cloudinary:", uploadError);
      return res.status(500).json({ message: "Failed to upload file to Cloudinary" });
    }
    }

    // Extract userId from the authenticated user's token
    const userId = req.user?.id; // Assuming `req.user` is populated by authentication middleware

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID not found" });
    }

    const newTask = new Task({
      userId, // Associate the task with the userId
      taskTitle,
      jobDescription,
      skills,
      payment,
      duration,
      taskersNeeded,
      location,
      state, // Store the broader administrative region
      category,
      experience,
     companyName,
      companyLogo_userimage, // Store the Cloudinary URL
    });
// Save the task to the database
    await newTask.save();

    res.status(201).json(newTask);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Failed to create task", error: err.message });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const updatedData = req.body;

    const updatedTask = await Task.findByIdAndUpdate(taskId, updatedData, {
      new: true, // Return the updated document
    });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//pick random task
export const getRandomTask = async (_req, res) => {
  try {
    // Fetch 3 random tasks
    const tasks = await Task.aggregate([{ $sample: { size: 3 } }]); // Fetch 3 random tasks
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching random tasks:", err);
    res.status(500).json({ message: "Failed to fetch random tasks" });
  }
};

// Upload an image for a task
export const uploadTaskImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

     // Upload the file to Cloudinary
     const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "tasks", // Optional: Specify a folder in Cloudinary
    });

    // Update the task with the image path
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { companyLogo_userimage: req.file.path},
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error("Error uploading task image:", err);
    res.status(500).json({ message: "Failed to upload task image" });
  }
};

// Search tasks based on location and other filters
export const searchTasks = async (req, res) => {
  try {
    const { location, keyword, jobType, experience, employmentType} = req.query;

    let geocodedData = null;
    const query = {};

    // Handle location (geocode if present)
    if (location) {
      try {
        geocodedData = await geocodeLocation(location);
        if (geocodedData && geocodedData.state) {
          query.location = { $regex: geocodedData.state, $options: "i" };
        }
      } catch (geoErr) {
        // If geocoding fails, fallback to simple location search
        query.location = { $regex: location, $options: "i" };
      }
    }

    // Keyword filter
    if (keyword) {
      query.taskTitle = { $regex: keyword, $options: "i" };
    }

    // Job type filter
    if (jobType) {
      query.category = jobType;
    }

    // Experience filter
    if (experience) {
      query.experience = experience;
    }


    // Employment type filter (array or comma-separated)
    if (employmentType) {
      if (Array.isArray(employmentType)) {
        query.category = { $in: employmentType };
      } else if (typeof employmentType === "string") {
        query.category = { $in: employmentType.split(",") };
      }
    }


    // Find tasks
    const tasks = await Task.find(query);
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error searching tasks:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};
// This function retrieves all tasks posted by the user
export const getPostedTasks = async (req, res) => {
  try {
    // req.user.id should be set by verifyToken middleware after JWT verification
    const userId = req.user.id;
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    
    res.status(500).json({ message: "Failed to fetch posted tasks." });
  }
};