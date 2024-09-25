import express from "express";
import cookieParser from "cookie-parser";
import { db } from "../configs/db.js";
import { lucia } from "../configs/auth.js";

import AuthController from "../controllers/auth.controller.js";
import AuthService from "../services/auth.service.js";

export const signinRouter = express.Router();
signinRouter.use(express.json());
signinRouter.use(cookieParser());

const authService = new AuthService(db, lucia);
const authController = new AuthController(authService);

/**
 * @openapi
 * /signin:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Is signin available?
 *     description: if user is already signed in, client will recieve a 400 status code and cannot proceed with signin form.
 *     responses:
 *       200:
 *         description: Redirect to /
 *       401:
 *         description: Unauthorized
 */
signinRouter.get("/signin", async (_, res) => {
  res.send("Signin with existing session");
  // send status 200 and redirect to "/" if user is already signed in
});

/**
 * @openapi
 * /signin:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Signin with new session
 *     description: Signin with new session
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
 *       200:
 *         description: Successful signin
 *       401:
 *         description: Unauthorized
 */
signinRouter.post("/signin", async (req, res) =>
  authController.signIn(req, res),
);
