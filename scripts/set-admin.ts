import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@example.com";
  const password = "admin123";
  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({ where: { email }, data: { passwordHash, role: "ADMIN" } });
  } else {
    const admin = await prisma.user.create({
      data: { email, name: "Admin", role: "ADMIN", passwordHash },
    });
    const levelOne = await prisma.level.findUnique({ where: { number: 1 } });
    if (levelOne) {
      await prisma.levelUnlock.upsert({
        where: { userId_levelId: { userId: admin.id, levelId: levelOne.id } },
        update: {},
        create: { userId: admin.id, levelId: levelOne.id },
      });
    }
  }
  console.log(`Admin set: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


