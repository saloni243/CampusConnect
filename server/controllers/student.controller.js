import  Student  from "../models/student.model.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const getProfile = async (req, res) => {
    try {

        const student = await Student.findOne({
            user: req.user.id
        }).populate("user", "-password");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found"
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

// Update Profile
export const updateProfile = async (req, res) => {
    try {

        const student = await Student.findOne({
            user: req.user.id
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found"
            });
        }

        const {
            prn,
            rollNumber,
            branch,
            year,
            cgpa,
            phone,
            address,
            linkedin,
            github,
            portfolio,
            skills
        } = req.body;

        student.prn = prn ?? student.prn;
        student.rollNumber = rollNumber ?? student.rollNumber;
        student.branch = branch ?? student.branch;
        student.year = year ?? student.year;
        student.cgpa = cgpa ?? student.cgpa;
        student.phone = phone ?? student.phone;
        student.address = address ?? student.address;
        student.linkedin = linkedin ?? student.linkedin;
        student.github = github ?? student.github;
        student.portfolio = portfolio ?? student.portfolio;
        student.skills = skills ?? student.skills;
        console.log(req.file);
        await student.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            student
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const uploadResume = async (req, res) => {
    try {

        const student = await Student.findOne({
            user: req.user.id
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF resume"
            });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "raw",
            folder: "CampusConnect/resumes"
        });

        // Delete local temporary file
        fs.unlinkSync(req.file.path);

        student.resume = {
            url: result.secure_url,
            public_id: result.public_id
        };

        await student.save();

        res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            resume: student.resume
        });

    } catch (error) {

    console.log("========== ERROR ==========");
    console.log(error);
    console.log("===========================");

    res.status(500).json({
        success: false,
        message: error.message
    });
}
};

export const uploadProfilePic = async (req, res) => {
  res.json({
    success: true,
    message: "Profile picture uploaded successfully",
    file: req.file,
  });
};

