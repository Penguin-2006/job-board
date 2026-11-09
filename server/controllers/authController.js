import jwt from "jsonwebtoken";
import User from "../models/User.js";
import handleError from "../utils/handleError.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  token: generateToken(user._id)
});

export const register = async (req, res) => {
  const { name, email, password, role, company } = req.body || {};

  try {
    if (![name, email, password].every((v) => typeof v === "string" && v.trim())) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (name.trim().length > 80) {
      return res.status(400).json({ message: "Name must be at most 80 characters" });
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
    }
    if (password.length > MAX_PASSWORD_LENGTH) {
      return res.status(400).json({ message: `Password must be at most ${MAX_PASSWORD_LENGTH} characters` });
    }
    if (!["applicant", "company"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    if (role === "company" && !(typeof company === "string" && company.trim())) {
      return res.status(400).json({ message: "Company name is required" });
    }
    if (role === "company" && company.trim().length > 100) {
      return res.status(400).json({ message: "Company name must be at most 100 characters" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      role,
      company: role === "company" ? company.trim() : ""
    });

    res.status(201).json(userResponse(user));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }
    handleError(res, error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body || {};

  try {
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json(userResponse(user));
  } catch (error) {
    handleError(res, error);
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};