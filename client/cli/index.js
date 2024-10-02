import { Command } from "commander";
import fs from "fs";
import inquirer from "inquirer";

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

app.name("devlife").description("CLI tools for devlife");

app
  .command("auth")
  .description("Authenticate with devlife")
  .option("-x, --signout", "Sign out of devlife")
  .option("-e, --email <email>", "Authenticate with email and password")
  .option("-o, --oauth <email>", "Authenticate with GitHub OAuth")
  .action(async (options) => {
    if (options.signout) {
      const homeDir = process.env.HOME || process.env.USERPROFILE;
      const devlifeDir = `${homeDir}/.devlife`;
      const configPath = `${devlifeDir}/config.json`;
      // Replace the file with an empry object
      fs.writeFileSync(configPath, JSON.stringify({}, null, 2));
      console.log("Signed out of devlife");
      return;
    }
    if (options.email) {
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
        const resp = await fetch("http://localhost:3000/cli-signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${devlife.token ?? ""}`,
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });
        return resp;
      }
      const resp = await emailAuth();
      if (resp.status === 401) {
        resp.json().then((data) => {
          console.log(data.error);
        });
        return;
      }
      const data = await resp.json();
      const homeDir = process.env.HOME || process.env.USERPROFILE;
      const devlifeDir = `${homeDir}/.devlife`;
      const configPath = `${devlifeDir}/config.json`;
      // Create the directory if it doesn't exist
      fs.mkdirSync(devlifeDir, { recursive: true });
      // Write the token to the config file
      fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
      console.log("Authenticated with devlife!");
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
  .option("-f, --filter <filter>", "Filter tasks by status (done, todo)")
  .option("-t, --tags <tags...>", "Filter items by type")
  .action(async (options) => {
    const resp = await listAllTasks();
    if (resp.status === 401) {
      console.log("Please authenticate with `devlife auth`");
      return;
    }
    const data = await resp.json();
    console.log(data);
  });

app.command("submit").action(() => {
  console.log("submit");
});

app.parse(process.argv);
