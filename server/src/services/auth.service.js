import * as schema from "../models/schema.js";
import { eq } from "drizzle-orm";
import { verifyPassword } from "../helpers/auth.helper.js";

export default class AuthService {
  #db;
  #lucia;
  constructor(db, lucia) {
    this.#db = db;
    this.#lucia = lucia;
  }

  async getUserSession(email) {
    const user = await this.#db.query.userTable.findFirst({
      where: eq(schema.userTable.email, email),
    });
    if (!user) {
      return { user: null, session: null };
    }
    const session = await this.#db.query.sessionTable.findFirst({
      where: eq(schema.sessionTable.userId, user.id),
    });

    return { user, session };
  }

  async validateEmail(email) {
    const user = await this.#db.query.userTable.findFirst({
      where: eq(schema.userTable.email, email),
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async validatePassword(email, password) {
    const user = await this.validateEmail(email);
    const passwordData = await this.#db.query.passwordTable.findFirst({
      where: eq(schema.passwordTable.userId, user.id),
    });
    if (!passwordData) {
      return false;
    }
    const validPassword = verifyPassword(password, passwordData);

    if (!validPassword) {
      return false;
    }
    return true;
  }

  async deleteSession(sessionId) {
    await this.#lucia.invalidateSession(sessionId);
  }

  async createUser(userId, email, passwordHash) {
    // Insert data into database
    await this.#db.insert(schema.userTable).values({
      id: userId,
      email,
      verify: false,
    });
    await this.#db.insert(schema.passwordTable).values({
      hashedPassword: passwordHash,
      userId,
    });
  }

  async validateSession(session) {
    return await this.#lucia.validateSession(session);
  }

  async createSession(userId, data) {
    return await this.#lucia.createSession(userId, data);
  }

  createSessionCookie(sessionId) {
    return this.#lucia.createSessionCookie(sessionId);
  }
}
