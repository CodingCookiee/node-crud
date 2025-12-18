import express from "express";
import {
  deleteTask,
  updateTask,
  getTaskById,
  getAllTasks,
  createTask,
} from "../controllers/task.controller.js";
import { verifyToken } from '../middleware/auth.middleware.js';


export const router = express.Router();

router.post("/", verifyToken, createTask);
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.put("/:id", verifyToken, updateTask);
router.delete("/:id", verifyToken, deleteTask);


