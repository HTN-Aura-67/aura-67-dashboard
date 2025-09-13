"use client"

import { useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import type { ChatMessage } from "@/lib/storage"
import { TypingIndicator } from "@/components/TypingIndicator"

interface MessageListProps {
  messages: ChatMessage[]
  isTyping: boolean
}

export function MessageList({ messages, isTyping }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <ScrollArea className="h-full">
      <div ref={scrollRef} className="p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === "user" ? "bg-primary text-primary-foreground ml-4" : "bg-muted mr-4"
              }`}
            >
              <div className="flex items-start gap-2">
                {message.role === "robot" && (
                  <div className="shrink-0 mt-0.5">
                    <img 
                      src="/robot-svgrepo-com.svg" 
                      alt="Aura-67 Robot" 
                      className="w-5 h-5"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-muted mr-4">
              <div className="flex items-start gap-2">
                <div className="shrink-0 mt-0.5">
                  <img 
                    src="/robot-svgrepo-com.svg" 
                    alt="Aura-67 Robot" 
                    className="w-5 h-5"
                  />
                </div>
                <TypingIndicator />
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
