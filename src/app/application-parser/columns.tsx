import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { ApplicationStatus } from "@/lib/types/application"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const statusVariants: Record<ApplicationStatus, "default" | "destructive" | "outline" | "secondary"> = {
  ACCEPT: "default",
  REJECT: "destructive",
  MAYBE: "secondary",
  NEEDS_REVIEW: "outline",
};

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "candidateName",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "timestamp",
    header: "Submitted",
    cell: ({ row }) => {
      return new Date(row.getValue("timestamp")).toLocaleString()
    },
  },
  {
    accessorKey: "finalStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("finalStatus") as ApplicationStatus
      return (
        <Badge variant={statusVariants[status]}>
          {status.replace("_", " ")}
        </Badge>
      )
    },
  },
  {
    accessorKey: "needsManualReview",
    header: "Needs Review",
    cell: ({ row }) => {
      return row.getValue("needsManualReview") ? (
        <Badge variant="destructive">Yes</Badge>
      ) : (
        <Badge variant="secondary">No</Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const application = row.original
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">First Analysis</h3>
                <div className="text-sm">
                  <p><strong>Status:</strong> {application.firstAnalysis.status}</p>
                  <p><strong>Confidence:</strong> {Math.round(application.firstAnalysis.confidence * 100)}%</p>
                  <p><strong>Reasoning:</strong> {application.firstAnalysis.reasoning}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Second Analysis</h3>
                <div className="text-sm">
                  <p><strong>Status:</strong> {application.secondAnalysis.status}</p>
                  <p><strong>Confidence:</strong> {Math.round(application.secondAnalysis.confidence * 100)}%</p>
                  <p><strong>Reasoning:</strong> {application.secondAnalysis.reasoning}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Responses</h3>
                <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto">
                  {JSON.stringify(application.responses, null, 2)}
                </pre>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )
    },
  },
] 