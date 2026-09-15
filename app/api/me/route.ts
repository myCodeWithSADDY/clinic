// app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/app/lib/require-auth";

export async function GET(req: NextRequest) {
  try {
    const payload = await requireAuth(req);
    return NextResponse.json({
      userId: payload.sub ?? payload.userId,
      email: payload.email,
      role: payload.role,
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
