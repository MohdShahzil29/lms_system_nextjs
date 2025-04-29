import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  lectureTitle: {
    type: String,
    required: true,
  },
  videUrl: {
    type: String,
  },
  publicId: {
    type: String,
  },
  isPreviewFree: {
    type: Boolean,
    default: false,
  },
});

const lectureModels =
  mongoose.models.Lecture || mongoose.model("Lecture", lectureSchema);
export default lectureModels;
