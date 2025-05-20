import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Configure Brevo API
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY; // Use your Brevo API key


// Function to send verification email
export const sendVerificationEmail = async (email, verificationLink) => {
  try {
    console.log("Sending email to:", email);

     // Create an instance of the TransactionalEmailsApi
    const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();
   
    // Send the email
   const emailData = {
      sender: { email: process.env.BREVO_EMAIL, name: "HitMeUp" }, // Sender email and name
      to: [{ email }], // Recipient email
      subject: "Verify Your Email",
      htmlContent: `
        <h1>Welcome to HitMeUp!</h1>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
      `,
    };

    const response = await transactionalEmailsApi.sendTransacEmail(emailData);
    console.log("Verification email sent successfully:", response);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email.");
  }
};

// Function to send other types of emails (optional)
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `"No-Reply" <${process.env.BREVO_EMAIL}>`,
      to,
      subject,
      html: htmlContent,
    });
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email.");
  }
};