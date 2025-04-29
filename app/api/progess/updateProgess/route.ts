import { connect } from "@/config/db";
import { NextResponse, NextRequest } from "next/server";
import courseProgessModel from "@/models/progess";

// Update course progress controller
export async function PUT(req: NextRequest) {
  try {
    await connect();
    const { userId, courseId, lectureId, viewed } = await req.json();

    if (!userId || !courseId || !lectureId) {
      return NextResponse.json(
        { message: "Missing required fields (userId, courseId, lectureId)" },
        { status: 400 }
      );
    }

    // Find existing progress
    let progress = await courseProgessModel.findOne({
      userId,
      courseId,
    });

    if (!progress) {
      // If no progress exists, create new
      progress = new courseProgessModel({
        userId,
        courseId,
        completed: false,
        lectureProgress: [{ lectureId, viewed }],
      });
    } else {
      // Update existing progress
      const lectureIndex = progress.lectureProgress.findIndex(
        (lecture) => lecture.lectureId === lectureId
      );

      if (lectureIndex === -1) {
        // If the lecture is not found, add a new progress entry
        progress.lectureProgress.push({ lectureId, viewed });
      } else {
        // If lecture exists, update the 'viewed' status
        progress.lectureProgress[lectureIndex].viewed = viewed;
      }

      // Check if all lectures have been viewed
      progress.completed = progress.lectureProgress.every(
        (lecture) => lecture.viewed
      );
    }

    await progress.save();

    return NextResponse.json({
      message: "Progress updated successfully",
      progress,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
