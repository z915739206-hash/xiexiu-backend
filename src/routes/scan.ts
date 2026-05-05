import { Router } from "express"
import { authMiddleware, type AuthRequest } from "../middleware/auth.js"
import { recognizeFood } from "../lib/ai.js"

const router = Router()
router.use(authMiddleware)

// Scan image (base64)
router.post("/", async (req: AuthRequest, res) => {
  const { imageBase64 } = req.body
  if (!imageBase64 || typeof imageBase64 !== "string") {
    res.status(400).json({ error: "imageBase64 required" })
    return
  }

  try {
    const result = await recognizeFood(imageBase64)
    res.json(result)
  } catch (err: any) {
    console.error("Scan error:", err)
    res.status(500).json({ error: "Recognition failed", message: err.message })
  }
})

export default router
