import { hash, verify } from "@node-rs/argon2";

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
