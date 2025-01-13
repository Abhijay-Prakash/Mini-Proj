import bcrypt from "bcryptjs";
import { Op } from "sequelize";

import generateTokenAndSetCookie from "../utils/generateToken.js";
import image from "../models/mongodb/imageModel.js";

import { User } from "../models/postgresql/userSchema.js";


export const signup = async (req, res) => {
    try {
        const { fullName, username, email, password, confirmPassword, gender } = req.body;


        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }


        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ username }, { email }],
            },
        });
        if (existingUser) {
            return res.status(400).json({
                error: existingUser.username === username
                    ? "Username already exists"
                    : "Email already exists",
            });
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const profilePic = gender === "male" ? boyProfilePic : girlProfilePic;



        const newUser = await User.create({
            fullName,
            username,
            email,
            password: hashedPassword,
            gender,
            profilePic,
        });


        generateTokenAndSetCookie(newUser.userId, res);


        res.status(201).json({
            id: newUser.userId,
            fullName: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
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
