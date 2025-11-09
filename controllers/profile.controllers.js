import ProfileModel from "../models/profile.model.js";

const createProfile = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await ProfileModel.findOne({ email });
    if (existingUser)
      return res
        .status(409)
        .json({ message: "Profile already Exist. Please Login!" });

    const newProfile = new ProfileModel(req.body);
    await newProfile.save();
    res.status(201).json({
      message: "Profile created successfully!!!",
      Profile: newProfile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await ProfileModel.find();
    if (!user)
      return res.status(404).json({ message: "Profile does not exist." });

    const finalUser = user[0];
    res.status(200).json({
      Name: finalUser.name,
      Bio: finalUser.bio,
      skills: finalUser.skills,
      Email: finalUser.email,
      PhoneNo: finalUser.phoneNo,
      Location: finalUser.location,
      ResumeUrl: finalUser.resumeUrl,
      SocialLinks: {
        GitHub: finalUser.socialLinks.gitHub,
        LinkedIn: finalUser.socialLinks.linkedIn,
        Portfolio: finalUser.socialLinks.portfolio,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { email, ...updates } = req.body;
  try {
    if (!email)
      return res
        .status(400)
        .json({ message: "Email is required for Profile validation." });

    const updatedProfile = await ProfileModel.findOneAndUpdate(
      { email },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({ message: "Profile updated Successfully" });
    if (!updatedProfile)
      return res.status(404).json({ message: "Profile does not exist" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export { createProfile, getProfile, updateProfile };
