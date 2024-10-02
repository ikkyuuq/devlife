import express from "express";
import { db } from "../configs/db.js";
import { lucia } from "../configs/auth.js";

import TaskController from "../controllers/task.controller.js";
import TaskService from "../services/task.service.js";
import AuthService from "../services/auth.service.js";

export const taskRouter = express.Router();
taskRouter.use(express.json());

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

taskRouter.use(authenticateApiToken);

/**
 * @openapi
 * /task:
 *   get:
 *     description: Get all tasks
 *     summary: Get all tasks
 *     tags:
 *       - Tasks
 *     responses:
 *       200:
 *         description: A list of tasks
 *       400:
 *         description: Bad request
 */
taskRouter.get("/task", async (req, res) =>
  taskController.getAllTask(req, res),
);

/**
 * @openapi
 * /task:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Create a new task
 *     description: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               task:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   objective:
 *                     type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                   content:
 *                     type: string
 *                   tests:
 *                     type: string
 *             required:
 *               - task
 *     responses:
 *       200:
 *         description: Task created
 *       400:
 *         description: Bad request
 */
taskRouter.post("/task", async (req, res) =>
  taskController.createTask(req, res),
);

/**
 * @openapi
 * /task:
 *   put:
 *     tags:
 *       - Tasks
 *     summary: Update a task
 *     description: Update a task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               task:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   objective:
 *                     type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                   content:
 *                     type: string
 *                   tests:
 *                     type: string
 *             required:
 *               - task
 *     responses:
 *       200:
 *         description: Task created
 *       400:
 *         description: Bad request
 */
taskRouter.put("/task", async (req, res) =>
  taskController.updateTask(req, res),
);
