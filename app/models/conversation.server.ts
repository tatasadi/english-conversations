import { User, Conversation, Sentence } from "@prisma/client";

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
          type: true,
          text: true,
        },
        orderBy: {
          createdAt: "asc",
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

export function createConversation({
  level,
  course,
  lesson,
  userId,
}: Pick<Conversation, "level" | "course" | "lesson"> & {
  userId: User["id"];
}) {
  return prisma.conversation.create({
    data: {
      level,
      course,
      lesson,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function createSentence({
  type,
  text,
  conversationId,
}: Pick<Sentence, "type" | "text"> & {
  conversationId: Conversation["id"];
}) {
  return prisma.sentence.create({
    data: {
      type,
      text,
      conversation: {
        connect: {
          id: conversationId,
        },
      },
    },
  });
}

export function deleteSentence({
  id,
  conversationId,
}: Pick<Sentence, "id"> & { conversationId: Conversation["id"] }) {
  return prisma.sentence.deleteMany({
    where: { id, conversationId },
  });
}
