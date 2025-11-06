import { NextResponse } from "next/server"
import { mockReviews } from "@/lib/mock-data"

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: mockReviews })
  } catch (error) {
    console.error("Error fetching mock reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}
