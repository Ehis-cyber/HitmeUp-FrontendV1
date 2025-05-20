import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone:{type:String,required:true },
  city:{type:String,required:true },
  state:{type:String,required:true },
  country:{type:String, required:true},
  resume: { type: String },      // URL to resume
  portfolio: { type: String },   // URL to portfolio
  createdAt: { type: Date, default: Date.now },
  // ...other fields
});

export default mongoose.model("Application", applicationSchema);