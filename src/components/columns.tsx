"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export type Lead = {
  name: string
  email: string
  linkedinUrl: string
  position: string
}

const LoadingCell = () => (
  <div className="flex items-center space-x-2">
    <Skeleton className="h-4 w-[250px]" />
  </div>
)

export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const value = row.getValue("name") as string
      return value === 'N/A' ? <LoadingCell /> : value
    }
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const value = row.getValue("email") as string
      return value === 'N/A' ? <LoadingCell /> : value
    }
  },
  {
    accessorKey: "position",
    header: "Position",
    cell: ({ row }) => {
      const value = row.getValue("position") as string
      return value === 'N/A' ? <LoadingCell /> : value
    }
  },
  {
    accessorKey: "linkedinUrl",
    header: "LinkedIn Profile",
    cell: ({ row }) => {
      const url = row.getValue("linkedinUrl") as string
      return (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className={cn(
            "text-blue-600 hover:underline",
            url === 'N/A' && "pointer-events-none opacity-50"
          )}
        >
          {url === 'N/A' ? <LoadingCell /> : 'View Profile'}
        </a>
      )
    }
  },
] 