import { connect } from "@/config/db";
import { Course } from "@/models/course";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connect();

  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get("creatorId");

    if (!creatorId) {
      return NextResponse.json(
        { success: false, message: "creatorId is required" },
        { status: 400 }
      );
    }

    const courses = await Course.find({ creator: creatorId });

    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    console.error("Error fetching creator courses:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch creator courses" },
      { status: 500 }
    );
  }
}
