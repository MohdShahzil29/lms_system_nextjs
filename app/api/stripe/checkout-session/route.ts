import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Course } from "@/models/course";
import { connect } from "@/config/db";
import CoursePurchase from "@/models/coursebuy";
import { userModel } from "@/models/user";

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY as string);

// export async function POST(req: NextRequest) {
//   try {
//     await connect();

//     const body = await req.json();
//     const userId = body.userId;
//     const courseId = body.courseId;
//     console.log("Received User ID:", userId);

//     const course = await Course.findById(courseId);
//     console.log("Fetched Course:", course);

//     if (!course) {
//       return NextResponse.json(
//         { message: "Course not found!" },
//         { status: 404 }
//       );
//     }

//     // Create a new purchase record
//     const newPurchase = new CoursePurchase({
//       courseId,
//       userId,
//       amount: course.coursePrice,
//       status: "completed",
//     });

//     // Create Stripe checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "inr",
//             product_data: {
//               name: course.courseTitle,
//               images: [course.courseThumbnail],
//             },
//             unit_amount: course.coursePrice * 100,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `http://localhost:3000/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `http://localhost:3000/details/${courseId}`,
//       metadata: {
//         courseId,
//         userId,
//       },
//       shipping_address_collection: {
//         allowed_countries: ["IN"],
//       },
//     });

//     if (!session.url) {
//       return NextResponse.json(
//         { success: false, message: "Error while creating session" },
//         { status: 400 }
//       );
//     }

//     newPurchase.paymentId = session.id;

//     await newPurchase.save();

//     return NextResponse.json({ success: true, url: session.url });
//   } catch (error) {
//     console.error("Error creating Stripe session:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req: NextRequest) {
  try {
    await connect();

    const { userId, courseId } = await req.json();

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { message: "Course not found!" },
        { status: 404 }
      );
    }

    // Create a new purchase record
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "completed",
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/details/${courseId}`,
      metadata: { courseId, userId },
      shipping_address_collection: { allowed_countries: ["IN"] },
    });

    if (!session.url) {
      return NextResponse.json(
        { success: false, message: "Error while creating session" },
        { status: 400 }
      );
    }

    newPurchase.paymentId = session.id;

    // Enroll user
    await userModel.findByIdAndUpdate(newPurchase.userId, {
      $addToSet: { enrolledCourses: newPurchase.courseId },
    });

    // Add student to course
    await Course.findByIdAndUpdate(newPurchase.courseId, {
      $addToSet: { enrolledStudents: newPurchase.userId },
    });

    await newPurchase.save();

    return NextResponse.json({ success: true, url: session.url });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
