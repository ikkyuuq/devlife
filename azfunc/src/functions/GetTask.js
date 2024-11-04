import { app } from "@azure/functions";
import db from "../shared/db.js";
import * as schema from "../shared/schema.js";
import { eq } from "drizzle-orm";

app.http("GetTask", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log("Getting task");
    const taskId = request.query.get("id");

    context.log("Task ID:", taskId);

    context.log("Finding task");
    const task = await db.query.taskTable.findFirst({
      where: eq(schema.taskTable.id, taskId),
    });

    if (!task) {
      context.error("Task not found:", taskId);
      return {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "Task not found" }),
      };
    }

    context.log("Finding task tests");
    const test = await db.query.taskTestTable.findFirst({
      where: eq(schema.taskTestTable.taskId, taskId),
    });

    if (!test) {
      context.error("Task tests not found:", taskId);
      return {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "Task tests not found" }),
      };
    }

    context.log("Returning task");
    return {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task: {
          ...task,
          tests: test.tests,
        },
      }),
    };
  },
});
