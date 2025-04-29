import feadBackModel from "@/models/feadback";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/config/db";
import redisConfig from "@/config/redis";

export async function GET(req: NextRequest) {
  try {
    await connect();

    const cacheKey = "feedbacks";

    // 1. Try to fetch from Redis first
    const cachedFeedback = await redisConfig.get(cacheKey);

    if (cachedFeedback) {
      console.log("Serving from Redis Cache");
      return NextResponse.json(
        {
          message: "Feedback fetched successfully (from cache)",
          feedback: JSON.parse(cachedFeedback),
        },
        { status: 200 }
      );
    }

    // 2. If not cached, fetch from MongoDB
    const feedback = await feadBackModel
      .find({})
      .populate("userId", "name photo");

    // 3. Store fetched data into Redis (cache for 60 seconds)
    await redisConfig.set(cacheKey, JSON.stringify(feedback), {
      EX: 60, // expire after 60 seconds
    });

    console.log("Serving from Database and caching in Redis");

    return NextResponse.json(
      { message: "Feedback fetched successfully", feedback },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
