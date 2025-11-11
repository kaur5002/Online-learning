import { useQuery } from "@tanstack/react-query"
import type { Review } from "@/lib/mock-data"
import { mockReviews } from "@/lib/mock-data"

export function useReviews(tutorId?: string) {
  return useQuery({
    queryKey: ["reviews", tutorId],
    queryFn: async () => {
      const url = tutorId ? `/api/reviews?tutorId=${tutorId}` : "/api/reviews"
      const response = await fetch(url)
      if (!response.ok) {
        return mockReviews as Review[]
      }
      const json = await response.json()
      return json.data as Review[]
    },
  })
}
