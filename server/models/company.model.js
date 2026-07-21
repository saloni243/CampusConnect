import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        companyName: {
            type: String,
            required: true
        },

        description: {
            type: String,
            default: ""
        },

        website: {
            type: String,
            default: ""
        },

        industry: {
            type: String,
            default: ""
        },

        location: {
            type: String,
            default: ""
        },

        logo: {
            filename: {
                type: String,
                default: ""
            },
            path: {
                type: String,
                default: ""
            },
            url: {
                type: String,
                default: ""
            }
        },

        isVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Company", companySchema);