import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/config/db";
import { Course } from "@/models/course";
import "@/models/lecture";

await connect();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    const courseLecture = await Course.findById(id).populate("lectures");
    if (!courseLecture) {
      return NextResponse.json(
        { error: `course lecture not found` },
        { status: 404 }
      );
    }
    return NextResponse.json({ courseLecture }, { status: 200 });
  } catch (error) {
    console.error("Error fetching lectures:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
