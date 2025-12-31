import { Task } from "../models/task.model.js";
import { createError } from "../lib/createError.util.js";

export const createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    if (!title || !description) {
      throw createError(400, "Title and description are required");
    }
    const task = await Task.create({ title, description, status });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      throw createError(404, "Task not found");
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status },
      { new: true, runValidators: true }
    );
    if (!task) {
      throw createError(404, "Task not found");
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      throw createError(404, "Task not found");
    }
    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};
