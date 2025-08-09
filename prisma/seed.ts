import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function hashAnswer(answer: string): Promise<string> {
  return bcrypt.hash(answer.trim().toLowerCase(), 10);
}

async function main() {
  // Ensure an admin user exists
  const adminEmail = "admin@example.com";
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: adminPassword, role: "ADMIN" },
    create: { email: adminEmail, name: "Admin", passwordHash: adminPassword, role: "ADMIN" },
  });

  // Seed a few lateral-thinking style puzzles
  const levels = [
    {
      number: 1,
      title: "The Missing Dollar",
      prompt:
        "Three people pay $30 for a room. The clerk realizes the room is $25 and gives $5 to the bellhop to return. The bellhop keeps $2 and gives $1 back to each person. People say: 9 + 9 + 9 = 27, and 27 + 2 = 29, so $1 is missing. What single keyword best describes the trick being used here? Enter exactly one word.",
      hint: "They’re adding unlike quantities (apples + oranges). The answer is the name of this rhetorical trick.",
      answers: ["there is none", "no missing dollar", "misdirection"],
    },
    {
      number: 2,
      title: "Light Switches",
      prompt:
        "You are outside a closed room with three light switches. Inside are three bulbs. You can flip the switches as you like, but may enter the room only once. How can you determine which switch corresponds to which bulb? Provide the one-word key.",
      hint: "Use time/heat.",
      answers: ["heat", "warm"],
    },
    {
      number: 3,
      title: "Weighing Coins",
      prompt:
        "You have 12 coins, one is counterfeit and weighs differently. Using a balance scale only three times, determine the odd coin and whether it is heavier or lighter. The password is the minimum number of weighings.",
      hint: "Classic puzzle.",
      answers: ["3", "three"],
    },
  ];

  for (const lvl of levels) {
    const level = await prisma.level.upsert({
      where: { number: lvl.number },
      update: {
        title: lvl.title,
        prompt: lvl.prompt,
        hint: lvl.hint,
      },
      create: {
        number: lvl.number,
        title: lvl.title,
        prompt: lvl.prompt,
        hint: lvl.hint,
      },
    });
    // Replace answers set
    await prisma.levelAnswer.deleteMany({ where: { levelId: level.id } });
    for (const ans of lvl.answers) {
      await prisma.levelAnswer.create({
        data: { levelId: level.id, answerHash: await hashAnswer(ans) },
      });
    }
  }

  console.log("Seeded levels.");
}

main().finally(async () => {
  await prisma.$disconnect();
});


