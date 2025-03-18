import express from "express";
import { getCurrentUser, login, logout, signup } from "../controllers/auth.controller.js";
import { verifyOtp } from "../services/otpService.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);
router.get("/me",protectRoute,getCurrentUser);

router.post("/verifyotp",verifyOtp);

export default router;
