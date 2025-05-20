import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  taskTitle: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userEmail: { type: String, required: true },
  proposedWage: { type: Number, required: true },
  proposedDuration: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: "pending" },
  userVerified: { type: Boolean, default: false },
  userRating: { type: Number, default: 1 }
});

export default mongoose.model("Bid", bidSchema);