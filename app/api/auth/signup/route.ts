import { userModel } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "@/config/db";

export async function POST(request: NextRequest) {
  await connect();
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully", newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
