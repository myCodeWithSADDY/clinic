import { NextRequest, NextResponse } from "next/server";

import { PatientService } from "@/app/services/patient.service";
import { requireAuth } from "@/app/lib/require-auth";
import { handleApiError } from "@/app/lib/api-error";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const search = req.nextUrl.searchParams.get("search")?.trim() ?? "";

    if (search.length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const patients = await PatientService.quickSearch(search);

    return NextResponse.json({
      success: true,
      data: patients,
    });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
