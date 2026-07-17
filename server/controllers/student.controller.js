import Student from "../models/student.model.js";

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      user: req.user.id,
    }).populate("user", "-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      user: req.user.id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    Object.assign(student, req.body);

    if (
      student.prn &&
      student.cgpa &&
      student.skills?.length > 0 &&
      student.resume?.url
    ) {
      student.profileCompleted = true;
    }

    await student.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const uploadResume = async (req, res) => {
  res.json({
    success: true,
    message: "Resume uploaded successfully",
    file: req.file,
  });
};

export const uploadProfilePic = async (req, res) => {
  res.json({
    success: true,
    message: "Profile picture uploaded successfully",
    file: req.file,
  });
};