#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import inquirer from "inquirer";
import { spawn } from "node:child_process";
import tasuku from "tasuku";
import { performance } from "perf_hooks";
import { Logger, Spinner } from "@node-cli/logger";

const logger = new Logger();
const spinner = new Spinner();

const app = new Command();

const devlife = fs.existsSync(
  `${process.env.HOME || process.env.USERPROFILE}/.devlife/config.json`,
)
  ? JSON.parse(
      fs.readFileSync(
        `${process.env.HOME || process.env.USERPROFILE}/.devlife/config.json`,
      ),
    )
  : {};

app
  .command("auth")
  .description("Authenticate with devlife")
  .option("-x, --signout", "Sign out of devlife")
  .option("-e, --email <email>", "Authenticate with email and password")
  .option("-o, --oauth <email>", "Authenticate with GitHub OAuth")
  .action(async (options) => {
    if (options.signout) {
      if (!devlife.token) {
        spinner.start();
        spinner.text = "";
        spinner.stop("Already signed out", Spinner.SUCCESS);
        return;
      }

      const homeDir = process.env.HOME || process.env.USERPROFILE;
      const devlifeDir = `${homeDir}/.devlife`;
      const configPath = `${devlifeDir}/config.json`;

      // Replace the file with an empry object
      try {
        fs.writeFileSync(configPath, JSON.stringify({}, null, 2));
        spinner.start();
        spinner.text = "Signing out of devlife...";
        spinner.stop("Signed out of devlife");
        return;
      } catch (e) {
        spinner.stop("Error signing out of devlife", Spinner.ERROR);
        return;
      }
    }

    if (options.email) {
      if (devlife.token) {
        spinner.start();
        spinner.text = "";
        spinner.stop("Already signed in", Spinner.SUCCESS);
        return;
      }

      const email = options.email;
      const { password } = await inquirer.prompt([
        {
          type: "password",
          name: "password",
          message: "Enter your password:",
          mask: "*",
        },
      ]);

      async function emailAuth() {
        const resp = await fetch(
          `https://apis.prasompongapi.app/api/CLISignin`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          },
        );

        return resp;
      }

      spinner.start();
      spinner.text = "Signing in...";

      const resp = await emailAuth();
      const data = await resp.json();

      if (!resp.ok) {
        spinner.stop(`${data.error}`, Spinner.ERROR);
        return;
      }

      const homeDir = process.env.HOME || process.env.USERPROFILE;
      const devlifeDir = `${homeDir}/.devlife`;
      const configPath = `${devlifeDir}/config.json`;

      // Create the directory if it doesn't exist
      fs.mkdirSync(devlifeDir, { recursive: true });
      // Write the token to the config file
      fs.writeFileSync(configPath, JSON.stringify(data, null, 2));

      spinner.stop("Signed in to devlife", Spinner.SUCCESS);
    } else if (options.oauth) {
      const email = options.oauth;
      async function githubAuth() {
        const res = await fetch("http://localhost:3000/cli-oauth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${devlife.token}`,
          },
          body: JSON.stringify({
            email,
          }),
        });
        const data = await res.json();
        console.log(data);
        return data;
      }
      await githubAuth();
    } else {
      console.log("Please provide an email for authentication, or use OAuth");
    }
  });

async function listAllTasks() {
  const resp = await fetch("http://localhost:3000/task", {
    headers: {
      Authorization: `Bearer ${devlife.token}`,
    },
  });
  return resp;
}

app
  .command("list")
  .alias("ls")
  .description("List tasks from devlife")
  // TODO: implement fetch tasks by status (todo, done)
  .option("-f, --filter <filter>", "Filter tasks by status (done, todo)")
  .option("-t, --tags <tags...>", "Filter items by type")
  .action(async (options) => {
    const resp = await listAllTasks();
    if (resp.status === 401) {
      logger.error("Please authenticate with `devlife auth`");
      return;
    }
    const data = await resp.json();
    const cliTask = await data.tasks.map((task) => {
      return {
        id: task.id,
        title: task.title,
        objective: task.objective,
      };
    });

    // TODO: limit the number of tasks to display
    logger.printBox(
      [
        cliTask
          .map((task) => {
            const id = `\x1b[1m\x1b[33m[${task.id}]\x1b[0m `;
            const title = `\x1b[1m${task.title}\x1b[0m`;
            const objective = `\x1b[2m${task.objective}\x1b[0m`;
            return `${id}\n${title}\n${objective}`;
          })
          .join("\n\n"),
      ],
      {
        align: "left",
        newLineBefore: false,
        newLineAfter: false,
      },
    );
  });

