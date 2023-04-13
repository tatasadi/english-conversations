import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "ehsan@tatasadi.com";

  // cleanup the existing database

  await prisma.sentence.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.note.deleteMany();
  await prisma.password.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("remixiscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const conversation = await prisma.conversation.create({
    data: {
      level: "A1",
      course: 2,
      lesson: 14,
      userId: user.id,
    },
  });

  await prisma.sentence.create({
    data: {
      type: "Description",
      text: "Es ist beinah an der Zeit für einen großen Sport-Wettkamp. Ren und Aida versuchen, online Tickets zu bekommen...",
      conversationId: conversation.id,
    },
  });

  await prisma.sentence.create({
    data: {
      type: "PersonA",
      text: "What do you want to see, Aida? Do you like swimming?",
      conversationId: conversation.id,
    },
  });
  await prisma.sentence.create({
    data: {
      type: "PersonB",
      text: "Yes, I love swimming. It's my favorite sport.",
      conversationId: conversation.id,
    },
  });
  await prisma.sentence.create({
    data: {
      type: "PersonA",
      text: "Great, me too!",
      conversationId: conversation.id,
    },
  });
  await prisma.sentence.create({
    data: {
      type: "Description",
      text: "Ren versucht, Tickets für Schwimmen zu bekommen, aber sie sind schon alle weg...",
      conversationId: conversation.id,
    },
  });
  await prisma.sentence.create({
    data: {
      type: "PersonB",
      text: "Oh no! We can't watch swimming. Do you like basketball?",
      conversationId: conversation.id,
    },
  });
  await prisma.sentence.create({
    data: {
      type: "PersonA",
      text: "Umm, no, I don't like basketball.",
      conversationId: conversation.id,
    },
  });
  await prisma.sentence.create({
    data: {
      type: "PersonB",
      text: "Do you like watching tennis?",
      conversationId: conversation.id,
    },
  });
  await prisma.sentence.create({
    data: {
      type: "PersonA",
      text: "Yes, I like watching tennis.",
      conversationId: conversation.id,
    },
  });
  await prisma.sentence.create({
    data: {
      type: "Description",
      text: "Die beiden versuchen, Tickets für Tennis zu reservieren...",
      conversationId: conversation.id,
    },
  });
  await prisma.sentence.create({
    data: {
      type: "PersonB",
      text: "We got the last two tickets!",
      conversationId: conversation.id,
    },
  });
  await prisma.sentence.create({
    data: {
      type: "PersonA",
      text: "Yes, I'm so excited!",
      conversationId: conversation.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
