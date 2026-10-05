import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import Product from "@/database/productSchema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({});
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  try {
    await connectDB();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Product data must be an object" }, { status: 400 });
    }

    const { name, description, price, category, imageUrl, inStock } = body as Record<string, unknown>;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      name.trim().length > 100 ||
      typeof description !== "string" ||
      !description.trim() ||
      description.trim().length > 500 ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0 ||
      typeof category !== "string" ||
      !category.trim() ||
      typeof imageUrl !== "string" ||
      !isHttpUrl(imageUrl) ||
      typeof inStock !== "boolean"
    ) {
      return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
    }

    const newProduct = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price,
      category: category.trim(),
      imageUrl: imageUrl.trim(),
      inStock,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
