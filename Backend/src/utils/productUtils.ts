export const formatProductPrice = (price: number) => {
  return `£${price.toFixed(2)}`;
};

export const isProductInStock = (inventory: number) => {
  return inventory > 0;
}; 