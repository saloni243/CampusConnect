import Company from "../models/company.model.js";
import User from "../models/user.model.js";
import Student from "../models/student.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Automatically create student profile
    if (role === "student") {
      await Student.create({
        user: user._id,
      });
    }

    if (role === "company") {
  await Company.create({
    user: user._id,
    companyName: name
  });
}

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const userResponse = {
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
};

res.status(201).json({
  success: true,
  message: "Registration successful",
  token,
  user: userResponse,
});
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

const userResponse = {
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
};

res.status(200).json({
  success: true,
  message: "Login successful",
  token,
  user: userResponse,
});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};