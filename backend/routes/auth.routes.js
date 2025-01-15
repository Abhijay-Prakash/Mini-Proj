import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import { verifyOtp } from "../services/otpService.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/verifyotp", verifyOtp);

export default router;
