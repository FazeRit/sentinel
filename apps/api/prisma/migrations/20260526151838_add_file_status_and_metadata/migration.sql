-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'READY', 'FAILED');

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "pageCount" INTEGER,
ADD COLUMN     "pdf_author" TEXT,
ADD COLUMN     "pdf_title" TEXT,
ADD COLUMN     "status" "FileStatus" NOT NULL DEFAULT 'UPLOADED';
