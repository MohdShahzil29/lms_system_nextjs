import { connect } from "@/config/db";
import redisConfig from "@/config/redis";
import { NextRequest, NextResponse } from "next/server";
import lectureModels from "@/models/lecture";

export async function GET(req: NextRequest) {
  await connect();

  try {
    const url = new URL(req.url);
    const lectureId = url.pathname.split("/").pop();

    if (!lectureId) {
      return NextResponse.json(
        { error: "Lecture ID is required" },
        { status: 400 }
      );
    }

    const redisKey = `lecture:${lectureId}`;
    const cachedLecture = await redisConfig.get(redisKey);

    if (cachedLecture) {
      return NextResponse.json(JSON.parse(cachedLecture), { status: 200 });
    }

    const lecture = await lectureModels.findById(lectureId);

    if (!lecture) {
      return NextResponse.json({ error: "Lecture not found" }, { status: 404 });
    }

    await redisConfig.set(redisKey, JSON.stringify(lecture), {
      EX: 3600, // 1 hour
    });

    return NextResponse.json(lecture, { status: 200 });
  } catch (error) {
    console.error("Error fetching lecture by ID:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
