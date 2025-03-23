import bcrypt from "bcryptjs";
import { Op } from "sequelize";


import generateTokenAndSetCookie from "../utils/generateToken.js";
import { sendEmail } from "../services/mailService.js";
import { User } from "../models/userSchema.js";
import { OTP } from "../models/otpSchema.js";


const generateAvatar = (username, gender) => {
    const encodedUsername = encodeURIComponent(username);
    
    if (gender === "male") {
        return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodedUsername}`;
    } else if (gender === "female") {
        return `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${encodedUsername}`;
    } else {
        return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodedUsername}`;
    }
};

export const signup = async (req, res) => {
    try {
        console.log("Request body:", req.body);

        const { fullName, username, email, password, gender } = req.body;

        if (!fullName || !username || !email || !password || !gender) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if the username already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate profile picture based on gender
        const profilePic = generateAvatar(username, gender);

        // Generate OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 mins

        await OTP.create({
            email,
            otpCode,
            expiresAt: otpExpiry,
        });

        // Send OTP via email
        const emailText = `Your verification code is: ${otpCode}. It will expire in 10 minutes.`;
        await sendEmail(email, "Email Verification Code", emailText);

        // Create the user
        const newUser = await User.create({
            fullName,
            username,
            email,
            password: hashedPassword,
            gender,
            profilePic,
            isVerified: false,
        });

        res.status(200).json({
            message: "Signup successful. Verify your email to activate your account.",
            userId: newUser.userId,
        });
    } catch (error) {
        console.error("Error in signup controller:", error.message);
        
        if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
            console.error("Validation Errors:", error.errors.map(err => err.message));
            return res.status(400).json({ error: "Validation error, check inputs" });
        }

        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(400).json({ error: "Invalid username or password" });
        }


        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        if (!user.isVerified) {
            const otpCode = Math.floor(100000 + Math.random() * 900000);

            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes


            await OTP.create({
                email: user.email,
                otpCode,
                expiresAt: otpExpiry,
            });

            const emailText = `Your OTP code is: ${otpCode}. It will expire in 10 minutes.`;
            await sendEmail(user.email, "OTP Verification", emailText);

            return res.status(200).json({
                message: "User not verified. A new OTP has been sent to your email.",
            });
        }


        generateTokenAndSetCookie(user.userId, res);

        res.status(200).json({
            user: {
                id: user.userId,
                fullName: user.fullName,
                username: user.username,
                email: user.email, 
                profilePic: user.profilePic,
            },
        });
        
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

import jwt from "jsonwebtoken";

export const getCurrentUser = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    res.json({ user: req.user });
};
