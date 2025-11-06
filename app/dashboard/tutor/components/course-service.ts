// Service functions for Courses API

import {
  Course,
  CourseCategory,
  CreateCourseData,
  UpdateCourseData,
  CoursesResponse,
} from "./types";

const API_BASE = "/api";

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// Helper function to get current user ID
export const getCurrentUserId = (): string => {
  if (typeof window === "undefined") return "";
  const userData = localStorage.getItem("user");
  if (!userData) return "";
  try {
    const user = JSON.parse(userData);
    return user.id || "";
  } catch {
    return "";
  }
};

// Helper function to get current user's name
export const getCurrentUserName = (): string => {
  if (typeof window === "undefined") return "";
  const userData = localStorage.getItem("user");
  if (!userData) return "";
  try {
    const user = JSON.parse(userData);
    return user.name || "";
  } catch {
    return "";
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken() && !!getCurrentUserId();
};

// Helper function to create authenticated headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();

  if (!response.ok) {
    console.error("API Error:", data);
    if (data.details && Array.isArray(data.details)) {
      // Format validation errors
      const validationErrors = data.details
        .map((issue: any) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      throw new Error(`Validation failed: ${validationErrors}`);
    }
    throw new Error(data.error || data.message || "An error occurred");
  }

  return data;
};

// Fetch courses for a specific tutor
export const fetchCourses = async (userId: string): Promise<Course[]> => {
  const response = await fetch(`${API_BASE}/courses?userId=${userId}`, {
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(response);
  return data.data.courses;
};

// Fetch all course categories
export const fetchCourseCategories = async (): Promise<CourseCategory[]> => {
  const response = await fetch(`${API_BASE}/course-categories`, {
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(response);
  return data.data;
};

// Create a new course
export const createCourse = async (
  courseData: CreateCourseData
): Promise<Course> => {
  const response = await fetch(`${API_BASE}/courses`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(courseData),
  });

  const data = await handleResponse(response);
  return data.data;
};

// Update an existing course
export const updateCourse = async (
  courseId: string,
  courseData: UpdateCourseData
): Promise<Course> => {
  const response = await fetch(`${API_BASE}/courses/${courseId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(courseData),
  });

  const data = await handleResponse(response);
  return data.data;
};

// Delete a course
export const deleteCourse = async (courseId: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/courses/${courseId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  await handleResponse(response);
};

// Search courses with filters
export const searchCourses = async (params: {
  search?: string;
  difficulty?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}): Promise<CoursesResponse> => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString());
    }
  });

  const response = await fetch(
    `${API_BASE}/courses?${searchParams.toString()}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(response);
};
