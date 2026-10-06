import Notification from "../models/notification.model.js";
import Application from "../models/application.model.js";
import Student from "../models/student.model.js";
import Company from "../models/company.model.js";
import Job from "../models/job.model.js";


// =====================================================
// APPLY JOB
// =====================================================
export const applyJob = async (req, res) => {
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

        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // Check whether job is active
        if (!job.isActive) {
            return res.status(400).json({
                success: false,
                message: "Job is no longer active"
            });
        }

        // Check whether application deadline has passed
        if (new Date() > new Date(job.lastDate)) {
            return res.status(400).json({
                success: false,
                message: "Application deadline has passed"
            });
        }

        // Check duplicate application
        const alreadyApplied = await Application.findOne({
            student: student._id,
            job: job._id
        });

        if (alreadyApplied) {
            return res.status(400).json({
                success: false,
                message: "Already applied"
            });
        }

        const application = await Application.create({
            student: student._id,
            job: job._id,
            company: job.company
        });

        // Notify student
        await Notification.create({
            user: req.user.id,
            title: "Application Submitted",
            message: `You have successfully applied for ${job.title}.`,
            type: "Application"
        });

        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            application
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// =====================================================
// GET APPLICANTS
// =====================================================
export const getApplicants = async (req, res) => {
    try {

        const jobId = req.params.jobId;

        // Find logged-in company
        const company = await Company.findOne({
            user: req.user.id
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found"
            });
        }

        // Find job
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // Check job ownership
        if (job.company.toString() !== company._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view applicants for this job"
            });
        }

        const applications = await Application.find({
            job: jobId
        })
            .populate({
                path: "student",
                populate: {
                    path: "user",
                    select: "name email"
                }
            });

        res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// =====================================================
// UPDATE APPLICATION STATUS
// =====================================================
export const updateApplicationStatus = async (req, res) => {
    try {

        const { applicationId } = req.params;
        const { status } = req.body;

        // Find logged-in company
        const company = await Company.findOne({
            user: req.user.id
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found"
            });
        }

        // Find application
        const application = await Application.findById(applicationId)
            .populate({
                path: "student",
                select: "user"
            })
            .populate({
                path: "job",
                select: "title company"
            });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        // Check whether application belongs
        // to a job owned by the logged-in company
        if (
            application.job.company.toString() !==
            company._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this application"
            });
        }

        // Validate application status
        const allowedStatuses = [
            "Applied",
            "Under Review",
            "Shortlisted",
            "Interview",
            "Rejected",
            "Selected"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid application status"
            });
        }

        application.status = status;

        await application.save();

        // Notify student
        await Notification.create({
            user: application.student.user,
            title: "Application Status Updated",
            message: `Your application for ${application.job.title} has been ${status}.`,
            type: "Application"
        });

        res.status(200).json({
            success: true,
            message: "Status updated successfully",
            application
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// =====================================================
// CANCEL APPLICATION
// =====================================================
export const cancelApplication = async (req, res) => {
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

        const application = await Application.findOne({
            student: student._id,
            job: req.params.jobId
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        await application.deleteOne();

        res.status(200).json({
            success: true,
            message: "Application cancelled successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// =====================================================
// GET MY APPLICATIONS
// =====================================================
export const getMyApplications = async (req, res) => {
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
        })
            .populate({
                path: "job",
                select: "title location package"
            })
            .populate({
                path: "company",
                select: "companyName"
            });

        res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// =====================================================
// GET APPLICATION STATUS
// =====================================================
export const getApplicationStatus = async (req, res) => {
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

        const application = await Application.findOne({
            student: student._id,
            job: req.params.jobId
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        res.status(200).json({
            success: true,
            status: application.status
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};