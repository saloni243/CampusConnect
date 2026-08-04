import Student from "../models/student.model.js";
import Company from "../models/company.model.js";
import Job from "../models/job.model.js";
import Application from "../models/application.model.js";


export const getPlacementStatistics = async (req, res) => {
    try {

        const student = await Student.findOne({
            user: req.user.id
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const applications = await Application.find({
            student: student._id
        }).populate({
            path: "job",
            select: "package company"
        });

        const totalApplications = applications.length;

        const selected = applications.filter(
            app => app.status === "Selected"
        ).length;

        const rejected = applications.filter(
            app => app.status === "Rejected"
        ).length;

        const shortlisted = applications.filter(
            app => app.status === "Shortlisted"
        ).length;

        const underReview = applications.filter(
            app => app.status === "Under Review"
        ).length;

        const placementPercentage =
            totalApplications === 0
                ? 0
                : Math.round((selected / totalApplications) * 100);

        const packages = applications
            .filter(app => app.status === "Selected")
            .map(app => app.job?.package || 0);

        const highestPackage =
            packages.length > 0 ? Math.max(...packages) : 0;

        const averagePackage =
            packages.length > 0
                ? (
                      packages.reduce((a, b) => a + b, 0) /
                      packages.length
                  ).toFixed(2)
                : 0;

        res.status(200).json({
            success: true,
            statistics: {
                totalApplications,
                selected,
                rejected,
                shortlisted,
                underReview,
                placementPercentage,
                highestPackage,
                averagePackage
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ================= COMPANY STATISTICS =================

export const getCompanyStatistics = async (req, res) => {
    try {

        // Find logged-in company
        const company = await Company.findOne({
            user: req.user.id
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        // Company Jobs
        const jobs = await Job.find({
            company: company._id
        });

        const jobIds = jobs.map(job => job._id);

        // Statistics
        const [
            totalJobs,
            activeJobs,
            inactiveJobs,
            totalApplications,
            selectedCandidates
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
                job: {
                    $in: jobIds
                }
            }),

            Application.countDocuments({
                job: {
                    $in: jobIds
                },
                status: "Selected"
            })

        ]);

        res.status(200).json({
            success: true,
            statistics: {
                totalJobs,
                activeJobs,
                inactiveJobs,
                totalApplications,
                selectedCandidates
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ================= OVERALL STATISTICS =================

export const getOverallStatistics = async (req, res) => {
    try {

        const [
            totalStudents,
            totalCompanies,
            totalJobs,
            activeJobs,
            inactiveJobs,
            totalApplications
        ] = await Promise.all([

            Student.countDocuments(),

            Company.countDocuments(),

            Job.countDocuments(),

            Job.countDocuments({
                isActive: true
            }),

            Job.countDocuments({
                isActive: false
            }),

            Application.countDocuments()

        ]);

        res.status(200).json({
            success: true,
            statistics: {
                totalStudents,
                totalCompanies,
                totalJobs,
                activeJobs,
                inactiveJobs,
                totalApplications
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ================= MONTHLY ANALYTICS =================

export const getMonthlyAnalytics = async (req, res) => {
    try {

        const analytics = await Application.aggregate([
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" }
                    },
                    applications: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    "_id.month": 1
                }
            }
        ]);

        const monthNames = [
            "",
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];

        const result = analytics.map(item => ({
            month: monthNames[item._id.month],
            applications: item.applications
        }));

        res.status(200).json({
            success: true,
            analytics: result
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
