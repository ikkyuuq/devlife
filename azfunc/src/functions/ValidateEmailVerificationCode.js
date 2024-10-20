import { app } from "@azure/functions";
import db from "../shared/db.js";
import { eq } from "drizzle-orm";
import * as schema from "../shared/schema.js";
import dotenv from "dotenv";

dotenv.config();

export default app.http("ValidateEmailVerificationCode", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log(
      `ValidateEmailVerificationCode function processed a request...`,
    );

    try {
      const { userId, code } = await request.json();

      if (!userId || !code) {
        return {
          status: 400,
          body: JSON.stringify({
            verified: false,
            message: "User ID and verification code are required.",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        };
      }

      const result = await db.query.emailVerificationTable.findFirst({
        where: eq(schema.emailVerificationTable.userId, userId),
      });

      if (!result) {
        return {
          status: 404,
          body: JSON.stringify({
            verified: false,
            message: "No verification code found for this email.",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        };
      }

      if (result.code === code) {
        await db.query.emailVerificationTable.findFirst({
          where: eq(schema.emailVerificationTable.userId, userId),
        });

        context.log("Deleting email verification code from the database...");
        await db.delete.emailVerificationTable({
          where: eq(schema.emailVerificationTable.userId, userId),
        });

        context.log(`Email verified for user ID: ${userId}`);
        return {
          status: 200,
          body: JSON.stringify({
            verified: true,
            message: "Email verified successfully.",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        };
      } else {
        context.log(`Invalid verification code for user ID: ${userId}`);
        return {
          status: 400,
          body: JSON.stringify({
            verified: false,
            message: "Invalid verification code.",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        };
      }
    } catch (e) {
      context.log(e);
      return {
        status: 500,
        body: JSON.stringify({
          verified: false,
          message: "An error occurred while processing your request.",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }
  },
});
