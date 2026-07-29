import Anthropic from '@anthropic-ai/sdk'

const THEMES = [
  'habit_reorder','price_perception','quality_trust','discovery_friction',
  'app_clutter','delivery_experience','mission_shopping','assortment_gap',
  'service_issue','other',
]

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { reviews } = req.body
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return res.status(400).json({ error: 'No reviews provided' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

  const client = new Anthropic({ apiKey })
  const lines = reviews.slice(0, 30)
  const numbered = lines.map((t, i) => `${i}. ${t.slice(0, 400)}`).join('\n')

  const system = `You are tagging user feedback for a quick commerce product team. For each numbered review, return one JSON object. Fields: id (the review number), theme (one of ${JSON.stringify(THEMES)}), sentiment (positive, neutral, or negative), discovery_flag (yes if the review touches on discovering, trying, hesitating about, or avoiding new products or categories, else no). Return ONLY a JSON array. No markdown, no commentary.`

  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 2000,
      system,
      messages: [{ role: 'user', content: numbered }],
    })

    let raw = msg.content[0].text.replace(/```json/g, '').replace(/```/g, '').trim()
    const tags = JSON.parse(raw)
    return res.status(200).json({ tags, count: lines.length })
  } catch (err) {
    console.error('Classification error:', err)
    return res.status(500).json({ error: err.message || 'Classification failed' })
  }
}
