"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Lead = {
  email: string
  linkedinUrl: string
  position: string
}

export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "linkedinUrl",
    header: "LinkedIn Profile URL",
    cell: ({ row }: { row: any }) => {
      const url = row.getValue("linkedinUrl") as string
      return (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {url}
        </a>
      )
    }
  },
  {
    accessorKey: "position",
    header: "Position",
  },
] 