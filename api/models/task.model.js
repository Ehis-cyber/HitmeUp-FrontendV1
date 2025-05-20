import mongoose from "mongoose";
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    taskTitle: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    skills: {
      type: [String], // Array of skills
      required: true,
    },
    payment: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      default: "",
    },
    taskersNeeded: {
      type: Number,
      default: 1,
    },
    location: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    bidAvailable: {
      type: Boolean,
      default: false,
    },
    experience: {
       type: String, 
       enum: ["junior", "mid-level", "senior", "novice"], // Experience level options
       required: true }, // Experience level

       companyName: { 
        type: String, 
        required: true,
        required: true
      },

    companyLogo_userimage: { 
      type: String 
    },
    status: {
  type: String,
  enum: ["open", "assigned", "in progress", "completed", "cancelled"],
  default: "open"
},
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

export default mongoose.model("Task", taskSchema);