import Bid from "../models/bid.model.js";
import Task from "../models/task.model.js";

export const placeBid = async (req, res) => {
  try {
    const { taskId, proposedWage, proposedDuration } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;
    const userVerified = req.user.emailVerified; // Set by your auth middleware if available

    // Check if task exists
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found." });

    // Check if task is expired or not accepting bids
    if (task.deadline && new Date() > new Date(task.deadline)) {
      return res.status(400).json({ message: "This task has expired and no longer accepts bids." });
    }
    if (task.jobBidding === false) {
      return res.status(400).json({ message: "This task does not accept bids." });
    }

    // Check for existing bid
    const existing = await Bid.findOne({ taskId, userId });
    if (existing) return res.status(400).json({ message: "You have already placed a bid for this task." });

    // Create bid
    const bid = new Bid({
      taskId,
      taskTitle: task.taskTitle || task.title,
      userId,
      userEmail,
      proposedWage,
      proposedDuration,
      userVerified,
      // userRating: ... // You can fetch and set this if you have user ratings
    });
    await bid.save();

    res.status(201).json(bid);
  } catch (err) {
    console.error("Error placing bid:", err);
    res.status(500).json({ message: "Failed to place bid." });
  }
};