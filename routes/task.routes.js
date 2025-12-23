import express from "express";
import {
  deleteTask,
  updateTask,
  getTaskById,
  getAllTasks,
  createTask,
} from "../controllers/task.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", createTask);
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.put("/:id", authenticateUser, updateTask);
router.delete("/:id", authenticateUser, deleteTask);


export default router;