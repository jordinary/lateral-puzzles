import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  if (!email || !password) {
    console.error("Usage: tsx scripts/check-login.ts <email> <password>");
    process.exit(1);
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    console.log("NO_USER_OR_NO_PASSWORD_HASH");
  } else {
    const ok = await bcrypt.compare(password, user.passwordHash);
    console.log(ok ? "OK" : "BAD_PASSWORD");
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});


