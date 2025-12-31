import http from "http";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import { connectToDatabase } from "./config/database.config.js";
// import { initializeSocket } from "./config/socket.config.js";
// import { stripeWebhook } from "./controllers/payment.controller.js";
import routes from "./routes/index.js";
import {
  generalLimiter,
  authLimiter,
  paymentLimiter,
} from "./config/rateLimiter.config.js";
import { swaggerUiServe, swaggerUiSetup } from "./config/swagger.config.js";
import { logger, morganStream } from "./config/logger.config.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(helmet());
app.use(morgan("combined", { stream: morganStream }));
app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(generalLimiter);

// Routes
app.use("/api/auth", authLimiter, routes.authRoutes);
app.use("/api/users", routes.userRoutes);

app.get("/", (req, res) => {
  res.send("The Server is running: Use /api to Run Tests");
});

// API Documentation
app.use("/api-docs", swaggerUiServe, swaggerUiSetup);

// middleware
app.use(errorHandler);

// initializeSocket(server);

app
  .listen(port, async () => {
    await connectToDatabase();
    console.log(`Server is running on http://localhost:${port}`);
    console.log(
      `API Documentation available at http://localhost:${port}/api-docs`
    );
  })
  .on("error", (err) => {
    console.error("Server Error", err);
  });
