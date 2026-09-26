import { mockProducts } from "@/data/products";
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(mockProducts);
}
