import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST: Submit a review in response to a review request
export async function POST(request: NextRequest) {
  let reviewRequestId: string | undefined;
  
  try {
    const body = await request.json();
    const { reviewRequestId: reqId, rating, comment } = body;
    reviewRequestId = reqId;

    console.log("=== Review Submission Request ===");
    console.log("Full body:", JSON.stringify(body, null, 2));
    console.log("reviewRequestId:", reviewRequestId, "Type:", typeof reviewRequestId);
    console.log("rating:", rating, "Type:", typeof rating);
    console.log("comment:", comment);

    if (!reviewRequestId) {
      console.error("Missing reviewRequestId");
      return NextResponse.json(
        { error: "Review request ID is required", details: "reviewRequestId field is missing" },
        { status: 400 }
      );
    }

    if (!rating) {
      console.error("Missing rating");
      return NextResponse.json(
        { error: "Rating is required", details: "rating field is missing or zero" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      console.error("Invalid rating value:", rating);
      return NextResponse.json(
        { error: "Rating must be between 1 and 5", details: `Received rating: ${rating}` },
        { status: 400 }
      );
    }

    // Get the review request
    const reviewRequest = await prisma.reviewRequest.findUnique({
      where: { id: reviewRequestId },
    });

    console.log("Review request found:", reviewRequest ? "Yes" : "No");
    if (reviewRequest) {
      console.log("Review request details:", {
        id: reviewRequest.id,
        status: reviewRequest.status,
        tutorId: reviewRequest.tutorId,
        courseId: reviewRequest.courseId,
        studentId: reviewRequest.studentId,
      });
    }

    if (!reviewRequest) {
      console.error("Review request not found for ID:", reviewRequestId);
      return NextResponse.json(
        { error: "Review request not found", details: `No review request found with ID: ${reviewRequestId}` },
        { status: 404 }
      );
    }

    if (reviewRequest.status !== "pending") {
      console.error("Review request already responded to. Status:", reviewRequest.status);
      return NextResponse.json(
        { error: "This review request has already been responded to", details: `Current status: ${reviewRequest.status}` },
        { status: 400 }
      );
    }

    // Check if a review already exists for this student and course
    // Note: Reviews require a bookingId, but since we're creating from a review request,
    // we need to find an enrollment or booking
    
    console.log("=== Checking student eligibility ===");
    console.log("Student ID:", reviewRequest.studentId);
    console.log("Course ID:", reviewRequest.courseId);
    console.log("Tutor ID:", reviewRequest.tutorId);
    
    // First, check if there's a booking for this student and course
    let booking = await prisma.booking.findFirst({
      where: {
        learnerId: reviewRequest.studentId,
        tutorId: reviewRequest.tutorId,
        courseId: reviewRequest.courseId,
      },
      orderBy: {
        sessionDate: "desc",
      },
    });

    console.log("Booking found:", booking ? "Yes" : "No");
    if (booking) {
      console.log("Booking details:", {
        id: booking.id,
        sessionDate: booking.sessionDate,
        status: booking.status,
        sessionType: booking.sessionType,
      });
    }

    // Check if the booking exists and if the session date has passed
    if (booking) {
      const sessionDate = new Date(booking.sessionDate);
      const now = new Date();
      
      console.log("Session date:", sessionDate);
      console.log("Current date:", now);
      console.log("Session in future?", sessionDate > now);
      
      if (sessionDate > now) {
        console.error("Session date is in the future - review not allowed");
        return NextResponse.json(
          { error: "You cannot submit a review before attending the session. Please wait until after your scheduled session on " + sessionDate.toLocaleDateString() + "." },
          { status: 403 }
        );
      }
    }

    // Check for enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: reviewRequest.studentId,
        courseId: reviewRequest.courseId,
      },
    });

    console.log("Enrollment found:", enrollment ? "Yes" : "No");
    if (enrollment) {
      console.log("Enrollment details:", {
        id: enrollment.id,
        enrolledAt: enrollment.enrolledAt,
        progress: enrollment.progress,
      });
    }

    // If no enrollment and no booking, user hasn't purchased the course
    if (!enrollment && !booking) {
      console.error("No enrollment or booking found - review not allowed");
      return NextResponse.json(
        { error: "You must be enrolled in this course or have booked a session to leave a review." },
        { status: 403 }
      );
    }

    console.log("=== Student is eligible to review ===");

    // If no booking exists, create one for the review (for enrolled students)
    if (!booking) {
      console.log("Creating booking for enrolled student to attach review");
      booking = await prisma.booking.create({
        data: {
          learnerId: reviewRequest.studentId,
          tutorId: reviewRequest.tutorId,
          courseId: reviewRequest.courseId,
          sessionDate: new Date(), // Current date as the session date
          durationMin: 60, // Default 1 hour duration
          status: "completed", // Mark as completed since we're reviewing
        },
      });
      console.log("Booking created:", booking.id);
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        bookingId: booking.id,
        reviewerId: reviewRequest.studentId,
        tutorId: reviewRequest.tutorId,
        courseId: reviewRequest.courseId,
        rating,
        comment: comment || null,
        status: "pending", // Reviews start as pending for tutor approval
      },
    });

    // Update the review request status
    await prisma.reviewRequest.update({
      where: { id: reviewRequestId },
      data: {
        status: "responded",
        respondedAt: new Date(),
      },
    });

    console.log("Review submitted successfully:", review.id);

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully!",
      data: review,
    });
  } catch (error: any) {
    console.error("Error submitting review:", error);
    
    // Handle unique constraint violation (if booking already has a review)
    if (error.code === "P2002") {
      // Mark the review request as responded even though it failed
      if (reviewRequestId) {
        try {
          await prisma.reviewRequest.update({
            where: { id: reviewRequestId },
            data: {
              status: "responded",
              respondedAt: new Date(),
            },
          });
        } catch (updateError) {
          console.error("Failed to update review request status:", updateError);
        }
      }
      
      return NextResponse.json(
        { error: "You have already submitted a review for this course. Thank you for your feedback!" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "Failed to submit review",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
