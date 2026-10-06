export interface Product {
  id?: number | string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
}
