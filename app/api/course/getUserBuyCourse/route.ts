import { NextRequest, NextResponse } from "next/server";
import CoursePurchase from "@/models/coursebuy";
import { connect } from "@/config/db";
import "@/models/course";

// Handler to get user purchase courses
export async function GET(request: NextRequest) {
  try {
    // Parse userId from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    // Ensure database is connected
    await connect();

    // Fetch purchases for the user, populate course details
    const purchases = await CoursePurchase.find({ userId })
      .populate({
        path: "courseId",
        select: "courseTitle courseThumbnail description coursePrice",
      })
      .sort({ createdAt: -1 });

    // Respond with purchase data
    return NextResponse.json({ purchases }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user purchases:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
