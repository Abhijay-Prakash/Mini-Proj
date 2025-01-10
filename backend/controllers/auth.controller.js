import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import image from "../models/mongodb/imageModel.js";

import { User } from "../models/postgresql/userSchema.js";


export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        // Password match check
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        // Check if the username already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Profile picture URL based on gender
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const profilePic = gender === "male" ? boyProfilePic : girlProfilePic;

        // Create new user in the database
        const newUser = await User.create({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic,
        });

        // Generate token and set cookie
        generateTokenAndSetCookie(newUser.userId, res);

        // Respond with the new user data
        res.status(201).json({
            id: newUser.userId,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic,
        });
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ where: { username } });

        // Check if user exists
        if (!user) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        // Compare the hashed password with the user input
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        // Generate token and set cookie
        generateTokenAndSetCookie(user.userId, res);

        // Respond with user data
        res.status(200).json({
            id: user.userId,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
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
