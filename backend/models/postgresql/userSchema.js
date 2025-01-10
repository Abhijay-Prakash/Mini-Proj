import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../../db/connectToPostgreSQL.js"; // Your Sequelize instance

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
}, {
    tableName: "users", // Ensures Sequelize looks for the correct table
    timestamps: false, // Adjust this based on your schema
});

