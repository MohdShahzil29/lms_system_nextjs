import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/config/db";
import lectureModels from "@/models/lecture";
import { Course } from "@/models/course";
import { uploadVideo } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const courseId = formData.get("courseId") as string;
    const lectureTitle = formData.get("lectureTitle") as string;
    const isPreviewFree = formData.get("isPreviewFree") === "true";
    const videoFile = formData.get("video") as Blob;

    if (!courseId || !lectureTitle || !videoFile) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2. Connect to the database
    await connect();

    const course = await Course.findById(courseId);

    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    // 4. Upload the video file
    const uploadResponse = await uploadVideo(videoFile);
    if (!uploadResponse) {
      return NextResponse.json(
        { message: "Video upload failed" },
        { status: 500 }
      );
    }

    // 5. Directly use MongoDB _id for the lecture
    const newLecture = new lectureModels({
      lectureTitle,
      videUrl: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      isPreviewFree,
    });
    await newLecture.save();

    // 6. Associate the lecture with the course
    course.lectures.push(newLecture._id);
    await course.save();

    return NextResponse.json(
      { message: "Lecture added successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
