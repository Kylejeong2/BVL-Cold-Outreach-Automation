import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { query } = await request.json()
    console.log('Search query:', query)

    // Call Exa AI API for LinkedIn search
    // Example query builder
    // https://dashboard.exa.ai/playground/search?q=Best%20computer%20scientist%20working%20at%20Stanford%20&c=linkedin%20profile&filters=%7B%22type%22:%22auto%22,%22text%22:%22true%22%7D
    const exaResponse = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.EXA_API_KEY!
      },
      body: JSON.stringify({
        query,
        category: 'linkedin profile',
        useAutoprompt: true,
        max_results: 10
      })
    })

    const exaData = await exaResponse.json()
    console.log('Exa API response:', JSON.stringify(exaData, null, 2))

    if (!exaData || !exaData.results) {
      console.error('Invalid Exa API response:', exaData)
      return NextResponse.json({ error: 'Invalid response from Exa API' }, { status: 500 })
    }

    if (exaData.results.length === 0) {
      console.log('No results found for query')
      return NextResponse.json([])
    }
    
    // Process LinkedIn profiles in bulk through Apollo.io
    try {
      const apolloResponse = await fetch('https://api.apollo.io/api/v1/people/bulk_match', {
        method: 'POST',
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
          'Api-Key': process.env.APOLLO_API_KEY!
        },
        body: JSON.stringify({
          api_key: process.env.APOLLO_API_KEY,
          details: exaData.results.map((profile: any) => ({
            linkedin_url: profile.url
          }))
        })
      })

      if (!apolloResponse.ok) {
        console.error('Apollo API error:', await apolloResponse.text())
        return NextResponse.json(
          exaData.results.map((profile: any) => ({
            name: profile.author || 'N/A',
            email: 'N/A',
            linkedinUrl: profile.url,
            position: profile.title || 'N/A'
          }))
        )
      }

      const apolloData = await apolloResponse.json()
      console.log('Apollo Bulk API response:', apolloData)
      
      const enrichedData = exaData.results.map((profile: any, index: number) => {
        const match = apolloData.matches?.[index]
        return {
          name: profile.author || match?.name || 'N/A',
          email: match?.email || 'N/A',
          linkedinUrl: profile.url,
          position: match?.title || profile.title || 'N/A'
        }
      })

      return NextResponse.json(enrichedData)
    } catch (error) {
      console.error('Error in bulk enrichment:', error)
      return NextResponse.json(
        exaData.results.map((profile: any) => ({
          name: profile.author || 'N/A',
          email: 'N/A',
          linkedinUrl: profile.url,
          position: profile.title || 'N/A'
        }))
      )
    }
  } catch (error) {
    console.error('Search error:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack)
    }
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
} 