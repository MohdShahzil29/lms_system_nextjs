import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connect } from "@/config/db";

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY as string);

export async function GET(req: NextRequest) {
  await connect();
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json(
      { message: "Missing session_id" },
      { status: 400 }
    );
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") {
    return NextResponse.json(
      { message: "Payment not completed" },
      { status: 402 }
    );
  }

  const courseId = session.metadata?.courseId as string;
  return NextResponse.json({ courseId });
}
