import { User } from "../models/userSchema.js";
import { OTP } from "../models/otpSchema.js";

export const verifyOtp = async (req, res) => {
    try {
        const { email, otpCode } = req.body;
        console.log(otpCode)

        if (!email || !otpCode) {
            return res.status(400).json({ error: "Email and OTP Code are required" });
        }

        const otpRecord = await OTP.findOne({ where: { email, otpCode } });

        if (!otpRecord || new Date() > otpRecord.expiresAt) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.isVerified = true;
        await user.save();


        await OTP.destroy({ where: { email } });

        res.status(200).json({ message: "Email verified successfully. You can now log in." });

    } catch (error) {
        console.error("Error during OTP verification:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};