import Student from "../models/student.model.js";
import Job from "../models/job.model.js";
import Company from "../models/company.model.js";
import Application from "../models/application.model.js";

export const getDashboard = async (req, res) => {
    try {

        const student = await Student.findOne({ user: req.user.id });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const [
            totalJobs,
            totalCompanies,
            appliedJobs,
            latestJobs
        ] = await Promise.all([
            Job.countDocuments({ isActive: true }),
            Company.countDocuments(),
            Application.countDocuments({ student: student._id }),
            Job.find({ isActive: true })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate("company", "companyName")
        ]);

        res.status(200).json({
            success: true,
            dashboard: {
                profileCompletion: student.profileCompletion,
                resumeUploaded: !!student.resume?.url,
                profilePictureUploaded: !!student.profilePicture?.url,
                skillsCount: student.skills.length,
                appliedJobs,
                savedJobs: student.savedJobs.length,
                availableJobs: totalJobs,
                companies: totalCompanies,
                latestJobs
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};