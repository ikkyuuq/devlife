import express from "express";
import { db } from "../shared/db.js";
import * as schema from "../shared/models/schema.js";
import { eq } from "drizzle-orm";
import { lucia } from "../shared/auth.js";
import AuthService from "../services/auth.service.js";

const authService = new AuthService(db, lucia);

export const userRouter = express.Router();
userRouter.use(express.json());

/**
 * @openapi
 * /user:
 *   get:
 *     tags:
 *       - User
 *     summary: Get current user information
 *     description: Retrieves the profile information of the currently authenticated user
 *     responses:
 *       200:
 *         description: Successfully retrieved user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The user's unique identifier
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: The user's email address
 *                     username:
 *                       type: string
 *                       description: The user's username
 *       401:
 *         description: Unauthorized - Invalid or missing session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 */
userRouter.get("/user", async (req, res) => {
  const { session } = await authService.validateSession(
    req.cookies.devlife_session,
  );

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isValidSession = await db.query.sessionTable.findFirst({
    where: eq(schema.sessionTable.id, session.id),
  });

  if (!isValidSession) {
    return res.status(401).json({ message: "Invalid Session" });
  }

  const user = await db.query.userTable.findFirst({
    where: eq(schema.userTable.id, isValidSession.userId),
  });

  if (!user) {
    return res.status(401).json({ message: "User Not Found" });
  }

  return res.status(200).json({ user });
});
