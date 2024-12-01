import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">BVL Automation Tool</h1>
      <p className="text-lg mb-8 text-gray-600">
        LinkedIn lead generation tool powered by Exa AI and Apollo.io
      </p>
      <Link href="/search">
        <Button size="lg">
          Access Tool
        </Button>
      </Link>
    </main>
  )
}
