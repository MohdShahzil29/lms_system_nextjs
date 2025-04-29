import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/config/db";
import lectureModels from "@/models/lecture";
import { deleteVideo, uploadVideo } from "@/lib/cloudinary";

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const lectureId = formData.get("lectureId") as string;
    const lectureTitle = formData.get("lectureTitle") as string;
    const isPreviewFree = formData.get("isPreviewFree") === "true";
    const videoFile = formData.get("video") as Blob | null;

    if (!lectureId || !lectureTitle) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Connect to DB
    await connect();

    const lecture = await lectureModels.findById(lectureId);
    if (!lecture) {
      return NextResponse.json(
        { message: "Lecture not found" },
        { status: 404 }
      );
    }

    // Update fields
    lecture.lectureTitle = lectureTitle;
    lecture.isPreviewFree = isPreviewFree;

    // If new video uploaded, delete old and upload new
    if (videoFile) {
      // Delete old video from Cloudinary
      if (lecture.publicId) {
        await deleteVideo(lecture.publicId); // Make sure this is implemented
      }

      const uploadRes = await uploadVideo(videoFile);
      if (!uploadRes) {
        return NextResponse.json(
          { message: "Video upload failed" },
          { status: 500 }
        );
      }

      lecture.videUrl = uploadRes.secure_url;
      lecture.publicId = uploadRes.public_id;
    }

    await lecture.save();

    return NextResponse.json(
      { message: "Lecture updated successfully" },
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
