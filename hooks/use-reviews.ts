import { useQuery } from "@tanstack/react-query"
import type { Review } from "@/lib/mock-data"
import { mockReviews } from "@/lib/mock-data"

export function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const response = await fetch("/api/reviews")
      if (!response.ok) {
        return mockReviews as Review[]
      }
      const json = await response.json()
      return json.data as Review[]
    },
  })
}
