import * as schema from "../shared/models/schema.js";
import { db } from "../shared/db.js";
import { eq } from "drizzle-orm";
import { verifyPassword } from "../utils/auth.helper.js";

export default class AuthService {
  #db;
  #lucia;
  constructor(db, lucia) {
    this.#db = db;
    this.#lucia = lucia;
  }

  // #region Session Management
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

  async deleteSession(sessionId) {
    await this.#lucia.invalidateSession(sessionId);
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
  // #endregion

  // #region User Management
  async getUser(userId) {
    const session = await this.#db.query.sessionTable.findFirst({
      where: eq(schema.sessionTable.userId, userId),
    });
    if (!session) {
      return null;
    }

    return await this.#db.query.userTable.findFirst({
      where: eq(schema.userTable.id, userId),
    });
  }

  // #region Email Validation
  async validateEmail(email) {
    const user = await db.query.userTable.findFirst({
      where: eq(schema.userTable.email, email),
    });
    if (!user) {
      return null;
    }
    return user;
  }
  // #endregion

  // #region Password Validation
  async validatePassword(email, password) {
    const user = await this.validateEmail(email);
    const passwordData = await db.query.passwordTable.findFirst({
      where: eq(schema.passwordTable.userId, user.id),
    });
    if (!passwordData) {
      return false;
    }
    const validPassword = await verifyPassword(password, passwordData);

    if (!validPassword) {
      return false;
    }
    return true;
  }
  // #endregion

  // #endregion
}
