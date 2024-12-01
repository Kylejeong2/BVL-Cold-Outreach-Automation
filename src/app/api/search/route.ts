import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { query } = await request.json()
    console.log('Search query:', query)

    // Call Exa AI API for LinkedIn search
    const exaResponse = await fetch('https://api.exa.ai/search/linkedin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.EXA_API_KEY!
      },
      body: JSON.stringify({
        query,
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
    
    // Process each LinkedIn profile through Apollo.io
    const enrichedData = await Promise.all(
      exaData.results.map(async (profile: any) => {
        console.log('Processing profile:', profile.url)
        
        try {
          const apolloResponse = await fetch('https://api.apollo.io/v1/mixed_people/search', {
            method: 'POST',
            headers: {
              'Cache-Control': 'no-cache',
              'Content-Type': 'application/json',
              'Api-Key': process.env.APOLLO_API_KEY!
            },
            body: JSON.stringify({
              api_key: process.env.APOLLO_API_KEY,
              q_organization_domains: [],
              page: 1,
              person_criteria: {
                linkedin_url: profile.url
              }
            })
          })

          if (!apolloResponse.ok) {
            console.error('Apollo API error:', await apolloResponse.text())
            return {
              email: 'N/A',
              linkedinUrl: profile.url,
              position: profile.title || 'N/A'
            }
          }

          const apolloData = await apolloResponse.json()
          console.log('Apollo API response for', profile.url, ':', apolloData)
          
          const person = apolloData.people?.[0]
          return {
            email: person?.email || 'N/A',
            linkedinUrl: profile.url,
            position: person?.title || profile.title || 'N/A'
          }
        } catch (error) {
          console.error('Error enriching profile:', profile.url, error)
          return {
            email: 'N/A',
            linkedinUrl: profile.url,
            position: profile.title || 'N/A'
          }
        }
      })
    )

    return NextResponse.json(enrichedData)
  } catch (error) {
    console.error('Search error:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack)
    }
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
} 