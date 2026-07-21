import Company from "../models/company.model.js";

export const getCompanies = async (req, res) => {
    try {

        const companies = await Company.find().select(
            "companyName industry location logo isVerified"
        );

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

export const getCompanyById = async (req, res) => {
    try {

        const company = await Company.findById(req.params.id);

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

export const searchCompanies = async (req, res) => {
    try {

        const { keyword } = req.query;

        const companies = await Company.find({
            companyName: {
                $regex: keyword || "",
                $options: "i"
            }
        });

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

export const getApplicationStatus = async (req, res) => {
    try {

        const student = await Student.findOne({
            user: req.user.id
        });

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