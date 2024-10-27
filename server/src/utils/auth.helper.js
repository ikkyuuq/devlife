import bcrypt from "bcryptjs";
import AuthService from "../services/auth.service.js";
import AuthController from "../controllers/auth.controller.js";
import { db } from "../shared/db.js";
import { lucia } from "../shared/auth.js";

export const authService = new AuthService(db, lucia);
export const authController = new AuthController(authService);

export const verifyPassword = async (password, passwordData) => {
  const validPassword = await bcrypt.compare(
    password,
    passwordData.hashedPassword,
  );
  return validPassword;
};
