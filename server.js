import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import { connectToDatabase } from "./config/database.config.js";
import routes from "./routes/index.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use("/api/auth", routes.authRoutes);
app.use("/api/users", routes.userRoutes);
app.use("/api/tasks", routes.taskRoutes);

app.get("/", (req, res) => {
  res.send("The Server is running: Use /api to Run Tests");
});

// middleware
app.use(errorHandler);

app
  .listen(port, async () => {
    await connectToDatabase();
    console.log(`Server is running on http://localhost:${port}`);
  })
  .on("error", (err) => {
    console.error("Server Error", err);
  });
