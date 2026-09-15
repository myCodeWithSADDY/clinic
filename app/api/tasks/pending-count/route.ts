// app/api/tasks/pending-count/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/app/lib/require-auth";
import { TaskService } from "@/app/services/task.service";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const role = req.nextUrl.searchParams.get("role") as Role | null;
    if (!role) {
      return NextResponse.json({ error: "role is required" }, { status: 400 });
    }
    const count = await TaskService.countPendingForRole(role);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
