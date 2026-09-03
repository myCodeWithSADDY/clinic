// app/api/appointments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AppointmentService } from "@/app/services/appointment.service";
import { requireAuth } from "@/app/lib/require-auth";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const searchParams = req.nextUrl.searchParams;
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    // Calendar view (range-based, no pagination) -- used by the
    // BasicScheduler on the "new appointment" page.
    if (from && to) {
      const appointments = await AppointmentService.findByRange(
        new Date(from),
        new Date(to),
      );
      return NextResponse.json({ data: appointments }, { status: 200 });
    }

    // List view (paginated) -- used by the Appointments list page.
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const search = searchParams.get("search") ?? undefined;

    const result = await AppointmentService.findAll({ page, limit, search });
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