// Retry logic to handle multiple-line input failure and attempt single-line
const runTestWithRetry = async (file, input, setTitle) => {
  // First, try with multiple-line input
  await new Promise((resolve) => setTimeout(resolve, 600));

  let result = await testRunner(file, input);

  if (result.error || result.code !== 0) {
    // Prepare single-line input
    const singleLineInput = input.map(String).join(" ");

    // Retry with single-line input
    result = await testRunner(file, [singleLineInput]);
  }

  return result;
};

const testRunner = async (file, input) => {
  return new Promise((resolve, reject) => {
    let output = "";
    let error = "";
    let startTime, endTime;
    switch (true) {
      case file.endsWith(".py"):
        startTime = performance.now();
        const child = spawn("python", [file]);
        child.stdout.on("data", (data) => {
          output += data.toString();
        });

        child.stderr.on("data", (data) => {
          error += data.toString();
        });

        child.on("close", (code) => {
          endTime = performance.now();
          const timeTaken = endTime - startTime;
          resolve({
            output: output.trim(),
            error: error.trim(),
            code,
            timeTaken,
          });
        });

        try {
          input.map((n) => {
            child.stdin.write(`${n}\n`);
          });
        } catch (e) {
          throw new Error(e);
        }

        child.stdin.end();
        break;
      default:
        reject(new Error(`Unsupported file type: ${file}`));
    }
  });
};

const runTask = async (taskid, file) => {
  const resp = await fetch(`http://localhost:3000/cli/task/${taskid}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${devlife.token}`,
    },
  });
  if (resp.status === 401) {
    logger.error("Please authenticate with `devlife auth`");
    return;
  }
  const data = await resp.json();
  const tests = data.task.tests;
  const tests_json = JSON.parse(tests);
  const testCount = tests_json.data.length;
  let testPassed = 0;

  logger.info(`Running ${testCount} tests...`);

  let allTestsPassed = true;
  for (let index = 0; index < tests_json.data.length; index++) {
    const test = tests_json.data[index];
    await tasuku(
      `Test ${index + 1}`,
      async ({ setTitle, setError, setOutput, setStatus }) => {
        try {
          const { output, error, timeTaken } = await runTestWithRetry(
            file,
            test.input,
          );
          if (error) {
            throw new Error(error);
          }

          if (test.expected === output) {
            testPassed++;
            setStatus(`⚡${timeTaken.toFixed(2)} ms`);
            setTitle(`Test ${index + 1}`);
          } else {
            allTestsPassed = false;
            setError(`Test ${index + 1}`);
            setStatus(`💥${timeTaken.toFixed(2)} ms`);
            setOutput(
              `${test.input.length > 0 ? `Inputs: ${test.input}\n` : ""}Expected: ${test.expected}\nActual: ${output}`,
            );
          }
        } catch (error) {
          allTestsPassed = false;
          setError(`Test ${index + 1} Error`);
          setOutput(error.message);
        }
      },
    );
  }

  if (!allTestsPassed) {
    logger.error(`Only ${testPassed} tests passed`);
    logger.error(`Submitted task with failed status`);
    await fetch("http://localhost:3000/cli/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${devlife.token}`,
      },
      body: JSON.stringify({
        taskId: taskid,
        status: "failed",
      }),
    });
    return;
  }

  logger.info(`All ${testCount} tests passed`);
  const respSubmitted = await fetch("http://localhost:3000/cli/task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${devlife.token}`,
    },
    body: JSON.stringify({
      taskId: taskid,
      status: "done",
    }),
  });

  if (respSubmitted.status === 401) {
    logger.error("Cannot submit task. Please authenticate with `devlife auth`");
    return;
  }
  const dataSubmitted = await respSubmitted.json();
  logger.info("Task submitted successfully");
  return dataSubmitted;
};

app
  .command("submit")
  .arguments("<taskid>")
  .arguments("<solution>")
  .action(async (taskid, solution) => {
    const isFile = fs.existsSync(solution);
    if (!isFile) {
      logger.error("Please provide a valid file path");
      return;
    }
    await runTask(taskid, solution);
  });

app.name("devlife").description("CLI tools for devlife").version("0.0.1");

app.parse(process.argv);
