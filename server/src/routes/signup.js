import express from "express";
import cookieParser from "cookie-parser";
import { db } from "../configs/db.js";
import { lucia } from "../configs/auth.js";

import AuthController from "../controllers/auth.controller.js";
import AuthService from "../services/auth.service.js";

export const signupRouter = express.Router();
signupRouter.use(express.json());
signupRouter.use(cookieParser());

const authService = new AuthService(db, lucia);
const authController = new AuthController(authService);

/**
 * @openapi
 * /signup:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Is signup available?
 *     description: if user is already signed in, client will recieve a 400 status code and cannot proceed with signup form.
 *     responses:
 *       400:
 *         description: already signed in
 *       200:
 *         description: No active session. Client can proceed with signup
 *       500:
 *         description: An error occurred during session validation
 */
signupRouter.get("/signup", async (req, res) =>
  authController.isSignUpAvailable(req, res),
);

/**
 * @openapi
 * /signup:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Signup with new session
 *     description: Signup with new session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@email.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       302:
 *         description: Successful signup
 *       401:
 *         description: Invalid email or password
 */
signupRouter.post("/signup", async (req, res) =>
  authController.signUp(req, res),
);
