import { app } from "@azure/functions";
import { GenerateApiToken } from "./GenerateApiToken.js";
import { ValidateEmailAndPassword } from "./ValidateEmailAndPassword.js";

app.http("CLISignin", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const { email, password } = await request.json();
      if (!email || !password) {
        return { status: 400, body: { error: "Missing required fields" } };
      }

      context.log("Validating email and password for user:", email);
      const userResp = await ValidateEmailAndPassword(email, password, context);

      const userData = JSON.parse(userResp.body);

      if (userResp.status !== 200) {
        context.error("Error in CLISignin:", userData.error);
        return {
          status: 401,
          body: JSON.stringify({ error: userData.error }),
        };
      }

      context.log("Generating token for user:", userData.user.id);
      const generateTokenResult = await GenerateApiToken(
        userData.user.id,
        context,
      );
      context.log("Generate token result:", generateTokenResult);

      const tokenData = await JSON.parse(generateTokenResult.body);

      if (generateTokenResult.status !== 200) {
        context.error("Error in CLISignin:", tokenData.error);
        return {
          status: 500,
          body: JSON.stringify({ error: tokenData.error }),
        };
      }

      context.log("Returning token:", tokenData.token);
      return {
        status: 200,
        body: JSON.stringify({ token: tokenData.token }),
      };
    } catch (error) {
      context.error("Error in CLISignin:", error);
      return {
        status: 500,
        body: JSON.stringify({ error: "Internal server error" }),
      };
    }
  },
});
