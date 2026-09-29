import { mockProducts } from "@/data/products";
import type { Product } from "@/types/product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Milestone 1 uses an in-memory copy of the mock data behind the API.
// Replace this store with ProductModel queries when MongoDB is ready.
const products: Product[] = [...mockProducts];

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") return false;

  const product = value as Record<string, unknown>;

  return (
    Number.isInteger(product.id) &&
    (product.id as number) > 0 &&
    typeof product.name === "string" &&
    product.name.trim().length > 0 &&
    typeof product.description === "string" &&
    product.description.trim().length > 0 &&
    typeof product.price === "number" &&
    Number.isFinite(product.price) &&
    product.price >= 0 &&
    typeof product.category === "string" &&
    product.category.trim().length > 0 &&
    typeof product.imageUrl === "string" &&
    product.imageUrl.trim().length > 0 &&
    typeof product.inStock === "boolean"
  );
}

export async function GET() {
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isProduct(body)) {
      return NextResponse.json({ error: "Request body is not a valid product." }, { status: 400 });
    }

    if (products.some((product) => product.id === body.id)) {
      return NextResponse.json({ error: "A product with that ID already exists." }, { status: 409 });
    }

    products.push(body);
    return NextResponse.json(body, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }

    console.error("Unable to create product", error);
    return NextResponse.json({ error: "Unable to create product." }, { status: 500 });
  }
}
