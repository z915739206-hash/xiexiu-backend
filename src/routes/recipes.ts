import { Router } from "express"
import { prisma } from "../lib/prisma.js"
import { authMiddleware, type AuthRequest } from "../middleware/auth.js"

const router = Router()

// Public: list all recipes (with auth optional for save status)
router.get("/", async (req: AuthRequest, res) => {
  const recipes = await prisma.recipe.findMany({
    include: {
      tricks: true,
      steps: { orderBy: { order: "asc" } },
      uses: true,
      saves: req.userId ? { where: { userId: req.userId } } : false,
    },
    orderBy: { createdAt: "desc" },
  })
  res.json(recipes)
})

// Get single recipe
router.get("/:id", async (req: AuthRequest, res) => {
  const recipe = await prisma.recipe.findUnique({
    where: { id: req.params.id },
    include: {
      tricks: true,
      steps: { orderBy: { order: "asc" } },
      uses: true,
      saves: req.userId ? { where: { userId: req.userId } } : false,
    },
  })
  if (!recipe) {
    res.status(404).json({ error: "Recipe not found" })
    return
  }
  res.json(recipe)
})

// Recommend based on user's ingredients
router.get("/recommend/mine", authMiddleware, async (req: AuthRequest, res) => {
  const [ingredients, recipes] = await Promise.all([
    prisma.ingredient.findMany({ where: { userId: req.userId } }),
    prisma.recipe.findMany({
      include: {
        tricks: true,
        steps: { orderBy: { order: "asc" } },
        uses: true,
      },
    }),
  ])

  const userIngNames = new Set(ingredients.map((i) => i.nameEn.toLowerCase()))

  const scored = recipes.map((r) => {
    const matched = r.uses.filter((u) => userIngNames.has(u.nameEn.toLowerCase()))
    const expiring = ingredients.filter(
      (i) =>
        matched.some((m) => m.nameEn.toLowerCase() === i.nameEn.toLowerCase()) &&
        new Date(i.expiryDate).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000
    )
    return {
      ...r,
      matchCount: matched.length,
      totalNeeded: r.uses.length,
      expiringBonus: expiring.length * 2,
      score: matched.length + expiring.length * 2 - r.uses.length * 0.3,
    }
  })

  scored.sort((a, b) => b.score - a.score)
  res.json(scored)
})

// Toggle save
router.post("/:id/save", authMiddleware, async (req: AuthRequest, res) => {
  const existing = await prisma.savedRecipe.findUnique({
    where: { userId_recipeId: { userId: req.userId!, recipeId: req.params.id } },
  })

  if (existing) {
    await prisma.savedRecipe.delete({ where: { id: existing.id } })
    res.json({ saved: false })
  } else {
    await prisma.savedRecipe.create({
      data: { userId: req.userId!, recipeId: req.params.id },
    })
    res.json({ saved: true })
  }
})

export default router
