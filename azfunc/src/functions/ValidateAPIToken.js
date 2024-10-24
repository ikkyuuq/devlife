import { app } from "@azure/functions";
import db from "../shared/db.js";
import * as schema from "../shared/schema.js";
import { eq } from "drizzle-orm";

app.http("ValidateAPIToken", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log("ValidateAPIToken function processing a request.");
    try {
      const token = await request.json();
      context.log("Received token for validation.");

      if (!token) {
        context.warn("No token provided in the request.");
        return {
          status: 400,
          body: JSON.stringify({ error: "No token provided" }),
        };
      }

      context.log("Querying database for the provided token.");
      const apiToken = await db.query.tokenTable.findFirst({
        where: eq(schema.tokenTable.token, token),
      });

      if (!apiToken) {
        context.log.warn(
          "Invalid token: no matching token found in the database.",
        );
        return {
          status: 401,
          body: JSON.stringify({ error: "Invalid token" }),
        };
      }

      context.log("Token found. Querying for associated user.");
      const user = await db.query.userTable.findFirst({
        where: eq(schema.userTable.id, apiToken.userId),
      });

      if (!user) {
        context.error("Token valid but no associated user found.");
        return {
          status: 500,
          body: JSON.stringify({ error: "User not found" }),
        };
      }

      context.log("User found. Returning user data.");
      return { status: 200, body: JSON.stringify({ user }) };
    } catch (error) {
      context.error("An error occurred during token validation:", error);
      return {
        status: 500,
        body: JSON.stringify({ error: "Internal server error" }),
      };
    }
  },
});
