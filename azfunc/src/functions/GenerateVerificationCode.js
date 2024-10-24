import { app } from "@azure/functions";
import db from "../shared/db.js";
import * as schema from "../shared/schema.js";
import { eq } from "drizzle-orm";
import { generateRandomString, alphabet } from "oslo/crypto";
import { createDate, TimeSpan } from "oslo";

app.http("GenerateVerificationCode", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const { userId } = await request.json();

      context.log("GenerateVerificationCode function processed a request...");
      if (!userId || typeof userId !== "string") {
        context.error("Invalid userId");
        return {
          status: 400,
          body: JSON.stringify({ error: "Invalid userId" }),
        };
      }

      await db
        .delete(schema.emailVerificationTable)
        .where(eq(schema.emailVerificationTable.userId, userId))
        .execute();

      context.log("Generating verification code...");
      const code = generateRandomString(8, alphabet("0-9"));

      context.log("Inserting verification code...");
      await db.insert(schema.emailVerificationTable).values({
        userId,
        code,
        expiresAt: createDate(new TimeSpan(15, "m")),
      });

      context.log("Verification code generated successfully");
      return { status: 200, body: JSON.stringify({ code }) };
    } catch (error) {
      context.error("Error in GenerateVerificationCode:", error);
      return {
        status: 500,
        body: JSON.stringify({ error: "Internal server error" }),
      };
    }
  },
});
