import { Router } from "express"
import { z } from "zod"
import { prisma } from "../lib/prisma.js"
import { authMiddleware, type AuthRequest } from "../middleware/auth.js"

const router = Router()
router.use(authMiddleware)

const createSchema = z.object({
  nameEn: z.string().min(1),
  nameZh: z.string().min(1),
  emoji: z.string().optional(),
  color: z.string().optional(),
  category: z.enum(["veg", "meat", "dairy", "pantry"]),
  location: z.enum(["Fridge", "Freezer", "Pantry"]),
  qty: z.string().min(1),
  expiryDate: z.string().datetime(),
})

// List
router.get("/", async (req: AuthRequest, res) => {
  const items = await prisma.ingredient.findMany({
    where: { userId: req.userId },
    orderBy: { expiryDate: "asc" },
  })
  res.json(items)
})

// Create
router.post("/", async (req: AuthRequest, res) => {
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() })
    return
  }

  const item = await prisma.ingredient.create({
    data: { ...parsed.data, userId: req.userId! },
  })
  res.status(201).json(item)
})

// Update
router.put("/:id", async (req: AuthRequest, res) => {
  const { id } = req.params
  const existing = await prisma.ingredient.findFirst({ where: { id, userId: req.userId } })
  if (!existing) {
    res.status(404).json({ error: "Not found" })
    return
  }

  const parsed = createSchema.partial().safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" })
    return
  }

  const item = await prisma.ingredient.update({
    where: { id },
    data: parsed.data,
  })
  res.json(item)
})

// Delete
router.delete("/:id", async (req: AuthRequest, res) => {
  const { id } = req.params
  const existing = await prisma.ingredient.findFirst({ where: { id, userId: req.userId } })
  if (!existing) {
    res.status(404).json({ error: "Not found" })
    return
  }

  await prisma.ingredient.delete({ where: { id } })
  res.json({ success: true })
})

export default router
