import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import http from "http";
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import cookieParser from 'cookie-parser';
import taskRoutes from "./routes/tasks.route.js";
import bidRoutes from "./routes/bid.route.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";

dotenv.config(); // Load environment variables

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
const app = express();
mongoose.set('strictQuery', true);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
      tls:true,
      tlsAllowInvalidCertificates: false, // Ensure certificates are valid
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
  app.use(express.json());
  app.use(cookieParser()); // Middleware to parse cookies
  const server = http.createServer(app); // Create an HTTP server
  const io = new Server(server, {
  cors:{
    origin: "http://localhost:3000", 
    credentials: true,
  },
}); 
// Allow requests from frontend
// Make `io` globally accessible
global.io = io;

//middleware
app.use(cors(
  {
    origin: "http://localhost:3000", // Replace with your frontend's URL
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methodsh
  }
));
// Serve static files from the "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Define routes
  app.use("/api/users", userRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/tasks", taskRoutes); // Register task routes
  app.use("/api/messages", messageRoutes); // Register message routes
  app.use("/api/bids", bidRoutes); // Register bid routes

app.use((err,req,res,next)=>{
req.io = io;
const errorState = err.status || 500;
const errorMessage = err.message || "Something went wrong!";
console.log(`${req.method} ${req.url}`);
next();

return res.status(errorState).json(errorMessage);
  })

  // Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  

  // Listen for incoming messages
  socket.on("sendMessage", (message) => {
    console.log("Message received:", message);

    // Broadcast the message to all connected clients
    io.emit("receiveMessage", message);
  });

  socket.on("markAsRead", (message) => {
    console.log("Message Read:", message);

    // Broadcast the message to all connected clients
    io.emit("messageRead", message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

  server.listen(8800, () => {
    console.log('Server is running on port 8800');
  });
};
//for frontend end npm run dev start's local host
startServer();