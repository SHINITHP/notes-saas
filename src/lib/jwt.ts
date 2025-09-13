import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

export interface JWTPayload {
  userId: string;
  tenantId: string;
  role: "ADMIN" | "MEMBER";
}

const defaultOptions: SignOptions = {
  expiresIn: "1h",
};

export function signToken(payload: JWTPayload, options: SignOptions = {}) {
  return jwt.sign(payload, JWT_SECRET as string, {
    ...defaultOptions,
    ...options,
  });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET as string) as JWTPayload;
}
