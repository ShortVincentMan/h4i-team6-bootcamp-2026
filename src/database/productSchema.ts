import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  inStock: { type: Boolean, required: true },
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
