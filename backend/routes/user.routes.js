import express from "express";
import { getUserProfile} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/profile", protectRoute, getUserProfile); 

export default router;
