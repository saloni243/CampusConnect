import Student from "../models/student.model.js";
import Job from "../models/job.model.js";
import Company from "../models/company.model.js";


export const createJob = async (req, res) => {
    try {

        const {
            title,
            description,
            location,
            jobType,
            package: packageLPA,
            skills,
            eligibleBranches,
            minimumCGPA,
            batch,
            lastDate
        } = req.body;

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

        // Check if company is verified
if (!company.isVerified) {
    return res.status(403).json({
        success: false,
        message: "Your company is not verified yet. Please wait for admin approval."
    });
}

        // Create Job
        const job = await Job.create({
            company: company._id,
            title,
            description,
            location,
            jobType,
            package: packageLPA,
            skills,
            eligibleBranches,
            minimumCGPA,
            batch,
            lastDate
        });

        res.status(201).json({
            success: true,
            message: "Job created successfully",
            job
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getJobs = async (req, res) => {
    try {

        const jobs = await Job.find({
            isActive: true
        }).populate(
            "company",
            "companyName location logo"
        );

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

export const searchJobs = async (req, res) => {
    try {

        const { keyword } = req.query;

        const jobs = await Job.find({
            title: {
                $regex: keyword || "",
                $options: "i"
            },
            isActive: true
        }).populate("company", "companyName");

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

export const filterJobs = async (req, res) => {
    try {

        const { location, minPackage, batch, branch } = req.query;

        let filter = {
            isActive: true
        };

        if (location) {
            filter.location = location;
        }

        if (minPackage) {
            filter.package = { $gte: Number(minPackage) };
        }

        if (batch) {
            filter.batch = Number(batch);
        }

        if (branch) {
            filter.eligibleBranches = branch;
        }

        const jobs = await Job.find(filter)
            .populate("company", "companyName");

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

export const getJobById = async (req, res) => {
    try {

        const job = await Job.findById(req.params.id)
            .populate(
                "company",
                "companyName description website location logo"
            );

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

export const saveJob = async (req, res) => {
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

        if (student.savedJobs.includes(job._id)) {
            return res.status(400).json({
                success: false,
                message: "Job already saved"
            });
        }

        student.savedJobs.push(job._id);

        await student.save();

        res.status(200).json({
            success: true,
            message: "Job saved successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getSavedJobs = async (req, res) => {
    try {

        const student = await Student.findOne({
            user: req.user.id
        }).populate({
            path: "savedJobs",
            populate: {
                path: "company",
                select: "companyName"
            }
        });

        res.status(200).json({
            success: true,
            count: student.savedJobs.length,
            jobs: student.savedJobs
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const removeSavedJob = async (req, res) => {
    try {

        const student = await Student.findOne({
            user: req.user.id
        });

        student.savedJobs = student.savedJobs.filter(
            job => job.toString() !== req.params.jobId
        );

        await student.save();

        res.status(200).json({
            success: true,
            message: "Saved job removed"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get Logged-in Company's Jobs
export const getCompanyJobs = async (req, res) => {
    try {

        // Find company profile
        const company = await Company.findOne({
            user: req.user.id
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found"
            });
        }

        // Find jobs posted by this company
        const jobs = await Job.find({
            company: company._id
        }).sort({ createdAt: -1 });

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

// Update Job
export const updateJob = async (req, res) => {
    try {

        const company = await Company.findOne({
            user: req.user.id
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found"
            });
        }

        const job = await Job.findOne({
            _id: req.params.id,
            company: company._id
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        const {
            title,
            description,
            location,
            jobType,
            package: packageLPA,
            skills,
            eligibleBranches,
            minimumCGPA,
            batch,
            lastDate,
            isActive
        } = req.body;

        job.title = title ?? job.title;
        job.description = description ?? job.description;
        job.location = location ?? job.location;
        job.jobType = jobType ?? job.jobType;
        job.package = packageLPA ?? job.package;
        job.skills = skills ?? job.skills;
        job.eligibleBranches = eligibleBranches ?? job.eligibleBranches;
        job.minimumCGPA = minimumCGPA ?? job.minimumCGPA;
        job.batch = batch ?? job.batch;
        job.lastDate = lastDate ?? job.lastDate;
        job.isActive = isActive ?? job.isActive;

        await job.save();

        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Delete Job
export const deleteJob = async (req, res) => {
    try {

        const company = await Company.findOne({
            user: req.user.id
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found"
            });
        }

        const job = await Job.findOne({
            _id: req.params.id,
            company: company._id
        });

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