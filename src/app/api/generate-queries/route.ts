import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates variations of LinkedIn search queries. Generate queries that will find similar but different people. Vary the seniority, company size, locations, and other relevant factors. Each query should be on a new line and should not include a number prefix. Return exactly 100 variations."
        },
        {
          role: "user",
          content: `Generate 100 variations of this LinkedIn search query, maintaining the same general intent but varying factors like seniority, location, company size, etc. Do not include number prefixes. Original query: "${query}"`
        }
      ],
      temperature: 0.8,
      max_tokens: 2000
    })

    const variations = completion.choices[0].message.content
      ?.split('\n')
      .map(q => q.trim())
      .filter(q => q && !q.match(/^\d+\./)) // Remove empty lines and numbered prefixes
      || []
    
    // Ensure we have enough variations
    if (variations.length < 50) { // Reduced minimum requirement
      console.error('Not enough variations generated:', variations.length)
      return NextResponse.json({ error: 'Failed to generate enough variations' }, { status: 500 })
    }

    // Take the first 100 variations or all if less than 100
    return NextResponse.json({ queries: variations.slice(0, 100) })
  } catch (error) {
    console.error('Query generation error:', error)
    return NextResponse.json({ error: 'Failed to generate queries' }, { status: 500 })
  }
}
