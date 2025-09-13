"use client"

import { Button } from "@/components/ui/button"

interface QuickCommandsProps {
  onCommand: (command: string) => void
  disabled?: boolean
}

const QUICK_COMMANDS = ["Scan area", "Go to apple", "Avoid obstacles", "Return to base"]

export function QuickCommands({ onCommand, disabled }: QuickCommandsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-xs text-muted-foreground self-center mr-2">Quick:</span>
      {QUICK_COMMANDS.map((command) => (
        <Button
          key={command}
          variant="outline"
          size="sm"
          onClick={() => onCommand(command)}
          disabled={disabled}
          className="text-xs h-7 text-foreground border-border hover:bg-accent hover:text-accent-foreground"
        >
          {command}
        </Button>
      ))}
    </div>
  )
}
