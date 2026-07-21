import Student from "../models/student.model.js";
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