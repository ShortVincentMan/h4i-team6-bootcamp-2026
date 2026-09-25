import type { Product } from "../types/Product";

export const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Trail Running Shoes",
    description: "Lightweight shoes built for mixed-terrain runs.",
    price: 119.99,
    category: "Footwear",
    imageUrl: "/images/trail-running-shoes.jpg",
    inStock: true,
  },
  {
    id: "prod-2",
    name: "Insulated Water Bottle",
    description: "Keeps drinks cold for up to 24 hours.",
    price: 29.5,
    category: "Accessories",
    imageUrl: "/images/insulated-water-bottle.jpg",
    inStock: true,
  },
  {
    id: "prod-3",
    name: "Packable Rain Jacket",
    description: "Weather-resistant shell with compact storage pouch.",
    price: 89,
    category: "Apparel",
    imageUrl: "/images/packable-rain-jacket.jpg",
    inStock: false,
  },
  {
    id: "prod-4",
    name: "Yoga Mat Pro",
    description: "Extra-grip mat designed for daily training sessions.",
    price: 54.99,
    category: "Fitness",
    imageUrl: "/images/yoga-mat-pro.jpg",
    inStock: true,
  },
  {
    id: "prod-5",
    name: "Commuter Backpack",
    description: "Water-resistant backpack with laptop compartment.",
    price: 74.25,
    category: "Bags",
    imageUrl: "/images/commuter-backpack.jpg",
    inStock: true,
  },
];
