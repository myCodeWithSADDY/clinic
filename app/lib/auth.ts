import { SignJWT, jwtVerify } from "jose";
import { Role } from "@prisma/client";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export type JWTPayload = {
  userId: string;
  role: Role;
  email: string;
};

export async function signToken(payload: JWTPayload) {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret);

  return payload;
}