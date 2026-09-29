import { NextResponse } from "next/server";

/**
 * Example GET API route
 * @returns {message: string}
 */
export async function GET() {
  return NextResponse.json({ message: "Hello from the API!" });
}
