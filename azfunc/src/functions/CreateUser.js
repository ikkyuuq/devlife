import { app } from "@azure/functions";
import db from "../shared/db.js";
import * as schema from "../shared/schema.js";
import bcrypt from "bcryptjs";

app.http("CreateUser", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log("CreateUser function processing a request.");
    try {
      const { id, email, password } = await request.json();
      context.log("Received user data for creation.", { id, email });

      const hashedPassword = await bcrypt.hash(password, 10);
      context.log("Password hashed successfully.");

      if (!id || !email || !hashedPassword) {
        context.warn("Missing required fields in the request.");
        return {
          status: 400,
          body: JSON.stringify({ error: "Missing required fields" }),
        };
      }

      // Insert data into database
      context.log("Inserting user data into the database.");
      await db.insert(schema.userTable).values({
        id,
        email,
        verify: false,
      });
      context.log("User data inserted successfully.");

      await db.insert(schema.passwordTable).values({
        hashedPassword,
        userId: id,
      });
      context.log("Password data inserted successfully.");

      context.log("User created successfully.");
      return {
        status: 201,
        body: JSON.stringify({ message: "User created successfully" }),
      };
    } catch (error) {
      context.error("Error creating user:", error);

      if (error.code === "P2002") {
        return {
          status: 409,
          body: JSON.stringify({ error: "User already exists" }),
        };
      }

      return {
        status: 500,
        body: JSON.stringify({ error: "Internal server error" }),
      };
    }
  },
});
