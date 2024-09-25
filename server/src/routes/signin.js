import express from "express";

export const signinRouter = express.Router();

/**
 * @openapi
 * /signin:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Signin with existing session
 *     description: Signin with existing session
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
signinRouter.post("/signin", async (req, res) => {
  res.send("Signin with new session");
});
