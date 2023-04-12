import { User, Conversation } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Conversation } from "@prisma/client";

export function getConversation({ id }: Pick<Conversation, "id">) {
  return prisma.conversation.findUnique({
    where: { id },
    select: {
      id: true,
      level: true,
      course: true,
      lesson: true,
      sentences: {
        select: {
          id: true,
          order: true,
          type: true,
          text: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });
}

export function getConversationListItems({ userId }: { userId: User["id"] }) {
  return prisma.conversation.findMany({
    where: { userId },
    select: { id: true, level: true, course: true, lesson: true },
    orderBy: { createdAt: "desc" },
  });
}

export function deleteConversation({
  id,
  userId,
}: Pick<Conversation, "id"> & { userId: User["id"] }) {
  return prisma.conversation.deleteMany({
    where: { id, userId },
  });
}
