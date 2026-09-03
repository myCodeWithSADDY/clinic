// app/api/prescription/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrescriptionService } from "@/app/services/prescription.service";
import { requireAuth } from "@/app/lib/require-auth";
import { handleApiError } from "@/app/lib/api-error";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const search = searchParams.get("search") ?? undefined;

    const result = await PrescriptionService.findAll({ page, limit, search });
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    
    return handleApiError(error)
  }
}
