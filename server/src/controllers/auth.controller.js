import { hashPassword } from "../helpers/auth.helper.js";
import { generateIdFromEntropySize } from "lucia";

export default class AuthController {
  #authService;
  constructor(authService) {
    this.#authService = authService;
  }

  async isSignUpAvailable(req, res) {
    try {
      // Validate the current session with the session cookie
      // if the session is valid, return 400 that means the user is already signed in
      // else return 200 that means the user can proceed with signup
      const session = await this.#authService.validateSession(
        req.cookies.session,
      );

      if (session) {
        return res.status(400).send({ message: "You are already signed in" });
      } else {
        return res
          .status(200)
          .send({ message: "No active session. Please proceed with signup." });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: "An error occurred during session validation" });
    }
  }

  async signUp(req, res) {
    // Get email and password from the request body
    const email = req.body.email;
    const password = req.body.password;

    // Check if email and password are provided
    if (!email || !password)
      return res.status(401).send("Invalid email or password");

    // Hashing the password incomming from the request
    const passwordHash = await hashPassword(password);

    // Generating new userId
    const userId = generateIdFromEntropySize(10);

    try {
      await this.#authService.createUser(userId, email, passwordHash);
      // Create a new session
      // `createSession` will return a session object like { id: "session-id", data: {} }
      const session = await this.#authService.createSession(userId, {});

      // `createSessoinCookie` will return a cookie object like { name: "session", value: "session-id; HttpOnly; SameSite=Strict" }
      const sessionCookie = this.#authService.createSessionCookie(session.id);

      // Return a response with the session cookie
      return res
        .status(200)
        .cookie("session", sessionCookie.value, {
          htppOnly: true,
          sameSite: "lax",
        })
        .json({ message: "Successful signup" });
    } catch (error) {
      console.error(error);
      // TODO: Improve error handling for each specific case in error instance of error
      // ECONNREFUSED - database connection error
      return res.status(500).json({ error: "An error occurred during signup" });
    }
  }
}
