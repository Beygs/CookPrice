/*
  Warnings:

  - A unique constraint covering the columns `[userId,slug]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,slug]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_userId_slug_key" ON "Ingredient"("userId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_userId_slug_key" ON "Recipe"("userId", "slug");
