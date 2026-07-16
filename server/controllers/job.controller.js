import Job from "../models/job.model.js";

export const createJob = async (req, res) => {
  try {
    const { title, description, location, salary } = req.body;

    const job = await Job.create({
      title,
      description,
      location,
      salary,
      company: req.user._id
    });

    res.status(201).json({ message: "Job created", job });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};