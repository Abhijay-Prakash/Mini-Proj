import { app, sequelize } from "./index.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on PORT ${PORT}`);

  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL successfully.");

    await sequelize.sync({ alter: true }); // Sync models
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Database connection error:", error);
  }
});
