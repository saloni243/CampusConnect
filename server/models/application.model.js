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

        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true
        },

        status: {
            type: String,
            enum: [
                "Applied",
                "Under Review",
                "Shortlisted",
                "Rejected",
                "Selected"
            ],
            default: "Applied"
        }
    },
    {
        timestamps: true
    }
);

applicationSchema.index(
    { student: 1, job: 1 },
    { unique: true }
);

export default mongoose.model("Application", applicationSchema);