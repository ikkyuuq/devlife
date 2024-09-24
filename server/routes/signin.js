import express from "express";

export const signinRouter = express.Router();

signinRouter.get("/signin", async (_, res) => {
  res.send("Signin with existing session");
  // send status 200 and redirect to "/" if user is already signed in
});

signinRouter.post("/signin", async (req, res) => {
  res.send("Signin with new session");
});
