"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthService } from "../services/auth.service";

type LoginState = {
  error?: string;
};
type LoginData = {
  email: string;
  password: string;
};

export async function loginAction(
  previousState: LoginState | null,
  formData: FormData,
): Promise<LoginState | null> {
  const data: LoginData = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  let result;
  try {
    result = await AuthService.login(data);
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return {
        error: "Invalid email or password",
      };
    }

    console.error(error);

    return {
      error: "Something went wrong",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: "token",
    value: result.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/dashboard");
}
