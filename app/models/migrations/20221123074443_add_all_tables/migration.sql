/*
  Warnings:

  - The `path` column on the `Document` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "path",
ADD COLUMN     "path" TEXT[];
