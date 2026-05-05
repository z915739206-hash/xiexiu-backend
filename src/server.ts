import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, "../.env") })

import authRouter from "./routes/auth.js"
import ingredientsRouter from "./routes/ingredients.js"
import recipesRouter from "./routes/recipes.js"
import scanRouter from "./routes/scan.js"
import shoppingRouter from "./routes/shopping.js"

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: "*" }))
app.use(express.json({ limit: "10mb" }))
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

app.get("/health", (_req, res) => res.json({ status: "ok", time: new Date().toISOString() }))

app.use("/api/auth", authRouter)
app.use("/api/ingredients", ingredientsRouter)
app.use("/api/recipes", recipesRouter)
app.use("/api/scan", scanRouter)
app.use("/api/shopping", shoppingRouter)

app.listen(PORT, () => {
  console.log(`🚀 XieXiu API server running on http://localhost:${PORT}`)
})
