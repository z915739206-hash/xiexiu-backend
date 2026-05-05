// AI Food Recognition - 阿里云通义千问 VL / DashScope
// 文档: https://help.aliyun.com/zh/dashscope/developer-reference/tongyi-qianwen-vl-plus

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || ""
const DASHSCOPE_URL = "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation"

export interface DetectedItem {
  name: string
  nameZh: string
  emoji: string
  category: "veg" | "meat" | "dairy" | "pantry"
  estimatedExpiryDays: number
  confidence: number
}

export interface ScanResult {
  items: DetectedItem[]
  rawResponse?: string
}

const CATEGORY_MAP: Record<string, "veg" | "meat" | "dairy" | "pantry"> = {
  vegetable: "veg",
  fruit: "veg",
  meat: "meat",
  seafood: "meat",
  dairy: "dairy",
  egg: "dairy",
  grain: "pantry",
  condiment: "pantry",
  sauce: "pantry",
  other: "pantry",
}

const EMOJI_MAP: Record<string, string> = {
  tomato: "🍅", egg: "🥚", spinach: "🥬", tofu: "⬜", pork: "🥩", shrimp: "🦐",
  scallion: "🌿", garlic: "🧄", soy: "🫙", rice: "🍚", noodle: "🍜", milk: "🥛",
  carrot: "🥕", bokchoy: "🥬", chicken: "🍗", beef: "🥩", fish: "🐟", onion: "🧅",
  potato: "🥔", pepper: "🫑", cucumber: "🥒", corn: "🌽", mushroom: "🍄",
  apple: "🍎", banana: "🍌", orange: "🍊", lemon: "🍋", grape: "🍇",
}

function getEmoji(name: string): string {
  const key = name.toLowerCase().replace(/\s+/g, "")
  return EMOJI_MAP[key] || "🍽️"
}

export async function recognizeFood(imageBase64: string): Promise<ScanResult> {
  if (!DASHSCOPE_API_KEY) {
    // Fallback: simulate detection for development without API key
    console.warn("DASHSCOPE_API_KEY not set, returning simulated result")
    return {
      items: [
        { name: "Bok Choy", nameZh: "小白菜", emoji: "🥬", category: "veg", estimatedExpiryDays: 5, confidence: 0.92 },
        { name: "Carrot", nameZh: "胡萝卜", emoji: "🥕", category: "veg", estimatedExpiryDays: 12, confidence: 0.88 },
        { name: "Tomato", nameZh: "番茄", emoji: "🍅", category: "veg", estimatedExpiryDays: 4, confidence: 0.95 },
      ],
    }
  }

  const prompt = `Analyze this food image. Identify each visible food ingredient.
Return ONLY a JSON array in this exact format (no markdown, no explanation):
[
  {"name": "English name", "nameZh": "中文名", "category": "vegetable|fruit|meat|seafood|dairy|egg|grain|condiment|other", "estimatedExpiryDays": number, "confidence": 0.0-1.0}
]`

  const response = await fetch(DASHSCOPE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DASHSCOPE_API_KEY}`,
    },
    body: JSON.stringify({
      model: "qwen-vl-plus",
      input: {
        messages: [
          {
            role: "user",
            content: [
              { image: imageBase64 },
              { text: prompt },
            ],
          },
        ],
      },
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`DashScope error ${response.status}: ${text}`)
  }

  const data = await response.json()
  const content = data.output?.choices?.[0]?.message?.content || ""

  let items: any[] = []
  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      items = JSON.parse(jsonMatch[0])
    }
  } catch {
    console.warn("Failed to parse AI response:", content)
  }

  const detected: DetectedItem[] = items.map((it: any) => ({
    name: it.name || "Unknown",
    nameZh: it.nameZh || it.name || "未知",
    emoji: getEmoji(it.name),
    category: CATEGORY_MAP[it.category?.toLowerCase()] || "pantry",
    estimatedExpiryDays: Math.max(1, Math.min(180, Math.round(it.estimatedExpiryDays || 7))),
    confidence: Math.max(0, Math.min(1, it.confidence || 0.8)),
  }))

  return { items: detected, rawResponse: content }
}
