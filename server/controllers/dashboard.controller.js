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

export const getCompanyDashboard = async (req, res) => {
    try {

        const company = await Company.findOne({
            user: req.user.id
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        const jobs = await Job.find({
            company: company._id
        });

        const jobIds = jobs.map(job => job._id);

        const [
            totalJobs,
            activeJobs,
            inactiveJobs,
            totalApplications,
            selectedCandidates,
            latestApplications
        ] = await Promise.all([

            Job.countDocuments({
                company: company._id
            }),

            Job.countDocuments({
                company: company._id,
                isActive: true
            }),

            Job.countDocuments({
                company: company._id,
                isActive: false
            }),

            Application.countDocuments({
                company: company._id
            }),

            Application.countDocuments({
                company: company._id,
                status: "Selected"
            }),

            Application.find({
                company: company._id
            })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate({
                path: "student",
                populate: {
                    path: "user",
                    select: "name email"
                }
            })
            .populate("job", "title")
        ]);

        return res.status(200).json({
            success: true,
            dashboard: {
                totalJobs,
                activeJobs,
                inactiveJobs,
                totalApplications,
                selectedCandidates,
                latestApplications
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
