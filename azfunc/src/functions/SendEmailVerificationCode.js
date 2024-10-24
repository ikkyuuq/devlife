import { app } from "@azure/functions";
import { Recipient, EmailParams, MailerSend } from "mailersend";
import { env } from "node:process";

app.http("SendEmailVerificationCode", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log("SendEmailVerificationCode function processed a request...");

    const { email, code } = await request.json();
    if (!email || !code) {
      return {
        status: 400,
        body: JSON.stringify({
          message: "Email and code are required",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    const mailersend = new MailerSend({
      apiKey: env.MAILERSEND_KEY_PROD,
    });

    const recipient = [new Recipient(email, "Recipient")];

    const emailParams = new EmailParams()
      .setFrom({
        email: env.MAILERSEND_EMAIL_PROD,
        name: "devlife",
      })
      .setTo(recipient)
      .setSubject("Devlife Verification Code")
      .setHtml(
        `<h1>This is your verification code</h1><h1>${code}</h1><p>Please verify in 15 mins after getting this email</p>`,
      )
      .setText(
        `Your verification code is: ${code}. Please verify in 15 mins after getting this email.`,
      );

    try {
      context.log("Sending email...");
      await mailersend.email.send(emailParams);
      context.log("Email sent successfully:");
      return {
        status: 200,
        body: JSON.stringify({
          message: "Email sent successfully",
        }),
      };
    } catch (e) {
      context.log("Error sending email:", e);
      return {
        status: 500,
        body: JSON.stringify({
          message: "Internal Server Error",
          error: e.message,
        }),
      };
    }
  },
});
