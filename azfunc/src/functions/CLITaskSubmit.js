import { app } from "@azure/functions";
import db from "../shared/db.js";
import * as schema from "../shared/schema.js";
import { eq, and } from "drizzle-orm";

app.http("CLITaskSubmit", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      context.warn("No authorization header present");
      return {
        status: 401,
        body: JSON.stringify({ error: "Authorization header required" }),
      };
    }
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const { taskId, status } = await request.json();
    try {
      const task = await db.query.taskTable.findFirst({
        where: eq(schema.taskTable.id, taskId),
      });

      if (!task) {
        context.error("Task not found:", taskId);
        return {
          status: 404,
          body: JSON.stringify({ error: "Task not found" }),
        };
      }

      context.log("Checking token:", token);
      const isValidToken = await db.query.tokenTable.findFirst({
        where: eq(schema.tokenTable.token, token),
      });

      if (!isValidToken) {
        context.warn("Invalid token:", token);
        return {
          status: 401,
          body: JSON.stringify({ error: "Invalid token" }),
        };
      }

      const user = await db.query.userTable.findFirst({
        where: eq(schema.userTable.id, isValidToken.userId),
      });

      if (!user) {
        context.error("User not found:", isValidToken.userId);
        return {
          status: 404,
          body: JSON.stringify({ error: "User not found" }),
        };
      }

      context.log("Checking for existing task submission for user:", user.id);
      const submission = await db.query.taskSubmissionTable.findFirst({
        where: and(
          eq(schema.taskSubmissionTable.taskId, taskId),
          eq(schema.taskSubmissionTable.userId, user.id),
        ),
      });

      if (submission) {
        context.log("Updating task submission:", submission.id);
        await db
          .update(schema.taskSubmissionTable)
          .set({
            status: status,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(schema.taskSubmissionTable.taskId, taskId),
              eq(schema.taskSubmissionTable.userId, user.id),
            ),
          );
        return {
          status: 200,
          body: JSON.stringify({ message: "Task updated" }),
        };
      }

      context.log("Creating task submission for user:", user.id);
      await db.insert(schema.taskSubmissionTable).values({
        taskId: taskId,
        userId: user.id,
        status: status,
      });

      context.log("Task submitted");
      return {
        status: 200,
        body: JSON.stringify({ message: "Task submitted" }),
      };
    } catch (error) {
      context.error("Error in CLITaskSubmit:", error);
      return {
        status: 500,
        body: JSON.stringify({ error: "Internal server error" }),
      };
    }
  },
});
