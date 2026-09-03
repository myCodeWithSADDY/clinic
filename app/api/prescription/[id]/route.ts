




import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/app/lib/require-auth";
import { handleApiError } from "@/app/lib/api-error";
import { PrescriptionService } from "@/app/services/prescription.service";
import { updatePrescriptionSchema } from "@/app/validations/prescription.schema";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await requireAuth(req);

    const { id } = await params;

    const patient = await PrescriptionService.findOne(id);

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

    const data = updatePrescriptionSchema.parse(body);

    const patient = await PrescriptionService.update(id, data);

    return NextResponse.json(patient, { status: 200 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await requireAuth(req);

    const { id } = await params;

    await PrescriptionService.remove(id);

    return NextResponse.json({ message: "Patient deleted" }, { status: 200 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
