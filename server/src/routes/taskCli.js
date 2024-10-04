import express from "express";
import { db } from "../configs/db.js";
import { lucia } from "../configs/auth.js";

import TaskController from "../controllers/task.controller.js";
import TaskService from "../services/task.service.js";
import AuthService from "../services/auth.service.js";

export const taskCliRouter = express.Router();
taskCliRouter.use(express.json());

const taskService = new TaskService(db);
const taskController = new TaskController(taskService);
const authService = new AuthService(db, lucia);

// Middleware to check if the user is authenticated only for the task routes
const authenticateApiToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  const user = await authService.validateApiToken(token);
  if (!user) {
    return res.status(401).json({ error: "Invalid token" });
  }
  req.user = user;
  next();
};

taskCliRouter.use(authenticateApiToken);

/**
 * @openapi
 * /task/{taskId}:
 *   get:
 *     description: Get a task by ID
 *     summary: Get a task by ID
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: taskId
 *         description: Task ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A task
 *       400:
 *         description: Bad request
 */
taskCliRouter.get("/task/:taskId", async (req, res) => {
  taskController.getTask(req, res);
});
