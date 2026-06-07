import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface BackToDashboardProps {
  className?: string
}

export function BackToDashboard({ className }: BackToDashboardProps) {
  return (
    <Link href="/dashboard">
      <Button variant="outline" className={`rounded-lg flex items-center gap-2 ${className}`}>
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>
    </Link>
  )
}
