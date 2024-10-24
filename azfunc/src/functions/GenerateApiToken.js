import { app } from "@azure/functions";
import db from "../shared/db.js";
import * as schema from "../shared/schema.js";
import { eq } from "drizzle-orm";
import { generateRandomString, alphabet } from "oslo/crypto";

export const GenerateApiToken = async (userId, context) => {
  try {
    context.log("Received userId for token generation.");

    if (!userId) {
      context.error("User ID is required");
      return {
        status: 400,
        body: JSON.stringify({ error: "User ID is required" }),
      };
    }

    const token = generateRandomString(64, alphabet("a-zA-Z0-9"));
    context.log("Token generated.");
    const existingToken = await db.query.tokenTable.findFirst({
      where: eq(schema.tokenTable.userId, userId),
    });
    context.log("Checking if token exists in the database.");

    if (existingToken) {
      context.log("Token exists. Updating token in the database.");
      await db
        .update(schema.tokenTable)
        .set({ token })
        .where(eq(schema.tokenTable.userId, userId));
    } else {
      context.log("Token does not exist. Inserting token into the database.");
      await db.insert(schema.tokenTable).values({
        token,
        userId,
      });
    }

    context.log("Token saved to the database.");
    return {
      status: 200,
      body: JSON.stringify({ token, message: "Generate Token Sucessfull" }),
    };
  } catch (error) {
    context.error("Error in GenerateApiToken:", error);
    return {
      status: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

app.http("GenerateApiToken", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: GenerateApiToken,
});
