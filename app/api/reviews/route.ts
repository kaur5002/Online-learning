import { NextRequest, NextResponse } from "next/server";
import { mockReviews } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

// GET: Fetch reviews (accepts filters for tutorId, courseId, studentId)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tutorId = searchParams.get("tutorId");
    const courseId = searchParams.get("courseId");
    const studentId = searchParams.get("studentId");

    // Build the where clause
    const where: any = {};

    // If studentId or tutorId is provided, fetch all reviews (not just accepted)
    // This allows students and tutors to see their own reviews with all statuses
    if (studentId) {
      where.reviewerId = studentId;
    } else if (tutorId) {
      const tutor = await prisma.tutor.findUnique({
        where: { userId: tutorId },
      });
      if (tutor) {
        where.tutorId = tutor.id;
      }
    } else {
      // Only fetch accepted reviews for public display
      where.status = "accepted";
    }

    if (courseId) {
      where.courseId = courseId;
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        tutor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    // Fallback to mock data if database fails
    return NextResponse.json({ success: true, data: mockReviews });
  }
}

// POST: Submit a new review (students)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, reviewerId, tutorId, courseId, rating, comment } = body;

    if (!bookingId || !reviewerId || !tutorId || !courseId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the tutor's internal ID
    const tutor = await prisma.tutor.findUnique({
      where: { userId: tutorId },
    });

    if (!tutor) {
      return NextResponse.json(
        { error: "Tutor not found" },
        { status: 404 }
      );
    }

    const review = await prisma.review.create({
      data: {
        bookingId,
        reviewerId,
        tutorId: tutor.id,
        courseId,
        rating,
        comment: comment || null,
        status: "pending", // All reviews start as pending
      },
    });

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully!",
      data: review,
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}

