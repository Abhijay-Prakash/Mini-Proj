import { DataTypes } from "sequelize";
import sequelize from "../db/connectToPostgreSQL.js";


export const OTP = sequelize.define("OTP", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otpCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: "otps",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
});

