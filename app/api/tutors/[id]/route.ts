import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/tutors/[id] - Get a single tutor by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both sync and async params
    const params = await Promise.resolve(context.params);
    const tutorId = params.id;
    
    console.log("Fetching tutor with ID:", tutorId);

    const tutor = await prisma.tutor.findUnique({
      where: { id: tutorId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
          },
        },
        courses: {
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        reviewsReceived: {
          where: {
            status: "accepted",
          },
          select: {
            rating: true,
          },
        },
        bookings: {
          where: {
            status: "completed",
          },
          select: {
            learnerId: true,
          },
        },
      },
    });

    if (!tutor) {
      return NextResponse.json(
        { error: "Tutor not found" },
        { status: 404 }
      );
    }

    // Calculate average rating
    const ratings = tutor.reviewsReceived.map((r: any) => r.rating);
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
        : 0;

    // Count unique students
    const uniqueStudents = new Set(tutor.bookings.map((b: any) => b.learnerId));

    // Format tutor data
    const tutorData = {
      id: tutor.id,
      name: tutor.user.name,
      email: tutor.user.email,
      bio: tutor.bio,
      avatar: tutor.user.profileImageUrl || "/placeholder.svg",
      hourlyRate: tutor.hourlyRate || 25,
      rating: parseFloat(avgRating.toFixed(1)),
      totalReviews: tutor.reviewsReceived.length,
      studentsCount: uniqueStudents.size,
      specialties: tutor.specialties && tutor.specialties.length > 0 
        ? tutor.specialties 
        : tutor.courses.map((c: any) => c.category?.name || c.title).filter(Boolean),
      availability: tutor.availability || "Flexible - All days",
      sessionDuration: tutor.sessionDuration || "1 hour",
      language: tutor.language || "English",
      timezone: tutor.timezone || "UTC-08:00 Pacific Time",
      responseTime: "Within 24 hours", // Default value
    };

    // Format courses/skills
    const skills = tutor.courses.map((course: any) => ({
      id: course.id,
      tutorId: tutor.id,
      title: course.title,
      description: course.shortDescription,
      category: course.category?.name || "Other",
      level: course.difficulty,
      price: course.fullCourseRate,
      rating: avgRating > 0 ? parseFloat(avgRating.toFixed(1)) : 0,
      reviews: tutor.reviewsReceived.length,
      image: course.imageUrl || "/placeholder.svg",
    }));

    return NextResponse.json({
      success: true,
      data: {
        tutor: tutorData,
        skills,
      },
    });
  } catch (error) {
    console.error("Error fetching tutor:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { 
        error: "Failed to fetch tutor",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}