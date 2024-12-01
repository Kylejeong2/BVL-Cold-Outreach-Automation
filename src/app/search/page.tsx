'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import { columns } from "@/components/columns"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function Search() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setData([]) // Clear previous results
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
      ['Name', 'Email', 'LinkedIn Profile URL', 'Position'],
      ...data.map(row => [row.name, row.email, row.linkedinUrl, row.position])
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
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-8 mb-8"
      >
        <div className="flex items-center justify-between">
          <motion.h1 
            className="text-3xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Exa X Apollo Lead Generation Tool
          </motion.h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                placeholder="Enter LinkedIn search query..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-96"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={loading || !query.trim()}
              className="min-w-[100px] relative"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching...
                </span>
              ) : (
                'Search'
              )}
            </Button>
            <Button 
              onClick={handleExport} 
              disabled={data.length === 0}
              variant="outline"
            >
              Export CSV
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground animate-pulse">
                  Searching and enriching profiles...
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <DataTable columns={columns} data={data} />
        )}
      </motion.div>
    </div>
  )
} 