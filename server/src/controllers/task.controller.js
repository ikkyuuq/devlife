import { env } from "node:process";

export default class TaskController {
  #taskService;
  constructor(taskService) {
    this.#taskService = taskService;
  }

  async deleteTask(req, res) {
    try {
      const taskId = await req.params.id;
      if (!taskId) {
        return res.status(400).send({ error: "Task ID is required" });
      }

      await this.#taskService.deleteTestTask(taskId);
      await this.#taskService.deleteTask(taskId);

      return res.status(200).send({ message: "Task deleted" });
    } catch (error) {
      console.error("Error in deleteTask:", error);
      return res.status(400).send({ error: error.message });
    }
  }

  async getTasksWithStatus(req, res) {
    try {
      const userId = req.params.userId;
      const tasks = await this.#taskService.getAllTasks();
      const taskSubmissions =
        await this.#taskService.getTaskSubmissionsByUserId(userId);

      const taskStatusMap = new Map(
        taskSubmissions.map((submission) => [
          submission.taskId,
          submission.status,
        ]),
      );

      const tasksWithStatus = tasks.map((task) => ({
        ...task,
        status: taskStatusMap.get(task.id) || "not done",
      }));

      return res.status(200).send({ tasksWithStatus });
    } catch (error) {
      console.error("Error in getTasksWithStatus:", error);
      return res.status(400).send({ error: error.message });
    }
  }

  async getTask(req, res) {
    try {
      const taskId = await req.params.id;
      if (!taskId) {
        return res.status(400).send({ error: "Task ID is required" });
      }
      const task = await fetch(
        `${env.AZURE_FUNCTIONS_URL}gettask?id=${taskId}`,
      );

      if (!task.ok) {
        return res.status(task.status).send({ error: task.error });
      }

      const data = await task.json();
      return res.status(200).send(data);
    } catch (error) {
      return res.status(400).send({ error: error.message });
    }
  }

  async createTask(req, res) {
    try {
      const task = await req.body.task;
      await this.#taskService.createTask(task);

      return res.status(200).send({ message: "Task created" });
    } catch (error) {
      return res.status(400).send({ error: error.message });
    }
  }

  async updateTask(req, res) {
    try {
      const task = await req.body.task;
      const updatedTask = await this.#taskService.updateTask(task);

      return res.status(200).send({ message: "Task updated", updatedTask });
    } catch (error) {
      return res.status(400).send({ error: error.message });
    }
  }

  async getAllTask(req, res) {
    try {
      const tasks = await this.#taskService.getAllTasks();
      return res.status(200).send({ tasks });
    } catch (error) {
      return res.status(400).send({ error: error.message });
    }
  }
}
