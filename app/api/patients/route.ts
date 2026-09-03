import { NextRequest, NextResponse } from "next/server";

import { PatientService } from "@/app/services/patient.service";
import { createPatientSchema } from "@/app/validations/patient.schema";
import { requireAuth } from "@/app/lib/require-auth";
import { handleApiError } from "@/app/lib/api-error";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const searchParams = req.nextUrl.searchParams;

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const search = searchParams.get("search") ?? undefined;

    const result = await PatientService.findAll({
      page,
      limit,
      search,
    });

    return NextResponse.json(
      {
        success: true,
        ...result,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);

    const body = await req.json();

    const data = createPatientSchema.parse(body);

    const patient = await PatientService.create(data);

    return NextResponse.json(
      {
        success: true,
        data: patient,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
