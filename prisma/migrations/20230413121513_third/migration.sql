/*
  Warnings:

  - You are about to drop the column `order` on the `Sentence` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Sentence` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Sentence" DROP CONSTRAINT "Sentence_conversationId_fkey";

-- AlterTable
ALTER TABLE "Sentence" DROP COLUMN "order",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Sentence" ADD CONSTRAINT "Sentence_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
