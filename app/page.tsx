"use client"

import { useState } from "react"
import { Toolbar } from "@/components/Toolbar"
import { VideoPanel } from "@/components/VideoPanel"
import { ChatPanel } from "@/components/ChatPanel"
import { ThemeProvider } from "@/components/theme-provider"

export default function Aura67Controller() {
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "live" | "error">(
    "disconnected",
  )
  const [streamUrl, setStreamUrl] = useState("")

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="min-h-screen bg-background text-foreground">
        <Toolbar connectionStatus={connectionStatus} streamUrl={streamUrl} />
        <main className="h-[calc(100vh-4rem)] flex flex-row">
          {/* Video Panel - Left 70% */}
          <div className="w-[70%] p-4 pr-2">
            <VideoPanel onStatusChange={setConnectionStatus} onUrlChange={setStreamUrl} />
          </div>

          {/* Chat Panel - Right 30% */}
          <div className="w-[30%] p-4 pl-2">
            <ChatPanel />
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}
