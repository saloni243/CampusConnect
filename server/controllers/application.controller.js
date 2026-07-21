import  Application from "../models/application.model.js";
import  Student  from "../models/student.model.js";
import  Job  from "../models/job.model.js";

// APPLY JOB
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

export const getMyApplications = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });

    const applications = await Application.find({
      student: student._id
    })
      .populate({
        path: "job",
        populate: {
          path: "company"
        }
      })
      .sort({ createdAt: -1 });

    res.json(applications);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const applications = await Application.find({ job: jobId })
      .populate({
        path: "student",
        populate: { path: "user", select: "name email" }
      });

    res.json(applications);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId, status } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;

    await application.save();

    res.json({
      message: "Status updated",
      application
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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