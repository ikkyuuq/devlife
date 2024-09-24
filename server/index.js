import express from "express";
import { signinRouter } from "./routes/signin.js";
import { signupRouter } from "./routes/signup.js";
import { signoutRouter } from "./routes/signout.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(signinRouter, signupRouter, signoutRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
