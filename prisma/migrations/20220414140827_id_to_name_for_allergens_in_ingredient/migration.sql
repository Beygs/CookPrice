/*
  Warnings:

  - You are about to drop the column `allergenId` on the `AllergensOnIngredients` table. All the data in the column will be lost.
  - Added the required column `allergenName` to the `AllergensOnIngredients` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AllergensOnIngredients" DROP CONSTRAINT "AllergensOnIngredients_allergenId_fkey";

-- AlterTable
ALTER TABLE "AllergensOnIngredients" DROP COLUMN "allergenId",
ADD COLUMN     "allergenName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AllergensOnIngredients" ADD CONSTRAINT "AllergensOnIngredients_allergenName_fkey" FOREIGN KEY ("allergenName") REFERENCES "Allergen"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
