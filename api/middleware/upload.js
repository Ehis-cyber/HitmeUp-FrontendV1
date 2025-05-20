import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../middleware/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "tasks", // Folder name in Cloudinary
    allowed_formats: ["jpeg", "png", 
    "gif", "webp", "jpg", "svg+xml"], // Allowed file formats
  },
});

const upload = multer({ storage });

export default upload;