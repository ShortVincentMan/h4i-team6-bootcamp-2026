import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 500 },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true },
  imageUrl: { type: String, required: true, trim: true },
  inStock: { type: Boolean, required: true },
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
