import { z } from "zod";

const courseScheduleSchema = z.object({
  days: z.array(
    z.enum([
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ])
  ),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  timezone: z.string().min(1, "Timezone is required"),
});

export const createCourseSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  shortDescription: z
    .string()
    .min(1, "Short description is required")
    .max(500, "Short description must be less than 500 characters"),
  overview: z.string().min(1, "Overview is required"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  prerequisites: z.array(z.string()).default([]),
  skillsLearned: z
    .array(z.string())
    .min(1, "At least one skill must be specified"),
  totalHours: z.number().int().min(1, "Total hours must be at least 1"),
  schedule: z
    .array(courseScheduleSchema)
    .min(1, "At least one schedule slot is required"),
  zoomLink: z
    .string()
    .optional()
    .transform((val) => val?.trim() || undefined)
    .refine((val) => !val || /^https?:\/\/.+/.test(val), {
      message: "Invalid Zoom link URL",
    }),
  categoryId: z.string().optional(),
  imageUrl: z.string().url({ message: "Invalid image URL" }).optional(),
  trialRate: z.number().min(0, "Trial rate must be non-negative"),
  fullCourseRate: z.number().min(0, "Full course rate must be non-negative"),
});

export const updateCourseSchema = createCourseSchema.partial();

export const courseQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1)),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(100)),
  search: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  categoryId: z.string().optional(),
  tutorId: z.string().optional(),
  userId: z.string().optional(),
  createdAfter: z.string().optional(),
  createdBefore: z.string().optional(),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CourseQueryInput = z.infer<typeof courseQuerySchema>;
