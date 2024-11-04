import express from "express";
import { db } from "../shared/db.js";

import TaskController from "../controllers/task.controller.js";
import TaskService from "../services/task.service.js";

export const taskRouter = express.Router();
taskRouter.use(express.json());

const taskService = new TaskService(db);
const taskController = new TaskController(taskService);

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
 * /task/status/{userId}:
 *   get:
 *     description: Get tasks with their status for a specific user
 *     summary: Get tasks with status by user ID
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of tasks with their status
 *       400:
 *         description: Bad request
 */
taskRouter.get("/task/status/:userId", async (req, res) =>
  taskController.getTasksWithStatus(req, res),
);

/**
 * @openapi
 * /task/{id}:
 *   get:
 *     description: Get task by id
 *     summary: Get task by id
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single task
 *       400:
 *         description: Bad request
 *       404:
 *         description: Task not found
 */
taskRouter.get("/task/:id", async (req, res) =>
  taskController.getTask(req, res),
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
 *                     type: object
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
