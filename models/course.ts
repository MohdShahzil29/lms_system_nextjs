import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseTitle: {
      type: String,
      required: true,
    },
    subTitle: { type: String },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    courseLevel: {
      type: String,
      enum: ["Beginner", "Medium", "Advance"],
    },
    coursePrice: {
      type: Number,
      requied: true,
    },
    courseThumbnail: { type: String, required: true },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    studentLearning: {
      type: String,
      required: true,
    },
    courseLanguage: {
      type: String,
      enum: ["English", "Hindi", "Hinglish", "Urdu"],
      required: true,
      default: "English",
    },
  },
  { timestamps: true }
);

export const Course =
  mongoose.models.Course || mongoose.model("Course", courseSchema);
