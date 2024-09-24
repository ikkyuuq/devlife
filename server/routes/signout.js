import express from "express";

export const signoutRouter = express.Router();

signoutRouter.post("/signout", (_, res) => {
  // if no user is signed in, send status 401
  res.send("You are signed out");
  // remove user session
  // send status 200 and redirect to "/" if user is signed in
});
