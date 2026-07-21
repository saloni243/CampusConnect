import fs from "fs";
import { calculateProfileCompletion } from "../utils/profileCompletion.js";
import { profileUpload } from "../middleware/profileUpload.middleware.js";
import  Student  from "../models/student.model.js";
import path from "path";


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
        student.profileCompletion = calculateProfileCompletion(student);
        student.profileCompleted = student.profileCompletion === 100;
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

        student.resume = {
            filename: req.file.filename,
            path: req.file.path,
            url: `/uploads/resumes/${req.file.filename}`
        };

        student.profileCompletion = calculateProfileCompletion(student);
        student.profileCompleted = student.profileCompletion === 100;

        await student.save();

        res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            resume: student.resume
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const replaceResume = async (req, res) => {
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

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a resume"
            });
        }

        // Delete old resume if it exists
        if (
            student.resume?.path &&
            fs.existsSync(student.resume.path)
        ) {
            fs.unlinkSync(student.resume.path);
        }

        student.resume = {
            filename: req.file.filename,
            path: req.file.path,
            url: `/uploads/resumes/${req.file.filename}`
        };

        await student.save();

        res.status(200).json({
            success: true,
            message: "Resume replaced successfully",
            resume: student.resume
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const deleteResume = async (req, res) => {
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

        if (!student.resume?.path) {
            return res.status(400).json({
                success: false,
                message: "No resume found"
            });
        }

        if (fs.existsSync(student.resume.path)) {
            fs.unlinkSync(student.resume.path);
        }

        student.resume = {
            filename: "",
            path: "",
            url: ""
        };

        student.profileCompletion = calculateProfileCompletion(student);
        student.profileCompleted = student.profileCompletion === 100;

        await student.save();

        res.status(200).json({
            success: true,
            message: "Resume deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const previewResume = async (req, res) => {
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

        if (!student.resume?.url) {
            return res.status(404).json({
                success: false,
                message: "Resume not uploaded"
            });
        }

        res.status(200).json({
            success: true,
            resume: student.resume
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const downloadResume = async (req, res) => {
    try {

        const student = await Student.findOne({
            user: req.user.id
        });

        if (!student || !student.resume?.path) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        return res.download(path.resolve(student.resume.path));

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const uploadProfilePic = async (req, res) => {
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

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image"
            });
        }

        student.profilePicture = {
            filename: req.file.filename,
            path: req.file.path,
            url: `/uploads/profiles/${req.file.filename}`
        };

        student.profileCompletion = calculateProfileCompletion(student);
        student.profileCompleted = student.profileCompletion === 100;

        await student.save();

        res.status(200).json({
            success: true,
            message: "Profile picture uploaded successfully",
            profilePicture: student.profilePicture
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const replaceProfilePic = async (req, res) => {
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

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image"
            });
        }

        // Delete old image
        if (
            student.profilePicture?.path &&
            fs.existsSync(student.profilePicture.path)
        ) {
            fs.unlinkSync(student.profilePicture.path);
        }

        student.profilePicture = {
            filename: req.file.filename,
            path: req.file.path,
            url: `/uploads/profiles/${req.file.filename}`
        };

        student.profileCompletion = calculateProfileCompletion(student);
        student.profileCompleted =
            student.profileCompletion === 100;

        await student.save();

        res.status(200).json({
            success: true,
            message: "Profile picture replaced successfully",
            profilePicture: student.profilePicture
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteProfilePic = async (req, res) => {
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

        if (!student.profilePicture?.path) {
            return res.status(400).json({
                success: false,
                message: "Profile picture not found"
            });
        }

        if (fs.existsSync(student.profilePicture.path)) {
            fs.unlinkSync(student.profilePicture.path);
        }

        student.profilePicture = {
            filename: "",
            path: "",
            url: ""
        };

        student.profileCompletion = calculateProfileCompletion(student);
        student.profileCompleted = student.profileCompletion === 100;

        await student.save();

        res.status(200).json({
            success: true,
            message: "Profile picture deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const addSkill = async (req, res) => {
    try {

        const { skill } = req.body;

        if (!skill) {
            return res.status(400).json({
                success: false,
                message: "Skill is required"
            });
        }

        const student = await Student.findOne({
            user: req.user.id
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const exists = student.skills.some(
            s => s.toLowerCase() === skill.toLowerCase()
        );

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Skill already exists"
            });
        }

        student.skills.push(skill);

        student.profileCompletion = calculateProfileCompletion(student);
        student.profileCompleted = student.profileCompletion === 100;

        await student.save();

        res.status(200).json({
            success: true,
            message: "Skill added successfully",
            skills: student.skills
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getSkills = async (req, res) => {
    try {

        const student = await Student.findOne({
            user: req.user.id
        }).select("skills");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            skills: student.skills
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const updateSkill = async (req, res) => {
    try {

        const { skill } = req.body;
        const index = parseInt(req.params.index);

        const student = await Student.findOne({
            user: req.user.id
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        if (isNaN(index) || index < 0 || index >= student.skills.length) {
            return res.status(404).json({
                success: false,
                message: "Skill not found"
            });
        }

        student.skills[index] = skill;

        await student.save();

        res.status(200).json({
            success: true,
            message: "Skill updated successfully",
            skills: student.skills
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const deleteSkill = async (req, res) => {
    try {

        const index = parseInt(req.params.index);

        const student = await Student.findOne({
            user: req.user.id
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        if (isNaN(index) || index < 0 || index >= student.skills.length) {
            return res.status(404).json({
                success: false,
                message: "Skill not found"
            });
        }

        student.skills.splice(index, 1);

        student.profileCompletion = calculateProfileCompletion(student);
        student.profileCompleted = student.profileCompletion === 100;

        await student.save();

        res.status(200).json({
            success: true,
            message: "Skill deleted successfully",
            skills: student.skills
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
