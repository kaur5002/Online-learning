"use client";

import { useState } from "react";

interface CheckoutData {
  courseId: string;
  courseName: string;
  amount: number; // in CAD dollars
  userId: string;
  userEmail: string;
  userRole?: string;
  paymentType?: "session" | "enrollment"; // "session" for single class, "enrollment" for full course
  sessionDate?: string; // Required for session bookings
  sessionType?: "individual" | "group"; // Session type for bookings
}

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (checkoutData: CheckoutData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }
      
      if (data.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setError(error instanceof Error ? error.message : "Checkout failed");
      setLoading(false);
      // Show error to user
      alert(error instanceof Error ? error.message : "Checkout failed. Please try again.");
    }
  };

  return { handleCheckout, loading, error };
}
