import type { Product } from "@/types/product";
import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema<Product>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    inStock: { type: Boolean, required: true },
  },
  { timestamps: true, versionKey: false },
);

const ProductModel = mongoose.models.Product || mongoose.model<Product>("Product", ProductSchema);

export default ProductModel;
