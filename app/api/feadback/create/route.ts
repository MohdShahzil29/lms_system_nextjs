import feadBackModel from "@/models/feadback";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/config/db";

export async function POST(req: NextRequest) {
  try {
    // 1. Connect to the database
    await connect();

    // 2. Parse request body
    const { userId, feadBackDescription, role } = await req.json();

    // 3. Validate input data
    if (!userId || !feadBackDescription || !role) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 4. Create a new feedback entry
    const feedback = new feadBackModel({
      userId,
      feadBackDescription,
      role,
    });

    // 5. Save the feedback to the database
    await feedback.save();

    // 6. Return success response
    return NextResponse.json(
      { message: "Feedback created successfully", feedback },
      { status: 201 }
    );
  } catch (error: any) {
    // 7. Error handling
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
