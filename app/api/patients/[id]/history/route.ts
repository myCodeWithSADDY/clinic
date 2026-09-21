import { NextRequest, NextResponse } from "next/server";

import { PatientService } from "@/app/services/patient.service";
import { requireAuth } from "@/app/lib/require-auth";
import { handleApiError } from "@/app/lib/api-error";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await requireAuth(req);

    const { id } = await params;

    const patient = await PatientService.findWithHistory(id);

    return NextResponse.json(
      {
        success: true,
        data: patient,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
