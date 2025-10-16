import { authenticator } from "otplib";
import qrcode from "qrcode";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Generate secret and QR code URL (otpauth:// for apps like Google Authenticator)
const setup2FA = async (email) => {
  const secret = authenticator.generateSecret(); // Base32 secret
  const otpauthUrl = authenticator.keyuri(email, "Itinerary", secret); // For QR

  let qrCodeDataUrl = "";
  try {
    qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl); // Data URL for frontend img src
  } catch (err) {
    throw new Error("QR code generation failed");
  }

  // Save secret to DB (temp until verified)
  await User.updateOne({ email }, { twoFactorSecret: secret });

  return { secret, otpauthUrl, qrCodeDataUrl };
};

// Verify TOTP code
const verifyTOTP = (secret, token) => {
  return authenticator.verify({ token, secret }); // Returns true/false, handles time drift
};

// Generate JWT (as before)
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      twoFactorConfirmed: user.twoFactorConfirmed,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

export { setup2FA, verifyTOTP, generateToken };
