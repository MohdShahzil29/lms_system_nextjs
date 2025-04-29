import { connect } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import CoursePurchase from "@/models/coursebuy";
import { Course } from "@/models/course";
import { userModel } from "@/models/user";

export async function GET(req: NextRequest) {
  try {
    await connect();

    const purchases = await CoursePurchase.find({ status: "completed" })
      .populate({
        path: "courseId",
        model: Course,
        select: "courseTitle courseThumbnail coursePrice",
      })
      .populate({
        path: "userId",
        model: userModel,
        select: "name email",
      })
      .lean();

    return NextResponse.json({ success: true, data: purchases });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
