import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../db/connectToPostgreSQL.js";
import {User} from "./userSchema.js";


export const Image = sequelize.define("Image", {
    id: { 
        type: DataTypes.INTEGER,
        autoIncrement: true, 
        primaryKey: true 
    },
   
    imageTitle: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    
    description: {
        type: DataTypes.TEXT, 
        defaultValue: ""
    },
    
    imageUrl: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },

    uploaderId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    uploaderUsername: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    tags: { 
        type: DataTypes.ARRAY(DataTypes.STRING), 
        defaultValue: [] 
    },
}, {
    tableName: "images",  
    schema: "public",  
    timestamps: true,
});

(async () => {
    const { User } = await import("./userSchema.js");
    Image.belongsTo(User, { foreignKey: "uploaderId" });
  })();