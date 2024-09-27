import express from "express";
import cookieParser from "cookie-parser";
import { db } from "../configs/db.js";
import { lucia } from "../configs/auth.js";

import AuthController from "../controllers/auth.controller.js";
import AuthService from "../services/auth.service.js";

export const emailVerificationRouter = express.Router();
emailVerificationRouter.use(express.json());
emailVerificationRouter.use(cookieParser());

const authService = new AuthService(db, lucia);
const authController = new AuthController(authService);

/**
 * @openapi
 * /email-verification-request:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Request an email verification code
 *     description: Request an email verification code
 *     responses:
 *       200:
 *         description: Email verification code sent
 *       401:
 *         description: Invalid session
 */
emailVerificationRouter.get("/email-verification-request", async (req, res) => {
  await authController.emailVerificationRequest(req, res);
});

/**
 * @openapi
 * /email-verification:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify email with code
 *     description: Verify email with code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "1a2b3c"
 *     responses:
 *       200:
 *         description: Email verified
 *       401:
 *         description: Invalid verification code
 */
emailVerificationRouter.post("/email-verification", async (req, res) => {
  await authController.emailVerification(req, res);
});
