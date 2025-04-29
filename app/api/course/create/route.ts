import { connect } from "@/config/db";
import { uploadMedia } from "@/lib/cloudinary";
import { Course } from "@/models/course";
import { userModel } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(request: NextRequest) {
  await connect();

  try {
    const {
      courseTitle,
      description,
      category,
      coursePrice,
      courseThumbnail,
      studentLearning,
      courseLanguage,
      subTitle,
    } = await request.json();

    if (
      !courseTitle ||
      !description ||
      !category ||
      !coursePrice ||
      !courseThumbnail ||
      !courseLanguage ||
      !studentLearning ||
      !subTitle
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
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

    // Upload thumbnail
    const uploadedThumbnail = await uploadMedia(courseThumbnail);
    if (!uploadedThumbnail?.secure_url) {
      return NextResponse.json(
        { message: "Thumbnail upload failed" },
        { status: 500 }
      );
    }

    // Create and save course
    const savedCourse = await Course.create({
      courseTitle,
      description,
      category,
      subTitle,
      coursePrice,
      studentLearning,
      courseLanguage,
      // duration,
      isPublished: true,
      creator: user._id,
      courseThumbnail: uploadedThumbnail.secure_url,
    });

    // savedCourse is already a regular object, so:
    return NextResponse.json(
      { message: "Course created successfully", course: savedCourse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Course creation failed:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
