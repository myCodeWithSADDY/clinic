import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { LoginInput } from "@/app/validations/auth.schema";
import { signToken } from "@/app/lib/auth";

export class AuthService {
  static async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
   if(!user) {
      throw new Error("INVALID_CREDENTIALS");
    }


    const passwordMatches = await bcrypt.compare(data.password, user.password);

    if (!passwordMatches) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,

      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  }
}
