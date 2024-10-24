import { app } from "@azure/functions";
import db from "../shared/db.js";
import { eq } from "drizzle-orm";
import * as schema from "../shared/schema.js";

app.http("DeleteUnverifiedUser", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const { email } = await request.json();
      context.log("Received email for deletion:", email);

      if (!email) {
        context.error("Email is required");
        return {
          status: 400,
          body: JSON.stringify({ error: "Email is required" }),
        };
      }

      const user = await db.query.userTable.findFirst({
        where: eq(schema.userTable.email, email),
      });

      if (!user) {
        context.error("User not found");
        return {
          status: 404,
          body: JSON.stringify({ error: "User not found" }),
        };
      }

      if (user.verify) {
        context.error("User is already verified");
        return {
          status: 400,
          body: JSON.stringify({ error: "User is already verified" }),
        };
      }

      await db.transaction(async (trx) => {
        context.log("Deleting unverified user...");
        await Promise.all([
          trx
            .delete(schema.emailVerificationTable)
            .where(eq(schema.emailVerificationTable.userId, user.id)),
          trx
            .delete(schema.passwordTable)
            .where(eq(schema.passwordTable.userId, user.id)),
          trx
            .delete(schema.sessionTable)
            .where(eq(schema.sessionTable.userId, user.id)),
        ]);

        await trx
          .delete(schema.userTable)
          .where(eq(schema.userTable.id, user.id));
      });

      context.log("Unverified user deleted successfully");
      return {
        status: 200,
        body: JSON.stringify({
          message: "Unverified user deleted successfully",
        }),
      };
    } catch (error) {
      context.error("Error in DeleteUnverifiedUser:", error);
      return {
        status: 500,
        body: JSON.stringify({ error: "Internal server error" }),
      };
    }
  },
});
