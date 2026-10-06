import type { Product } from "@/types/product";

export function mergeProducts(existingProducts: Product[], incomingProducts: Product[]) {
  const existingProductKeys = new Set(existingProducts.map(productKey));

  return [...existingProducts, ...incomingProducts.filter((product) => !existingProductKeys.has(productKey(product)))];
}

function productKey(product: Product) {
  return product._id ?? product.id ?? `${product.name}-${product.category}-${product.imageUrl}`;
}
