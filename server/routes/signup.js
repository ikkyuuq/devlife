import express from "express";

export const signupRouter = express.Router();

signupRouter.get("/signup", async (_, res) => {
  res.send("Signup route with existing session");
  // send status 200 and redirect to "/" if user is already signed in
});

signupRouter.post("/signup", async (req, res) => {
  res.send("Signup route");
});
