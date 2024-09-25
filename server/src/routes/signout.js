import express from "express";

export const signoutRouter = express.Router();

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
signoutRouter.post("/signout", (_, res) => {
  // if no user is signed in, send status 401
  res.send("You are signed out");
  // remove user session
  // send status 200 and redirect to "/" if user is signed in
});
