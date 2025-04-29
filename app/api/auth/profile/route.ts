import redisConfig from "@/config/redis";
import { userModel } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connect } from "@/config/db";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: NextRequest) {
  await connect();

  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    // Check if token is valid in Redis
    const storedToken = await redisConfig.get(userId);
    if (!storedToken || storedToken !== token) {
      return NextResponse.json(
        { message: "Session expired. Please log in again." },
        { status: 401 }
      );
    }

    // Fetch user from DB
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { message: "Invalid token or server error" },
      { status: 500 }
    );
  }
}
