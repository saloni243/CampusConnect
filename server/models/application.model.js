import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },

    status: {
      type: String,
      enum: [
        "pending",
        "shortlisted",
        "interview",
        "selected",
        "rejected"
      ],
      default: "pending"
    }
  },
  { timestamps: true }
);

// 🔥 Prevent duplicate applications
applicationSchema.index({ student: 1, job: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);