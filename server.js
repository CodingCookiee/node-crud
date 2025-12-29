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
app.use("/api/products", routes.productRoutes);
app.use("/api/categories", routes.categoryRoutes);
app.use("/api/cart", routes.cartRoutes);
app.use("/api/orders", routes.orderRoutes);
app.use("/api/reviews", routes.reviewRoutes);
app.use("/api/upload", routes.uploadRoutes);

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
