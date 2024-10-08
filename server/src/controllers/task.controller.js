export default class TaskController {
  #taskService;
  constructor(taskService) {
    this.#taskService = taskService;
  }

  async submitTask(req, res) {
    try {
      const taskId = await req.body.taskId;
      const token = await req.headers.authorization?.split(" ")[1];
      const status = await req.body.status;
      await this.#taskService.submitTask(taskId, token, status);

      return res.status(200).send({ message: "Task submitted" });
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

  async getTask(req, res) {
    try {
      const taskId = await req.params.taskId;
      const task = await this.#taskService.getTask(taskId);
      return res.status(200).send({ task });
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
