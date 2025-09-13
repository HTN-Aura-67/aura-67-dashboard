import { Badge } from "@/components/ui/badge"

interface StatusPillProps {
  status: "disconnected" | "connecting" | "live" | "error"
}

export function StatusPill({ status }: StatusPillProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "live":
        return { color: "bg-green-500", text: "Live", variant: "default" as const }
      case "connecting":
        return { color: "bg-amber-500", text: "Connecting...", variant: "secondary" as const }
      case "error":
        return { color: "bg-red-500", text: "Error", variant: "destructive" as const }
      default:
        return { color: "bg-gray-500", text: "Disconnected", variant: "outline" as const }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge variant={config.variant} className="gap-2">
      <div className={`w-2 h-2 rounded-full ${config.color}`} />
      {config.text}
    </Badge>
  )
}
