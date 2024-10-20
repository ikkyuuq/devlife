import express from "express";
import cookieParser from "cookie-parser";
import { authController } from "../utils/auth.helper.js";

export const signoutRouter = express.Router();
signoutRouter.use(express.json());
signoutRouter.use(cookieParser());

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
