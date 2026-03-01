/** Generate a 6-digit numeric OTP */
export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
