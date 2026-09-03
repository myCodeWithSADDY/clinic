import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/app/validations/auth.schema";
import { AuthService } from "@/app/services/auth.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: validation.error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    const result = await AuthService.login(validation.data);

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: result.user,
      },
      {
        status: 200,
      },
    );

    response.cookies.set({
      name: "token",
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return NextResponse.json(
        {
          message: "Invalid email or password",
        },
        {
          status: 401,
        },
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}