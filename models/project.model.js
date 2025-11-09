import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    bio: String,
    avatar: String,
    location: String,
    email: String,
    phoneNo: Number,
    resumeUrl: String,
    socialLinks: {
      gitHub: String,
      linkedIn: String,
      portfolio: String,
    },
    skills: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Profile", profileSchema);
