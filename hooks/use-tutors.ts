import { useQuery } from "@tanstack/react-query"
import type { Tutor } from "@/lib/mock-data"
import { mockTutors } from "@/lib/mock-data"

export function useTutors() {
  return useQuery({
    queryKey: ["tutors"],
    queryFn: async () => {
      // Since we're using mock data directly, return it as is
      return mockTutors
    },
  })
}
