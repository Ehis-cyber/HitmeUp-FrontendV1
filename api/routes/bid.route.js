import express from "express";
import { placeBid } from "../controllers/bid.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, placeBid);

export default router;