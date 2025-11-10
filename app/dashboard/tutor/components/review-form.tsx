"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  Send,
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  Loader2,
  Mail,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertModal } from "@/components/alert-modal";
import axios from "axios";

interface Student {
  id: string;
  name: string;
  email: string;
}

interface Course {
  id: string;
  title: string;
  enrolledStudents: Student[];
}

interface PendingReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
    email: string;
    profileImageUrl: string | null;
  };
  course: {
    id: string;
    title: string;
  };
}

interface RecentReview {
  id: string;
  rating: number;
  comment: string | null;
  status: string;
  createdAt: string;
  approvedAt: string | null;
  reviewer: {
    id: string;
    name: string;
    email: string;
    profileImageUrl: string | null;
  };
  course: {
    id: string;
    title: string;
  };
}

export default function ReviewForm() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
  const [recentReviews, setRecentReviews] = useState<RecentReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    message: string;
    title?: string;
    type?: "error" | "warning" | "info" | "success";
  }>({
    isOpen: false,
    message: "",
  });

  useEffect(() => {
    fetchCourses();
    fetchPendingReviews();
    fetchRecentReviews();
  }, [user]);

  const fetchCourses = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      // Fetch tutor's courses with enrolled students
      const response = await axios.get(`/api/courses?userId=${user.id}`);
      const coursesData = response.data.data?.courses || response.data.data || [];
      
      console.log("Fetched courses:", coursesData); // Debug log
      
      // Ensure it's an array and map to include enrolled students
      const formattedCourses = Array.isArray(coursesData) 
        ? coursesData.map((course: any) => {
            console.log("Processing course:", course.id, course.title);
            console.log("Enrollments:", course.enrollments);
            
            const enrolledStudents = course.enrollments?.map((enrollment: any) => {
              console.log("Enrollment student data:", enrollment.student);
              return {
                id: enrollment.student?.id || enrollment.studentId,
                name: enrollment.student?.name || 'Unknown Student',
                email: enrollment.student?.email || '',
              };
            }) || [];
            
            console.log("Enrolled students for course:", enrolledStudents);
            
            return {
              id: course.id,
              title: course.title,
              enrolledStudents,
            };
          })
        : [];
      
      console.log("Formatted courses:", formattedCourses); // Debug log
      setCourses(formattedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      // Set empty array on error
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingReviews = async () => {
    try {
      const response = await axios.get(
        `/api/review-requests/pending?tutorId=${user?.id}`
      );
      setPendingReviews(response.data.data || []);
    } catch (error) {
      console.error("Error fetching pending reviews:", error);
      // Set empty array on error to prevent UI issues
      setPendingReviews([]);
    }
  };

  const fetchRecentReviews = async () => {
    try {
      const response = await axios.get(`/api/reviews?tutorId=${user?.id}`);
      // Get all reviews (not just accepted ones) and sort by creation date
      const allReviews = response.data.data || [];
      // Take the 10 most recent reviews
      const recent = allReviews.slice(0, 10);
      setRecentReviews(recent);
    } catch (error) {
      console.error("Error fetching recent reviews:", error);
      setRecentReviews([]);
    }
  };

  const handleSendReviewRequest = async () => {
    if (!selectedCourse || selectedStudents.length === 0) {
      setAlertModal({
        isOpen: true,
        message: "Please select a course and at least one student to send review requests.",
        title: "Selection Required",
        type: "warning",
      });
      return;
    }

    try {
      setSendingRequest(true);
      
      const requestData = {
        tutorId: user?.id,
        courseId: selectedCourse,
        studentIds: selectedStudents,
        message: message || "Please share your feedback about the course!",
      };
      
      console.log("Sending review request:", requestData);
      
      const response = await axios.post("/api/review-requests", requestData);
      
      console.log("Review request response:", response.data);

      const stats = response.data.stats;
      let successMessage = response.data.message;
      
      // Add more details if there were duplicates
      if (stats?.reviewedDuplicates > 0 || stats?.pendingDuplicates > 0) {
        const details = [];
        if (stats.sent > 0) details.push(`✓ ${stats.sent} new request(s) sent`);
        if (stats.pendingDuplicates > 0) details.push(`⏳ ${stats.pendingDuplicates} already have pending requests`);
        if (stats.reviewedDuplicates > 0) details.push(`✓ ${stats.reviewedDuplicates} already submitted reviews`);
        successMessage = details.join('\n');
      }

      setAlertModal({
        isOpen: true,
        message: successMessage,
        title: stats?.sent > 0 ? "Review Requests Sent" : "No New Requests",
        type: stats?.sent > 0 ? "success" : "info",
      });
      
      setSelectedCourse("");
      setSelectedStudents([]);
      setMessage("");
    } catch (error) {
      console.error("Error sending review requests:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);
        console.error("Response headers:", error.response?.headers);
        const errorData = error.response?.data;
        const errorMessage = errorData?.message || errorData?.error || error.message;
        setAlertModal({
          isOpen: true,
          message: `Failed to send review requests: ${errorMessage}`,
          title: "Request Failed",
          type: "error",
        });
      } else {
        setAlertModal({
          isOpen: true,
          message: "Failed to send review requests: Unknown error occurred.",
          title: "Request Failed",
          type: "error",
        });
      }
    } finally {
      setSendingRequest(false);
    }
  };

  const handleReviewAction = async (reviewId: string, action: "accept" | "reject") => {
    try {
      await axios.patch(`/api/review-requests/${reviewId}`, { action });
      setAlertModal({
        isOpen: true,
        message: `Review has been ${action}ed successfully!`,
        title: `Review ${action === "accept" ? "Accepted" : "Rejected"}`,
        type: "success",
      });
      fetchPendingReviews();
    } catch (error) {
      console.error("Error updating review:", error);
      setAlertModal({
        isOpen: true,
        message: "Failed to update review. Please try again.",
        title: "Update Failed",
        type: "error",
      });
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectedCourseData = Array.isArray(courses) 
    ? courses.find((c) => c.id === selectedCourse)
    : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Review Management</h2>
        <p className="text-muted-foreground mt-1">
          Send review surveys and manage student feedback
        </p>
      </div>
{/* Stats Section */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Send className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
              <p className="text-2xl font-bold">{recentReviews.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">
                {recentReviews.filter((r) => r.status === "pending").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Accepted</p>
              <p className="text-2xl font-bold">
                {recentReviews.filter((r) => r.status === "accepted").length}
              </p>
            </div>
          </div>
        </Card>
      </div>
      {/* Send Review Request Section */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Send className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Send Review Survey</h3>
        </div>

        <div className="space-y-4">
          {/* Course Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Course
            </label>
            {loading ? (
              <div className="w-full rounded-lg border bg-background px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading courses...
                </div>
              </div>
            ) : (
              <select
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setSelectedStudents([]);
                }}
                className="w-full rounded-lg border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Choose a course...</option>
                {Array.isArray(courses) && courses.length > 0 ? (
                  courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No courses available
                  </option>
                )}
              </select>
            )}
            {!loading && Array.isArray(courses) && courses.length === 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                You haven't created any courses yet. Create a course first to send review requests.
              </p>
            )}
          </div>

          {/* Student Selection */}
          {selectedCourseData && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Students ({selectedStudents.length} selected)
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                {selectedCourseData.enrolledStudents.length > 0 ? (
                  selectedCourseData.enrolledStudents.map((student) => (
                    <label
                      key={student.id}
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleStudentSelection(student.id)}
                        className="rounded"
                      />
                      <div>
                        <p className="text-sm font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {student.email}
                        </p>
                      </div>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No students enrolled in this course
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Custom Message */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Custom Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message to your review request..."
              rows={3}
              className="w-full rounded-lg border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendReviewRequest}
            disabled={
              loading ||
              !selectedCourse ||
              selectedStudents.length === 0 ||
              sendingRequest
            }
            className="w-full"
          >
            {sendingRequest ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                {selectedStudents.length > 0 
                  ? `Send Review Survey to ${selectedStudents.length} Student(s)`
                  : 'Send Review Survey'}
              </>
            )}
          </Button>
          {!loading && courses.length === 0 && (
            <p className="text-xs text-center text-muted-foreground">
              Create a course and enroll students to send review surveys
            </p>
          )}
        </div>
      </Card>

      {/* Pending Reviews Section */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Pending Reviews</h3>
          <span className="ml-auto text-sm text-muted-foreground">
            {pendingReviews.length} pending
          </span>
        </div>

        {pendingReviews.length > 0 ? (
          <div className="space-y-4">
            {pendingReviews.map((review) => (
              <div
                key={review.id}
                className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {review.reviewer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{review.reviewer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {review.reviewer.email}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Course: {review.course.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium">
                      {review.rating}/5
                    </span>
                  </div>
                </div>

                {review.comment && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Submitted {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReviewAction(review.id, "reject")}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleReviewAction(review.id, "accept")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Accept & Publish
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              No pending reviews
            </p>
            <p className="text-xs text-muted-foreground">
              Reviews will appear here once students submit their feedback
            </p>
          </div>
        )}
      </Card>

      {/* Recent Reviews Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Recent Reviews</h3>
          </div>
          <span className="text-sm text-muted-foreground">
            {recentReviews.length} total
          </span>
        </div>

        {recentReviews.length > 0 ? (
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div
                key={review.id}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">
                        {review.rating}/5
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          review.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : review.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </span>
                    </div>

                    <p className="text-sm font-medium mb-1">
                      {review.course.title}
                    </p>
                    
                    {review.comment && (
                      <p className="text-sm text-muted-foreground mb-2">
                        "{review.comment}"
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{review.reviewer.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.approvedAt && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>
                            Approved {new Date(review.approvedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Star className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              No reviews yet
            </p>
            <p className="text-xs text-muted-foreground">
              Reviews from students will appear here
            </p>
          </div>
        )}
      </Card>

      
      
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        message={alertModal.message}
        title={alertModal.title}
        type={alertModal.type}
      />
    </div>
  );
}
