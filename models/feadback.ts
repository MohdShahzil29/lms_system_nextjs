import mongoose from "mongoose";

const feadBackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  feadBackDescription: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

const feadBackModel =
  mongoose.models.FeadBack || mongoose.model("FeadBack", feadBackSchema);

export default feadBackModel;
