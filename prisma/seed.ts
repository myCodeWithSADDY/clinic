// prisma/seed.ts
import 'dotenv/config';
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";


const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
});
const prisma = new PrismaClient({adapter});

async function main() {
  const password = await bcrypt.hash("fahad@123", 12);

  await prisma.user.upsert({
    where: {
      email: "Faddie03@gmail.com",
    },

    update: {
      password,
    },

    create: {
      fullName: "Dr. Fahad Fayyaz",
      email: "Faddie03@gmail.com",
      password,
      role: Role.DOCTOR,
      phone: "923317559660",
    },
  });

  console.log("Doctor user created successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
