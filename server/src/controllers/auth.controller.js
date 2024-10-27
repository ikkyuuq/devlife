import { generateIdFromEntropySize } from "lucia";
import { env } from "node:process";

export default class AuthController {
  #authService;
  constructor(authService) {
    this.#authService = authService;
  }

  async emailVerificationRequest(req, res) {
    // Validate the current session with the session cookie
    const { user } = await this.#authService.validateSession(
      req.cookies.devlife_session,
    );

    // If the user does not exist, return 401
    if (!user) {
      return res.status(401).send({ error: "Invalid session" });
    }

    const userData = await this.#authService.getUser(user.id);
    if (!userData) {
      return res.status(401).send({ error: "User not found" });
    }

    // Generate a new email verification code
    const verificationCode = await fetch(
      `${env.AZURE_FUNCTIONS_URL}generateverificationcode`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      },
    );

    const dataCode = await verificationCode.json();

    // Send the email verification code to the user email
    const respMailSender = await fetch(
      `${env.AZURE_FUNCTIONS_URL}sendemailverificationcode`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          code: dataCode.code,
        }),
      },
    );

    const dataMail = await respMailSender.json();

    if (!dataMail.status) {
      return res
        .status(respMailSender.status)
        .send({ error: dataMail.message });
    }
    return res
      .status(respMailSender.status)
      .send({ message: dataMail.message });
  }

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
      `${env.AZURE_FUNCTIONS_URL}validateemailverificationcode`,
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
    if (!resp.ok) {
      return res.status(resp.status).send({ error: data.message });
    }

    // Create a new session with existing user
    const sessionCookie = this.#authService.createSessionCookie(session.id);

    return res
      .status(resp.status)
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

  async signUp(req, res) {
    // Get email and password from the request body
    const email = req.body.email;
    const password = req.body.password;

    // Check if email and password are provided
    if (!email || !password)
      return res.status(401).send("Invalid email or password");

    // Generating new userId
    const userId = generateIdFromEntropySize(10);

    try {
      // Check if the user already exists, and delete the unverified user if exists

      const existingUser = await this.#authService.validateEmail(email);

      if (existingUser) {
        await fetch(`${env.AZURE_FUNCTIONS_URL}DeleteUnverifiedUser`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        });
      }

      // Create a new user
      await fetch(`${env.AZURE_FUNCTIONS_URL}CreateUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          email,
          password,
        }),
      });

      // Create a new session
      // `createSession` will return a session object like { id: "session-id", data: {} }
      const session = await this.#authService.createSession(userId, {});

      // `createSessoinCookie` will return a cookie object like { name: "session", value: "session-id; HttpOnly; SameSite=Strict" }
      const sessionCookie = this.#authService.createSessionCookie(session.id);

      // generate verification code and send to user email
      const respCode = await fetch(
        `${env.AZURE_FUNCTIONS_URL}GenerateVerificationCode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
          }),
        },
      );

      const dataCode = await respCode.json();

      if (!respCode.ok) {
        return res.status(respCode.status).send({ error: dataCode.error });
      }

      await fetch(`${env.AZURE_FUNCTIONS_URL}SendEmailVerificationCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: dataCode.code,
        }),
      });

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
      console.log(error);
      return res.status(500).json({ error: "An error occurred during signup" });
    }
  }
}
