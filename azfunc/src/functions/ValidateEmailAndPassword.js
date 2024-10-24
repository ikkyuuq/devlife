import { app } from "@azure/functions";
import db from "../shared/db.js";
import * as schema from "../shared/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const ValidateEmailAndPassword = async (email, password, context) => {
  context.log("ValidateEmailAndPassword function processing a request.");
  try {
    context.log("Received email and password for validation.");

    if (!email || !password) {
      context.warn("No email or password provided in the request.");
      return {
        status: 400,
        body: JSON.stringify({ error: "Email and password are required" }),
      };
    }

    context.log("Querying database for the provided email.");
    const user = await db.query.userTable.findFirst({
      where: eq(schema.userTable.email, email),
    });

    if (!user) {
      context.warn("Invalid email: no matching email found in the database.");
      return {
        status: 401,
        body: JSON.stringify({ error: "Invalid email" }),
      };
    }

    context.log("Email found. Checking password.");
    const passwordData = await db.query.passwordTable.findFirst({
      where: eq(schema.passwordTable.userId, user.id),
    });

    if (!passwordData) {
      context.error("Password not found for this email.");
      return {
        status: 401,
        body: JSON.stringify({
          error: "Please configure password in devlife or try with OAUTH",
        }),
      };
    }

    const isValidPassword = await bcrypt.compare(
      password,
      passwordData.hashedPassword,
    );

    if (!isValidPassword) {
      context.warn("Invalid password: password does not match the email.");
      return {
        status: 401,
        body: JSON.stringify({ error: "Invalid password" }),
      };
    }

    context.log("Email and password are valid. Returning user data.");
    return { status: 200, body: JSON.stringify({ user }) };
  } catch (error) {
    context.error(
      "An error occurred during email and password validation:",
      error,
    );
    return {
      status: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

app.http("ValidateEmailAndPassword", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: ValidateEmailAndPassword,
});
