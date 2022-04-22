export const computeIngredientPrice = (quantity: number, price: number): number => parseFloat((quantity * price).toFixed(2));
