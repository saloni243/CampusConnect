import Company from "../models/company.model.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import deleteFile from "../utils/deleteFile.js";

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

export const getCompanyProfile = async (req, res) => {
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

export const updateCompanyProfile = async (req, res) => {
    try {

        const {
            companyName,
            description,
            website,
            industry,
            location
        } = req.body;

        const company = await Company.findOne({
            user: req.user.id
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found"
            });
        }

        company.companyName = companyName || company.companyName;
        company.description = description || company.description;
        company.website = website || company.website;
        company.industry = industry || company.industry;
        company.location = location || company.location;

        await company.save();

        res.status(200).json({
            success: true,
            message: "Company profile updated successfully",
            company
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const uploadCompanyLogo = async (req, res) => {
    try {

        const company = await Company.findOne({
            user: req.user.id
        });

        if (!company) {
            if (req.file) {
                deleteFile(req.file.path);
            }

            return res.status(404).json({
                success: false,
                message: "Company profile not found"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a logo"
            });
        }

        const result = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: "CampusConnect/CompanyLogo"
            }
        );

        deleteFile(req.file.path);

        company.logo = {
            filename: result.public_id,
            path: result.secure_url,
            url: result.secure_url
        };

        await company.save();

        res.status(200).json({
            success: true,
            message: "Company logo uploaded successfully",
            logo: company.logo
        });

    } catch (error) {

    console.log("===== CLOUDINARY ERROR =====");
    console.log(error);

    if (req.file) {
        deleteFile(req.file.path);
    }

    res.status(500).json({
        success: false,
        message: error.message
    });

}
};