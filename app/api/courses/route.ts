import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  createCourseSchema,
  courseQuerySchema,
} from "@/lib/validations/course";
import { verifyAuth } from "@/lib/middleware/auth";

// GET /api/courses - Get all courses with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validationResult = courseQuerySchema.safeParse(queryParams);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { page, limit, search, difficulty, categoryId, tutorId, userId } =
      validationResult.data;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
        { overview: { contains: search, mode: "insensitive" } },
      ];
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (tutorId) {
      where.tutorId = tutorId;
    }

    // If userId is provided, find the corresponding tutor and filter by tutorId
    if (userId) {
      const tutor = await prisma.tutor.findUnique({
        where: { userId: userId },
      });
      if (tutor) {
        where.tutorId = tutor.id;
      } else {
        // If no tutor found for this userId, return empty results
        where.tutorId = "non-existent-id";
      }
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        include: {
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
          category: true,
          _count: {
            select: {
              enrollments: true,
              reviews: true,
              bookings: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.course.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        courses,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create a new course
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { userId, role } = authResult.data!;

    // Only tutors can create courses
    if (role !== "tutor") {
      return NextResponse.json(
        { error: "Only tutors can create courses" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validationResult = createCourseSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    // Get tutor record
    const tutor = await prisma.tutor.findUnique({
      where: { userId },
    });

    if (!tutor) {
      return NextResponse.json(
        { error: "Tutor profile not found" },
        { status: 404 }
      );
    }

    const courseData = validationResult.data;

    // Create course
    const course = await prisma.course.create({
      data: {
        ...courseData,
        tutorId: tutor.id,
        zoomLink: courseData.zoomLink || null,
      },
      include: {
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
        category: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Course created successfully",
        data: course,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
