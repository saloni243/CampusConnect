import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Academic Info
    PRN: {
      type: String
    },
    rollNumber: {
      type: String
    },
    branch: {
      type: String
    },
    year: {
      type: String
    },
    cgpa: {
      type: Number
    },

    // Skills
    skills: [
      {
        type: String
      }
    ],

    // Contact Info
    phone: String,
    address: String,

    // Social Links
    linkedin: String,
    github: String,
    portfolio: String,

    // Resume (Cloudinary)
    resume: {
      url: {
        type: String
      },
      public_id: {
        type: String
      }
    },

    // Profile Picture (Cloudinary)
    profilePic: {
      url: {
        type: String
      },
      public_id: {
        type: String
      }
    },

    // Saved Jobs
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
      }
    ],

    // Profile Completion (optional but powerful)
    profileCompleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);