import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    techStack: [String],
    gitHubLink: String,
    liveLink: String,
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
