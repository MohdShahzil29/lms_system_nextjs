import { Lectern } from "lucide-react";
import mongoose from "mongoose";

const lectureProgess = new mongoose.Schema({
  lectureId: { type: String },
  viewed: { type: Boolean },
});

const courseProgess = new mongoose.Schema({
  userId: { type: String },
  courseId: { type: String },
  completed: { type: Boolean },
  lectureProgress: [lectureProgess],
});

const courseProgressModel =
  mongoose.models.CourseProgress ||
  mongoose.model("CourseProgress", courseProgess);
export default courseProgressModel;
