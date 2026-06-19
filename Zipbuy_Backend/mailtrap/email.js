import { mailtrapClient, sender } from "./mailtrapConfig.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./verificationEmailTemplate.js";

export const verificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  try {
    const res = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify Email Address",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      category: "Email Verification",
    });
    console.log("Email Verification Successful", res);
  } catch (error) {
    console.error("Failed To Send Email Verification Code", error);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];
  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Welcome to ZipBuy",
      html: `<h1>Welcome to ZipBuy, ${name}!</h1><p>We are glad to have you.</p>`,
    });
    console.log("Welcome email sent successfully");
  } catch (error) {
    console.error("Failed to send welcome email", error);
  }
};
