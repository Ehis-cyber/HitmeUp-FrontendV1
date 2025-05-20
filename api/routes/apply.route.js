import express from "express";
import { submitApplication } from "../controllers/application.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, submitApplication);

export default router;