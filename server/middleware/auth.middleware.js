
import jwt from "jsonwebtoken";


export const protect = (req, res, next) => {
    // token verify logic
    next();
};

export const isCompany = (req, res, next) => {
    if (req.user.role !== "company") {
        return res.status(403).json({
            success: false,
            message: "Only company allowed"
        });
    }
    next();
};

