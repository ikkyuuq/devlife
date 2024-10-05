import express from "express";
import { signinRouter } from "./src/routes/signin.js";
import { signupRouter } from "./src/routes/signup.js";
import { signoutRouter } from "./src/routes/signout.js";
import { emailVerificationRouter } from "./src/routes/emailverification.js";
import { taskRouter } from "./src/routes/task.js";
import { taskCliRouter } from "./src/routes/taskCli.js";
import swaggerUI from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

/**
 * @type {import('swagger-jsdoc').Options}
 */
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Devlife API",
      version: "1.0.0",
      description: "A list of all the routes in the Devlife API",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.js", "./*.js"],
};

const openapiSpecification = swaggerJsdoc(options);

const app = express();

app.use("/swagger", swaggerUI.serve, swaggerUI.setup(openapiSpecification));
app.get("/swagger.json", (_, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(openapiSpecification);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(
  signinRouter,
  signupRouter,
  signoutRouter,
  emailVerificationRouter,
  taskRouter,
  taskCliRouter,
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
