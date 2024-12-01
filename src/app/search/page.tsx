'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import { columns } from "@/components/columns"

export default function ToolPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() })
      })
      const results = await response.json()
      setData(results)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
    setLoading(false)
  }

  const handleExport = () => {
    const csvContent = [
      ['Email', 'LinkedIn Profile URL', 'Position'],
      ...data.map(row => [row.email, row.linkedinUrl, row.position])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'leads.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Lead Generation Tool</h1>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Enter LinkedIn search query..."
            value={query}
            onChange={(e: any) => setQuery(e.target.value)}
            className="w-96"
            onKeyDown={(e: any) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading || !query.trim()}>
            {loading ? 'Searching...' : 'Run Search'}
          </Button>
          <Button onClick={handleExport} disabled={data.length === 0}>
            Export CSV
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
} 