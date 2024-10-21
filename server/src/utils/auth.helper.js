import { hash, verify } from "@node-rs/argon2";
import { db } from "../shared/db.js";
import { lucia } from "../shared/auth.js";

import AuthController from "../controllers/auth.controller.js";
import AuthService from "../services/auth.service.js";

export const authService = new AuthService(db, lucia);
export const authController = new AuthController(authService);

export const hashPassword = async (password) => {
  const hashedPassword = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  return hashedPassword;
};

export const verifyPassword = (password, passwordData) => {
  const validPassword = verify(passwordData.hashedPassword, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  return validPassword;
};
