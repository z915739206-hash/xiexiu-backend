import { Router } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { z } from "zod"
import { prisma } from "../lib/prisma.js"
import { authMiddleware, type AuthRequest } from "../middleware/auth.js"

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || "xiexiu-super-secret-key-change-in-production"

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// Register
router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() })
    return
  }

  const { email, password, name } = parsed.data
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    res.status(409).json({ error: "Email already registered" })
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email, passwordHash, name: name || email.split("@")[0] },
    select: { id: true, email: true, name: true, createdAt: true },
  })

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "30d" })
  res.status(201).json({ user, token })
})

// Login
router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" })
    return
  }

  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" })
    return
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" })
    return
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "30d" })
  res.json({
    user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
    token,
  })
})

// Get me
router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, email: true, name: true, avatar: true, createdAt: true },
  })
  if (!user) {
    res.status(404).json({ error: "User not found" })
    return
  }
  res.json(user)
})

// Delete account (App Store requirement)
router.delete("/account", authMiddleware, async (req: AuthRequest, res) => {
  await prisma.user.delete({ where: { id: req.userId! } })
  res.json({ success: true })
})

export default router
