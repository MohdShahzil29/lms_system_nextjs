import { connect } from "@/config/db";
import redisConfig from "@/config/redis";
import { NextResponse, NextRequest } from "next/server";
import courseProgessModel from "@/models/progess";
import { Course } from "@/models/course";

// Get progress controller
export async function GET(req: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");

    if (!userId || !courseId) {
      return NextResponse.json(
        { message: "Missing userId or courseId" },
        { status: 400 }
      );
    }

    // Try to get from Redis cache first
    const cachedData = await redisConfig.get(`progress:${userId}:${courseId}`);

    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData), { status: 200 });
    }

    // If not in Redis, fetch from MongoDB
    const progress = await courseProgessModel.findOne({
      userId,
      courseId,
    });

    console.log("Progress from MongoDB:", progress);

    if (!progress) {
      return NextResponse.json(
        { message: "Progress not found" },
        { status: 404 }
      );
    }

    // Save in Redis for next time
    await redisConfig.set(
      `progress:${userId}:${courseId}`,
      JSON.stringify(progress),
      {
        EX: 3600,
      }
    );

    return NextResponse.json(progress, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
