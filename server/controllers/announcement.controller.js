import Announcement from "../models/announcement.model.js";
import Student from "../models/student.model.js";
import Notification from "../models/notification.model.js";

export const createAnnouncement = async (req, res) => {
    try {

        const { title, message } = req.body;

        if (!title || !message) {
            return res.status(400).json({
                success: false,
                message: "Title and message are required"
            });
        }

        // Create announcement
        const announcement = await Announcement.create({
            title,
            message,
            createdBy: req.user.id
        });

        // Get all students
        const students = await Student.find().select("user");

        // Create notification for every student
        if (students.length > 0) {

            const notifications = students.map((student) => ({
                user: student.user,
                title,
                message,
                type: "Announcement"
            }));

            await Notification.insertMany(notifications);
        }

        res.status(201).json({
            success: true,
            message: "Announcement created and notifications sent successfully",
            announcement,
            notificationsSent: students.length
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ================= GET ALL ANNOUNCEMENTS =================

export const getAllAnnouncements = async (req, res) => {
    try {

        const announcements = await Announcement.find()
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: announcements.length,
            announcements
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ================= GET ANNOUNCEMENT BY ID =================

export const getAnnouncementById = async (req, res) => {
    try {

        const announcement = await Announcement.findById(req.params.id)
            .populate("createdBy", "name email");

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }

        res.status(200).json({
            success: true,
            announcement
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ================= DELETE ANNOUNCEMENT =================

export const deleteAnnouncement = async (req, res) => {
    try {

        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }

        await announcement.deleteOne();

        res.status(200).json({
            success: true,
            message: "Announcement deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};