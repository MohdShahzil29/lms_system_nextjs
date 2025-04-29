import { connect } from "@/config/db";
import { uploadMedia } from "@/lib/cloudinary";
import { Course } from "@/models/course";
import { userModel } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  await connect();

  try {
    const {
      courseId,
      courseTitle,
      description,
      category,
      coursePrice,
      courseThumbnail,
      studentLearning,
      courseLanguage,
    } = await request.json();

    if (!courseId) {
      return NextResponse.json(
        { message: "Course ID is required" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Invalid or missing Authorization header" },
        { status: 400 }
      );
    }

    const userId = authHeader.split(" ")[1];
    const user = await userModel.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (course.creator.toString() !== user._id.toString()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Upload new thumbnail if provided
    if (courseThumbnail) {
      const uploaded = await uploadMedia(courseThumbnail);
      if (!uploaded?.secure_url) {
        return NextResponse.json(
          { message: "Thumbnail upload failed" },
          { status: 500 }
        );
      }
      course.courseThumbnail = uploaded.secure_url;
    }

    // Update other fields only if provided
    if (courseTitle) course.courseTitle = courseTitle;
    if (description) course.description = description;
    if (category) course.category = category;
    if (coursePrice) course.price = coursePrice;
    if (studentLearning) course.studentLearning = studentLearning;
    if (courseLanguage) course.courseLanguage = courseLanguage;

    await course.save();

    return NextResponse.json(
      { message: "Course updated successfully", course },
      { status: 200 }
    );
  } catch (error) {
    console.error("Course update failed:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
