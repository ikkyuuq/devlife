import * as schema from "../models/schema.js";

export default class AuthService {
  #db;
  #lucia;
  constructor(db, lucia) {
    this.#db = db;
    this.#lucia = lucia;
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
