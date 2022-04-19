/*
  Warnings:

  - Added the required column `slug` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "slug" TEXT NOT NULL;
