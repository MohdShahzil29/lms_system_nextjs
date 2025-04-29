import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connect } from "@/config/db";
import CoursePurchase from "@/models/coursebuy";
import Lecture from "@/models/lecture";
import { Course } from "@/models/course";
import { userModel } from "@/models/user";

// Use your Stripe secret key
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, {
  apiVersion: "2022-11-15",
});

export const config = {
  api: { bodyParser: false },
};

export async function POST(req: NextRequest) {
  await connect();

  // 1) Grab raw body and Stripe signature header
  const buf = await req.arrayBuffer();
  const rawBody = Buffer.from(buf).toString("utf8");
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.WEBHOOK_ENDPOINT_SECRET!
    );
  } catch (err: any) {
    console.error("⚠️  Webhook signature verification failed.", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // 2) Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Update purchase record
      const purchase = await CoursePurchase.findOneAndUpdate(
        { paymentId: session.id },
        { status: "completed", amount: (session.amount_total ?? 0) / 100 },
        { new: true }
      ).populate("courseId");

      if (!purchase) {
        console.error("Purchase not found for session:", session.id);
        return new NextResponse("Purchase not found", { status: 404 });
      }

      // Unlock all lectures
      const lectureIds = (purchase.courseId as any).lectures;
      if (lectureIds?.length) {
        await Lecture.updateMany(
          { _id: { $in: lectureIds } },
          { isPreviewFree: true }
        );
      }

      // Enroll user
      await userModel.findByIdAndUpdate(purchase.userId, {
        $addToSet: { enrolledCourses: purchase.courseId._id },
      });

      // Add student to course
      await Course.findByIdAndUpdate(purchase.courseId._id, {
        $addToSet: { enrolledStudents: purchase.userId },
      });

      console.log("✅ Successfully processed session:", session.id);
    } catch (err) {
      console.error("❌ Error in fulfillment:", err);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }

  // Return a 2xx to acknowledge receipt
  return new NextResponse("Received", { status: 200 });
}
