import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  location: String,
  salary: Number
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);