import redisConfig from "@/config/redis";
import { userModel } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connect } from "@/config/db";
import { uploadMedia } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  await connect();

  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    const storedToken = await redisConfig.get(userId);
    if (!storedToken || storedToken !== token) {
      return NextResponse.json(
        { message: "Session expired. Please log in again." },
        { status: 401 }
      );
    }

    // Parse form-data
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const file = formData.get("photo") as File;

    let photoUrl = undefined;

    // Upload if photo is present
    if (file && file.size > 0) {
      const buffer = await file.arrayBuffer();
      const base64String = Buffer.from(buffer).toString("base64");
      const mimeType = file.type;
      const dataUri = `data:${mimeType};base64,${base64String}`;
      const uploadResult = await uploadMedia(dataUri);
      photoUrl = uploadResult?.secure_url;
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        {
          ...(name && { name }),
          ...(photoUrl && { photo: photoUrl }),
        },
        { new: true }
      )
      .select("-password");

    return NextResponse.json(
      { message: "Profile updated", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
