import { NextRequest, NextResponse } from "next/server";

import { DashboardService } from "@/app/services/dashboard.service";
import { requireAuth } from "@/app/lib/require-auth";
import { handleApiError } from "@/app/lib/api-error";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const stats = await DashboardService.getSummaryStats();

    return NextResponse.json(stats, {
      status: 200,
    });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
