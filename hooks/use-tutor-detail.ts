import { useQuery } from "@tanstack/react-query"
import type { Tutor, Skill } from "@/lib/mock-data"
import { notifyMockFallback } from "@/lib/notifications"

export function useTutorDetail(tutorId: string) {
  return useQuery({
    queryKey: ["tutor", tutorId],
    queryFn: async () => {
      // Since we're using mock data directly, import it
      const { mockTutors, mockSkills } = await import("@/lib/mock-data")
      
      // Find the tutor in mock data using the full ID (e.g., "tutor-1")
      const tutorData = mockTutors.find((t) => t.id === tutorId)
      if (!tutorData) {
        throw new Error("Tutor not found")
      }

      // Find all skills for this tutor
      const skillsData = mockSkills.filter((s) => s.tutorId === tutorId)

      return {
        tutor: tutorData,
        skills: skillsData,
      } as { tutor: Tutor; skills: Skill[] }
    },
  })
}
