/*
  Warnings:

  - You are about to drop the column `availability` on the `Product` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `MidTailor` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `managerSalary` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rightTailor` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toptTailor` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workerSalary` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fieldOfWork` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MANAGER', 'WORKER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'SPECIAL');

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_companyId_fkey";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "availability",
ADD COLUMN     "MidTailor" INTEGER NOT NULL,
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "deadline" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "managerSalary" INTEGER NOT NULL,
ADD COLUMN     "rightTailor" INTEGER NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "toptTailor" INTEGER NOT NULL,
ADD COLUMN     "workerSalary" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fieldOfWork" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
