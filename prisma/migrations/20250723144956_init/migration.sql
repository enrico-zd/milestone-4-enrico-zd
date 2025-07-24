/*
  Warnings:

  - You are about to drop the column `type` on the `account` table. All the data in the column will be lost.
  - Added the required column `account_type` to the `account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "account" DROP COLUMN "type",
ADD COLUMN     "account_type" "AccountType" NOT NULL;
