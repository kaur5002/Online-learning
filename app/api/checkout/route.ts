import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CheckoutRequest {
  courseId: string;
  courseName: string;
  amount: number; // in CAD dollars
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();

    const { courseId, courseName, amount } = body;

    // Validate required fields
    if (!courseId || !courseName || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: courseId, courseName, amount" },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Convert CAD dollars to cents for Stripe
    const amountInCents = Math.round(amount * 100);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cad", // CAD only
            unit_amount: amountInCents,
            product_data: { name: courseName },
          },
          quantity: 1,
        },
      ],
      success_url: `${
        process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
      }/success?sessionId={CHECKOUT_SESSION_ID}&courseId=${courseId}`,
      cancel_url: `${
        process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
      }/cancel?courseId=${courseId}`,
    });

    // Return the hosted Checkout URL for a simple client-side redirect
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
