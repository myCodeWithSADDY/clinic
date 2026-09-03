import { NextRequest, NextResponse } from "next/server";

import { PatientService } from "@/app/services/patient.service";
import { updatePatientSchema } from "@/app/validations/patient.schema";
import { requireAuth } from "@/app/lib/require-auth";
import { handleApiError } from "@/app/lib/api-error";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await requireAuth(req);

    const { id } = await params;

    const patient = await PatientService.findOne(id);

    return NextResponse.json(patient, { status: 200 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireAuth(req);

    const { id } = await params;

    const body = await req.json();

    const data = updatePatientSchema.parse(body);

    const patient = await PatientService.update(id, data);

    return NextResponse.json(patient, { status: 200 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await requireAuth(req);

    const { id } = await params;

    await PatientService.remove(id);

    return NextResponse.json({ message: "Patient deleted" }, { status: 200 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
