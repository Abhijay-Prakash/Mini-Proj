import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../../db/connectToPostgreSQL.js";

export const User = sequelize.define("User", {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profilePic: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: "users",
    timestamps: false,
});

