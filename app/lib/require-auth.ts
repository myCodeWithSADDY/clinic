import { NextRequest } from "next/server";
import { verifyToken, JWTPayload } from "@/app/lib/auth";
import { cookies } from "next/headers";

export async function requireAuth(req?: NextRequest): Promise<JWTPayload> {

   const cookieStore = await cookies();

   const token = req
     ? req.cookies.get("token")?.value
     : cookieStore.get("token")?.value;
  

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  try {
    const payload = await verifyToken(token);

    return payload as JWTPayload;
  } catch {
    throw new Error("UNAUTHORIZED");
  }
}
