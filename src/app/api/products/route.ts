import { NextResponse } from 'next/server';
import connectDB from '@/database/db';
import Product from '@/database/productSchema';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({});
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const { name, description, price, category, imageUrl, inStock } = body;

    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      !imageUrl ||
      inStock === undefined
    ) {
      return NextResponse.json(
        { error: 'Missing required product fields' },
        { status: 400 }
      );
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      imageUrl,
      inStock,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}