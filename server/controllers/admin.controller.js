import Student from "../models/student.model.js";
import Company from "../models/company.model.js";
import Job from "../models/job.model.js";
import Application from "../models/application.model.js";

export const getAdminDashboard = async (req, res) => {
    try {

        const [
            totalStudents,
            totalCompanies,
            totalJobs,
            totalApplications,
            recentStudents,
            recentCompanies,
            recentJobs
        ] = await Promise.all([

            Student.countDocuments(),

            Company.countDocuments(),

            Job.countDocuments(),

            Application.countDocuments(),

            Student.find()
                .populate("user", "name email")
                .sort({ createdAt: -1 })
                .limit(5),

            Company.find()
                .sort({ createdAt: -1 })
                .limit(5),

            Job.find()
                .populate("company", "companyName")
                .sort({ createdAt: -1 })
                .limit(5)

        ]);

        res.status(200).json({
            success: true,
            dashboard: {
                totalStudents,
                totalCompanies,
                totalJobs,
                totalApplications,
                recentStudents,
                recentCompanies,
                recentJobs
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ================= GET ALL STUDENTS =================

export const getAllStudents = async (req, res) => {
    try {

        const students = await Student.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: students.length,
            students
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ================= GET STUDENT BY ID =================

export const getStudentById = async (req, res) => {
    try {

        const student = await Student.findById(req.params.id)
            .populate("user", "name email");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            student
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ================= SEARCH STUDENTS =================

export const searchStudents = async (req, res) => {
    try {

        const { keyword } = req.query;

        const students = await Student.find()
            .populate({
                path: "user",
                match: {
                    $or: [
                        {
                            name: {
                                $regex: keyword || "",
                                $options: "i"
                            }
                        },
                        {
                            email: {
                                $regex: keyword || "",
                                $options: "i"
                            }
                        }
                    ]
                },
                select: "name email"
            });

        const filteredStudents = students.filter(
            student => student.user !== null
        );

        res.status(200).json({
            success: true,
            count: filteredStudents.length,
            students: filteredStudents
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ================= GET ALL COMPANIES =================

export const getAllCompanies = async (req, res) => {
    try {

        const companies = await Company.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: companies.length,
            companies
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ================= GET COMPANY BY ID =================

export const getCompanyById = async (req, res) => {
    try {

        const company = await Company.findById(req.params.id)
            .populate("user", "name email");

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        res.status(200).json({
            success: true,
            company
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ================= SEARCH COMPANIES =================

export const searchCompanies = async (req, res) => {
    try {

        const { keyword } = req.query;

        const companies = await Company.find()
            .populate({
                path: "user",
                match: {
                    $or: [
                        {
                            name: {
                                $regex: keyword || "",
                                $options: "i"
                            }
                        },
                        {
                            email: {
                                $regex: keyword || "",
                                $options: "i"
                            }
                        }
                    ]
                },
                select: "name email"
            });

        const filteredCompanies = companies.filter(
            company => company.user !== null
        );

        res.status(200).json({
            success: true,
            count: filteredCompanies.length,
            companies: filteredCompanies
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ================= VERIFY COMPANY =================

export const verifyCompany = async (req, res) => {
    try {

        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        company.isVerified = true;

        await company.save();

        res.status(200).json({
            success: true,
            message: "Company verified successfully",
            company
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ================= GET ALL JOBS =================

export const getAllJobs = async (req, res) => {
    try {

        const jobs = await Job.find()
            .populate("company", "companyName")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ================= GET JOB BY ID =================

export const getJobById = async (req, res) => {
    try {

        const job = await Job.findById(req.params.id)
            .populate("company", "companyName");

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        res.status(200).json({
            success: true,
            job
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ================= TOGGLE JOB STATUS =================

export const toggleJobStatus = async (req, res) => {
    try {

        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        job.isActive = !job.isActive;

        await job.save();

        res.status(200).json({
            success: true,
            message: `Job ${
                job.isActive ? "activated" : "deactivated"
            } successfully`,
            job
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ================= DELETE JOB =================

export const deleteJob = async (req, res) => {
    try {

        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        await job.deleteOne();

        res.status(200).json({
            success: true,
            message: "Job deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};