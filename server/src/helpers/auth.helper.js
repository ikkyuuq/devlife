import { env } from "node:process";
import { hash, verify } from "@node-rs/argon2";
import { Recipient, EmailParams, MailerSend } from "mailersend";

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

export const sendEmailVerificationCode = async (email, code) => {
  const mailersend = new MailerSend({ apiKey: env.MAILERSEND_KEY });
  const recipient = [new Recipient(email, "Recipient")];

  const emailParams = new EmailParams()
    .setFrom({
      email: env.MAILERSEND_EMAIL,
      name: "devlife",
    })
    .setTo(recipient)
    .setSubject("Devlife Verification Code")
    .setHtml(
      `<h1>This is your verification code</h1><h1>${code}</h1><p>Please verify in 15 mins after getting this email</p>`,
    )
    .setText("Thank from devlife");

  const data = await mailersend.email.send(emailParams);
  return data;
};
