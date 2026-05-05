import { Router } from "express"
import { z } from "zod"
import { prisma } from "../lib/prisma.js"
import { authMiddleware, type AuthRequest } from "../middleware/auth.js"

const router = Router()
router.use(authMiddleware)

const createSchema = z.object({
  name: z.string().min(1),
  qty: z.string().min(1),
  source: z.string().optional(),
})

// List
router.get("/", async (req: AuthRequest, res) => {
  const items = await prisma.shoppingItem.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
  })
  res.json(items)
})

// Create
router.post("/", async (req: AuthRequest, res) => {
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" })
    return
  }

  const item = await prisma.shoppingItem.create({
    data: { ...parsed.data, userId: req.userId! },
  })
  res.status(201).json(item)
})

// Toggle checked
router.patch("/:id", async (req: AuthRequest, res) => {
  const existing = await prisma.shoppingItem.findFirst({
    where: { id: req.params.id, userId: req.userId },
  })
  if (!existing) {
    res.status(404).json({ error: "Not found" })
    return
  }

  const item = await prisma.shoppingItem.update({
    where: { id: req.params.id },
    data: { checked: !existing.checked },
  })
  res.json(item)
})

// Delete
router.delete("/:id", async (req: AuthRequest, res) => {
  const existing = await prisma.shoppingItem.findFirst({
    where: { id: req.params.id, userId: req.userId },
  })
  if (!existing) {
    res.status(404).json({ error: "Not found" })
    return
  }

  await prisma.shoppingItem.delete({ where: { id: req.params.id } })
  res.json({ success: true })
})

export default router
