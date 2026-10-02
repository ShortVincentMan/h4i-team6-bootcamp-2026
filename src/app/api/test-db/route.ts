import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ status: "Connected successfully to MongoDB Atlas" });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ error: "Failed to connect to database" }, { status: 500 });
  }
}
