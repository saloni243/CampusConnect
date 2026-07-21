import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        package: {
            type: Number,
            required: true
        },

        skills: [
            {
                type: String,
                trim: true
            }
        ],

        eligibleBranches: [
            {
                type: String
            }
        ],

        minimumCGPA: {
            type: Number,
            default: 0
        },

        batch: {
            type: Number,
            required: true
        },

        lastDate: {
            type: Date,
            required: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Job", jobSchema);