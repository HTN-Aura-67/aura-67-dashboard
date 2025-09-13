"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Moon, Sun, HelpCircle, ExternalLink, MessageSquare, Gamepad2 } from "lucide-react"
import { useTheme } from "next-themes"

interface ToolbarProps {
  connectionStatus?: "disconnected" | "connecting" | "live" | "error"
  streamUrl?: string
  mode?: "chat" | "manual"
  onModeChange?: (mode: "chat" | "manual") => void
}

export function Toolbar({ connectionStatus = "disconnected", streamUrl, mode = "chat", onModeChange }: ToolbarProps) {
  const { theme, setTheme } = useTheme()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-500"
      case "connecting":
        return "bg-amber-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStreamBasename = (url: string) => {
    try {
      return new URL(url).pathname.split("/").pop() || "stream"
    } catch {
      return "stream"
    }
  }

  return (
    <header className="h-16 border-b bg-card px-4 flex items-center justify-between">
      {/* Left: Product name */}
      <div className="flex items-center gap-3">
        <img 
          src="/robot-svgrepo-com.svg" 
          alt="Aura-67 Robot" 
          className="w-8 h-8"
        />
        <h1 className="text-xl font-semibold">Aura-67</h1>
      </div>

      {/* Center: Mode switcher and connection summary */}
      <div className="flex items-center gap-4">
        <Tabs value={mode} onValueChange={(value) => onModeChange?.(value as "chat" | "manual")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              <span className="hidden sm:inline">Manual</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="hidden md:flex items-center gap-2">
          <Badge variant="outline" className="gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(connectionStatus)}`} />
            {connectionStatus}
          </Badge>
          {streamUrl && <span className="text-sm text-muted-foreground">{getStreamBasename(streamUrl)}</span>}
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Button variant="ghost" size="icon">
          <ExternalLink className="h-4 w-4" />
          <span className="sr-only">Open video in new window</span>
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-4 w-4" />
              <span className="sr-only">Help</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Aura-67 Help</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Video Controls</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Paste an HLS stream URL and click Connect</li>
                  <li>• Use Fullscreen for better viewing</li>
                  <li>• Snapshot downloads the current frame</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Chat Mode</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Type natural language instructions</li>
                  <li>• Use quick command chips for common actions</li>
                  <li>• Press Enter to send, Shift+Enter for new line</li>
                  <li>• Ctrl/Cmd+K to focus the input</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Manual Control Mode</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Use arrow keys or WASD for movement</li>
                  <li>• Q/E keys for rotation left/right</li>
                  <li>• Click buttons or hold keys to move</li>
                  <li>• Real-time direct robot control</li>
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}
