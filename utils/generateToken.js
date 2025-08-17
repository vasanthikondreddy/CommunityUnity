import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRE } from "../config/constants.js";


export const generateToken = (userId, expiresIn = JWT_EXPIRE) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn });
};


export const generateAccessToken = (userId) => generateToken(userId, "15m");
export const generateRefreshToken = (userId) => generateToken(userId, "7d");
export const generateResetToken = (userId) => generateToken(userId, "1h");
export const generateEmailVerificationToken = (userId) => generateToken(userId, "24h");
export const generateApiToken = (userId) => generateToken(userId, "30d");
