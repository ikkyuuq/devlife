import { eq } from "drizzle-orm";
import * as schema from "../shared/models/schema.js";

export default class TaskService {
  #db;
  constructor(db) {
    this.#db = db;
  }

  async deleteTestTask(taskId) {
    try {
      await this.#db
        .delete(schema.taskTestTable)
        .where(eq(schema.taskTestTable.taskId, taskId));
    } catch (error) {
      console.error("Error in deleteTestTask:", error);
      return null;
    }
  }

  async deleteTask(taskId) {
    try {
      await this.#db
        .delete(schema.taskTable)
        .where(eq(schema.taskTable.id, taskId));
    } catch (error) {
      console.error("Error in deleteTask:", error);
      return null;
    }
  }

  async getTaskSubmissionsByUserId(userId) {
    const submissions = await this.#db.query.taskSubmissionTable.findMany({
      where: eq(schema.taskSubmissionTable.userId, userId),
    });

    return submissions;
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
        author: task.author || "Anonymous",
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
}
