/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,name,deletedAt]` on the table `files` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('PENDING', 'UPLOADED', 'READY');

-- DropIndex
DROP INDEX "files_ownerId_name_key";

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "status" "FileStatus" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "files_ownerId_name_deletedAt_key" ON "files"("ownerId", "name", "deletedAt");
