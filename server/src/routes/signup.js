import express from "express";

export const signupRouter = express.Router();

/**
 * @openapi
 * /signup:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Signin with existing session
 *     description: Signin with existing session
 *     responses:
 *       200:
 *         description: Redirect to /
 */
signupRouter.get("/signup", async (_, res) => {
  res.send("Signup route with existing session");
  // send status 200 and redirect to "/" if user is already signed in
});

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
 *       200:
 *         description: Successful signup
 *       401:
 *         description: Invalid email or password
 */
signupRouter.post("/signup", async (req, res) => {
  res.send("Signup route");
});
