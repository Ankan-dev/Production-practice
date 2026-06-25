import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { config } from "../config";
import { asyncHandler } from "../utils/asyncHandler";
import { clearAuthCookie, setAuthCookie } from "../utils/authCookie";

const router = Router();

function createToken(userId: string) {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: "7d" });
}

router.post("/register", asyncHandler(async (request, response) => {
  const { name, email, password } = request.body;

  if (!name || !email || !password) {
    return response.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return response.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  const token = createToken(user.id);
  setAuthCookie(response, token);

  return response.status(201).json({
    user: { id: user.id, name: user.name, email: user.email }
  });
}));

router.post("/login", asyncHandler(async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return response.status(400).json({ message: "Invalid credentials" });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return response.status(400).json({ message: "Invalid credentials" });
  }

  const token = createToken(user._id.toString());
  setAuthCookie(response, token);

  return response.json({
    user: { id: user._id, name: user.name, email: user.email }
  });
}));

router.post("/logout", asyncHandler(async (_request, response) => {
  clearAuthCookie(response);
  return response.json({ message: "Logged out" });
}));

router.get("/me", asyncHandler(async (request, response) => {
  const token = request.cookies?.token;

  if (!token) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  const payload = jwt.verify(token, config.jwtSecret) as { userId: string };
  const user = await User.findById(payload.userId).select("name email");

  if (!user) {
    clearAuthCookie(response);
    return response.status(401).json({ message: "Unauthorized" });
  }

  return response.json({
    user: { id: user.id, name: user.name, email: user.email }
  });
}));

export default router;
