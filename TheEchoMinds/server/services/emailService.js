import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM || "TheEchoMinds <onboarding@resend.dev>";

export async function sendOtpEmail(to, otp) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject: "Your EchoLens verification code",
    html: `
      <h2>Verify your email</h2>
      <p>Your 6-digit verification code is: <strong>${otp}</strong></p>
      <p>This code expires in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function sendPreorderThankYou(to, preorderId) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject: "Thank you for your Preorder",
    html: `
      <h2>Thank you for your Preorder</h2>
      <p>Your preorder has been received.</p>
      <p><strong>Preorder ID:</strong> ${preorderId}</p>
      <p>We will contact you soon regarding next steps.</p>
    `,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function sendOrderConfirmation(to, orderId, paymentId, productDetails) {
  const detailsHtml = typeof productDetails === "string"
    ? productDetails
    : JSON.stringify(productDetails, null, 2);
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject: "Order Confirmed",
    html: `
      <h2>Order Confirmed</h2>
      <p>Thank you for your order!</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Payment ID:</strong> ${paymentId}</p>
      <p><strong>Product details:</strong></p>
      <pre>${detailsHtml}</pre>
    `,
  });
  if (error) throw new Error(error.message);
  return data;
}
