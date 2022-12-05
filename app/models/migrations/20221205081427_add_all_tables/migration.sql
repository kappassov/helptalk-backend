/*
  Warnings:

  - Added the required column `keyword` to the `Keyword` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `socialmedia_account` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `socialmedia_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Keyword" ADD COLUMN     "keyword" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "socialmedia_account" TEXT NOT NULL,
ADD COLUMN     "socialmedia_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "SocialMedia" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SocialMedia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_socialmedia_id_fkey" FOREIGN KEY ("socialmedia_id") REFERENCES "SocialMedia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
