import { eq } from "drizzle-orm";
import * as schema from "../models/schema.js";

export default class TaskService {
  #db;
  constructor(db) {
    this.#db = db;
  }

  async updateTask(task) {
    const [taskUpdated] = await this.#db
      .update(schema.taskTable)
      .set({
        title: task.title,
        objective: task.objective,
        tags: task.tags,
        content: task.content,
        updatedAt: new Date(),
      })
      .where(eq(schema.taskTable.id, task.id))
      .returning();

    const [testUpdated] = await this.#db
      .update(schema.taskTestTable)
      .set({
        tests: task.tests,
      })
      .where(eq(schema.taskTestTable.taskId, task.id))
      .returning();

    return { taskUpdated, testUpdated };
  }

  async createTask(task) {
    const [createdTask] = await this.#db
      .insert(schema.taskTable)
      .values({
        id: task.id,
        title: task.title,
        objective: task.objective,
        tags: task.tags,
        content: task.content,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    await this.#db
      .insert(schema.taskTestTable)
      .values({
        taskId: createdTask.id,
        tests: task.tests,
      })
      .onConflictDoNothing();

    return createdTask;
  }

  async getAllTasks() {
    const result = await this.#db.select().from(schema.taskTable);
    return result;
  }

  async getTask(taskId) {
    try {
      const task = await this.#db.query.taskTable.findFirst({
        where: eq(schema.taskTable.id, taskId),
      });
      if (!task) {
        throw new Error("Task not found");
      }
      return task;
    } catch (error) {
      throw new Error("Failed to fetch task", { cause: error });
    }
  }
}
