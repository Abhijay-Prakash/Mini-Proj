import bcrypt from "bcryptjs";
import { Op } from "sequelize";


import generateTokenAndSetCookie from "../utils/generateToken.js";
import { sendEmail } from "../services/mailService.js";
import { User } from "../models/postgresql/userSchema.js";
import { OTP } from "../models/postgresql/otpSchema.js";


export const signup = async (req, res) => {
    try {
        const { fullName, username, email, password, gender } = req.body;


        // if (password !== confirmPassword) {
        //    return res.status(400).json({ error: "Passwords don't match" });
        // }


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



        const otpCode = crypto.randomInt(100000, 999999); //  6-digit OTP
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);// 10 mins validity 

        await OTP.create({
            email,
            otpCode,
            expiresAt: otpExpiry,
        });
        const emailText = `Your verification code is: ${otpCode}. It will expire in 10 minutes.`;
        await sendEmail(email, "Email Verification Code", emailText);



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
        console.log("Error in signup controller", error.message);
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

            // Save OTP in database
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
            id: user.userId,
            fullName: user.fullName,
            username: user.username,
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

