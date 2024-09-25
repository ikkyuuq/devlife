import express from "express";
import cookieParser from "cookie-parser";
import { db } from "../configs/db.js";
import { lucia } from "../configs/auth.js";

import AuthController from "../controllers/auth.controller.js";
import AuthService from "../services/auth.service.js";

export const signoutRouter = express.Router();
signoutRouter.use(express.json());
signoutRouter.use(cookieParser());

const authService = new AuthService(db, lucia);
const authController = new AuthController(authService);

/**
 * @openapi
 * /signout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Signout of session
 *     description: Signout of session
 *   responses:
 *     200:
 *       description: Redirect to /
 *     401:
 *       desscription: No session to sign out of
 */
signoutRouter.post("/signout", (req, res) => authController.signOut(req, res));
