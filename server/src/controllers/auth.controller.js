import {
  hashPassword,
  sendEmailVerificationCode,
} from "../utils/auth.helper.js";
import { generateIdFromEntropySize } from "lucia";
import { env } from "node:process";

export default class AuthController {
  #authService;
  constructor(authService) {
    this.#authService = authService;
  }

  async cliSignIn(req, res) {
    const { email, password } = req.body;
    const user = await this.#authService.validateEmail(email);
    if (!user) {
      console.log("Invalid email");
      return res.status(401).send({ error: "Invalid email" });
    }
    const isValidPassword = await this.#authService.validatePassword(
      email,
      password,
    );
    if (!isValidPassword) {
      return res.status(401).send({ error: "Invalid password" });
    }
    const token = await this.#authService.generateApiToken(user.id);
    return res.status(200).send({ token });
  }

  // This method is used to request an email verification code
  // Using with method POST /email-verification-request
  async emailVerificationRequest(req, res) {
    // Validate the current session with the session cookie
    const { user } = await this.#authService.validateSession(
      req.cookies.devlife_session,
    );
    console.log(user);

    // If the user does not exist, return 401
    if (!user) {
      return res.status(401).send({ error: "Invalid session" });
    }

    const userData = await this.#authService.getUser(user.id);
    if (!userData) {
      return res.status(401).send({ error: "User not found" });
    }
    console.log(userData.email);

    // Generate a new email verification code
    const verificationCode =
      await this.#authService.generateEmailVerificationCode(user.id);
    console.log(verificationCode);

    // Send the email verification code to the user email
    const mailsender = await sendEmailVerificationCode(
      userData.email,
      verificationCode,
    );

    if (!mailsender) {
      return res.status(500).send({ error: "Email not sent" });
    }

    return res.status(200).send({ message: "Email verification code sent" });
  }

  // This method is used to verify the email with the code
  async emailVerification(req, res) {
    // Validate the current session with the session cookie
    const { session, user } = await this.#authService.validateSession(
      req.cookies.devlife_session,
    );

    // If the session or user does not exist, return 401
    if (!session || !user) {
      return res.status(401).send({ error: "Invalid session" });
    }

    // Validate the email verification code and update verified status in Database with the user id and code
    // Using with Azure Function ValidateEmailVerificationCode
    const resp = await fetch(
      `${env.AZURE_FUNCTIONS_URL}ValidateEmailVerificationCode`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: req.body.userId,
          code: req.body.code,
        }),
      },
    );

    const data = await resp.json();

    // If the response status is not 200, return the error message
    if (resp.status !== 200) {
      return res.status(resp.status).send({ error: data.message });
    }

    // Create a new session with existing user
    const sessionCookie = this.#authService.createSessionCookie(session.id);

    return res
      .status(200)
      .cookie("devlife_session", sessionCookie.value, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      })
      .send({ message: data.message });
  }

  async isSignInAvailable(req, res) {
    try {
      const { session } = await this.#authService.validateSession(
        req.cookies.devlife_session,
      );

      return res.status(200).json({
        isAvailable: !session,
        message: session
          ? "You are already signed in"
          : "No active session. Please proceed with signin.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "An error occurred during session validation",
      });
    }
  }

  async isSignOutAvailable(req, res) {
    try {
      const { session } = await this.#authService.validateSession(
        req.cookies.devlife_session,
      );

      return res.status(200).json({
        isAvailable: !!session,
        message: session
          ? "You can sign out"
          : "No active session. You are not signed in.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "An error occurred during session validation",
      });
    }
  }

  async signIn(req, res) {
    // Get email and password from the request body
    const email = req.body.email;
    const password = req.body.password;

    // Validate the email
    const isValidEmail = await this.#authService.validateEmail(email);
    if (!isValidEmail) {
      return res.status(401).send({ error: "Invalid Email" });
    }

    // Validate the password
    const isValidPassword = await this.#authService.validatePassword(
      email,
      password,
    );
    if (!isValidPassword) {
      return res.status(401).send({ error: "Invalid Password" });
    }

    // Get the user and session from the database
    const { user, session } = await this.#authService.getUserSession(email);

    // If the user does not exist, return 401
    if (!user) return res.status(401).send({ error: "User not found" });

    // If the user does not have a session, create a new session and set it to the cookie.
    if (!session) {
      const newSession = await this.#authService.createSession(user.id, {});
      const sessionCookie = this.#authService.createSessionCookie(
        newSession.id,
      );
      return res
        .status(200)
        .cookie("devlife_session", sessionCookie.value, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          path: "/",
        })
        .send({ message: "Successful signin" });
    }

    // If the use already has a session, use the existing session to set to the cookie.
    const sessionCookie = this.#authService.createSessionCookie(session.id);
    return res
      .status(302)
      .cookie("devlife_session", sessionCookie.value, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      })
      .send({ message: "Successful signin" });
  }

  async signOut(req, res) {
    if (!req.cookies.devlife_session) {
      return res.status(401).send({ error: "No active session" });
    }
    await this.#authService.deleteSession(req.cookies.session);
    // Clear the session cookie
    return res
      .status(200)
      .clearCookie("devlife_session")
      .send({ message: "Successful signout" });
  }

  async isSignUpAvailable(req, res) {
    try {
      const { session } = await this.#authService.validateSession(
        req.cookies.devlife_session,
      );

      return res.status(200).json({
        isAvailable: !session,
        message: session
          ? "You are already signed in"
          : "No active session. Please proceed with signup.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "An error occurred during session validation",
      });
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
      // Check if the user already exists, and delete the unverified user if exists
      await this.#authService.deleteUnverifiedUser(email);
      // Create a new user
      await this.#authService.createUser(userId, email, passwordHash);

      // Create a new session
      // `createSession` will return a session object like { id: "session-id", data: {} }
      const session = await this.#authService.createSession(userId, {});

      // `createSessoinCookie` will return a cookie object like { name: "session", value: "session-id; HttpOnly; SameSite=Strict" }
      const sessionCookie = this.#authService.createSessionCookie(session.id);

      // generate verification code and send to user email
      const verificationCode =
        await this.#authService.generateEmailVerificationCode(userId);
      await sendEmailVerificationCode(email, verificationCode);

      return res
        .status(302)
        .cookie("devlife_session", sessionCookie.value, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          path: "/",
        })
        .send({ message: "Successful signup" });
    } catch (error) {
      console.error(error);
      // TODO: Improve error handling for each specific case in error instance of error
      // ECONNREFUSED - database connection error
      return res.status(500).json({ error: "An error occurred during signup" });
    }
  }
}
