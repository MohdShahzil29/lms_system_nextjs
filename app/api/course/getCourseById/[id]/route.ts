import { connect } from "@/config/db";
import redisConfig from "@/config/redis";
import { Course } from "@/models/course";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    // Check Redis cache
    const cachedCourse = await redisConfig.get(`course:${id}`);
    if (cachedCourse) {
      return NextResponse.json(JSON.parse(cachedCourse), { status: 200 });
    }

    // Fetch from MongoDB
    const course = await Course.findById(id)
      .lean()
      .populate("creator", "name email");

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Cache in Redis
    await redisConfig.set(`course:${id}`, JSON.stringify(course), {
      EX: 60 * 60, // 1 hour
    });

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
