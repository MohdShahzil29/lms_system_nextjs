import { connect } from "@/config/db";
import redisConfig from "@/config/redis";
import { Course } from "@/models/course";
import { NextRequest, NextResponse } from "next/server";
import '@/models/user'

export async function GET(request: NextRequest) {
  await connect();

  try {
    const cacheKey = "published_courses";

    // Try getting from Redis cache
    const cached = await redisConfig.get(cacheKey);
    if (cached) {
      return NextResponse.json({
        success: true,
        source: "cache",
        data: JSON.parse(cached),
      });
    }

    // Fetch from DB if not cached
    const publishedCourses = await Course.find({ isPublished: true }).populate(
      "creator",
      "name email"
    );

    // Save to Redis with expiry (600 seconds)
    await redisConfig.set(
      "published_courses",
      JSON.stringify(publishedCourses),
      {
        EX: 600,
      }
    );

    return NextResponse.json({
      success: true,
      source: "database",
      data: publishedCourses,
    });
  } catch (error) {
    console.error("Error fetching published courses:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch published courses" },
      { status: 500 }
    );
  }
}
