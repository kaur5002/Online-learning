"use client";

import { useState } from "react";

interface CheckoutData {
  courseId: string;
  courseName: string;
  amount: number; // in CAD dollars
}

export function useCheckout() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (checkoutData: CheckoutData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });
      const { url } = await res.json();
      window.location.href = url; // redirect to Stripe Checkout
    } catch (error) {
      console.error("Checkout error:", error);
      setLoading(false);
    }
  };

  return { handleCheckout, loading };
}
