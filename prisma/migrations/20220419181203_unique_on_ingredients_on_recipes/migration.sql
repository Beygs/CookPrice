/*
  Warnings:

  - A unique constraint covering the columns `[ingredientId,recipeId]` on the table `IngredientsOnRecipes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "IngredientsOnRecipes_ingredientId_recipeId_key" ON "IngredientsOnRecipes"("ingredientId", "recipeId");
