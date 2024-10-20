import * as schema from "../shared/models/schema.js";
import { eq } from "drizzle-orm";
import { verifyPassword } from "../utils/auth.helper.js";
import { generateRandomString, alphabet } from "oslo/crypto";
import { createDate, isWithinExpirationDate, TimeSpan } from "oslo";

export default class AuthService {
  #db;
  #lucia;
  constructor(db, lucia) {
    this.#db = db;
    this.#lucia = lucia;
  }

  async validateApiToken(token) {
    const apiToken = await this.#db.query.tokenTable.findFirst({
      where: eq(schema.tokenTable.token, token),
    });
    if (!apiToken) return null;

    return await this.#db.query.userTable.findFirst({
      where: eq(schema.userTable.id, apiToken.userId),
    });
  }
  async generateApiToken(userId) {
    const token = generateRandomString(64, alphabet("a-zA-Z0-9"));
    const existingToken = await this.#db.query.tokenTable.findFirst({
      where: eq(schema.tokenTable.userId, userId),
    });

    if (existingToken) {
      await this.#db
        .update(schema.tokenTable)
        .set({ token })
        .where(eq(schema.tokenTable.userId, userId));
      return token;
    }

    await this.#db.insert(schema.tokenTable).values({
      token,
      userId,
    });
    return token;
  }

  async deleteUnverifiedUser(email) {
    const user = await this.#db.query.userTable.findFirst({
      where: eq(schema.userTable.email, email),
    });

    if (!user || user.verify) {
      return;
    }

    await this.#db.transaction(async (trx) => {
      await Promise.all([
        trx
          .delete(schema.emailVerificationTable)
          .where(eq(schema.emailVerificationTable.userId, user.id)),
        trx
          .delete(schema.passwordTable)
          .where(eq(schema.passwordTable.userId, user.id)),
        trx
          .delete(schema.sessionTable)
          .where(eq(schema.sessionTable.userId, user.id)),
      ]);

      await trx
        .delete(schema.userTable)
        .where(eq(schema.userTable.id, user.id));
    });
  }

  async validateEmailVerificationCode(user, code) {
    const emailVerification =
      await this.#db.query.emailVerificationTable.findFirst({
        where: eq(schema.emailVerificationTable.userId, user.id),
      });

    if (!emailVerification || emailVerification.code !== code) {
      return false;
    }

    await this.#db
      .delete(schema.emailVerificationTable)
      .where(eq(schema.emailVerificationTable.userId, user.id));

    if (!isWithinExpirationDate(emailVerification.expiresAt)) {
      return false;
    }

    return true;
  }

  async updateUserVerify(userId) {
    await this.#lucia.invalidateUserSessions(userId);
    await this.#db
      .update(schema.userTable)
      .set({ verify: true })
      .where(eq(schema.userTable.id, userId));
  }

  async generateEmailVerificationCode(userId) {
    await this.#db
      .delete(schema.emailVerificationTable)
      .where(eq(schema.emailVerificationTable.userId, userId));

    const code = generateRandomString(8, alphabet("0-9"));
    await this.#db.insert(schema.emailVerificationTable).values({
      userId,
      code,
      expiresAt: createDate(new TimeSpan(15, "m")),
    });
    return code;
  }

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
    const validPassword = await verifyPassword(password, passwordData);

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
