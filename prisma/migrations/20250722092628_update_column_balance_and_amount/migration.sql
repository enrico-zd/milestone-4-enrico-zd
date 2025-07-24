/*
  Warnings:

  - You are about to alter the column `balance` on the `account` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(15,2)`.
  - You are about to alter the column `amount` on the `transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(15,2)`.

*/
-- AlterTable
ALTER TABLE "account" ALTER COLUMN "balance" SET DATA TYPE DECIMAL(15,2);

-- AlterTable
ALTER TABLE "transaction" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(15,2);
