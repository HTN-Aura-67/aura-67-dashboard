"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { MessageList } from "@/components/MessageList"
import { Composer } from "@/components/Composer"
import { QuickCommands } from "@/components/QuickCommands"
import { storage, type ChatMessage } from "@/lib/storage"
import { useChatApi } from "@/components/useChatApi"

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const { send: sendToApi } = useChatApi()

  // Load saved messages on mount
  useEffect(() => {
    const savedMessages = storage.loadChat()
    if (savedMessages.length === 0) {
      // Add initial system message
      const systemMessage: ChatMessage = {
        id: "system-1",
        role: "robot",
        text: "This chat sends instructions to Aura-67. Type natural language like 'go towards the apple'.",
        timestamp: Date.now(),
      }
      setMessages([systemMessage])
      storage.saveChat([systemMessage])
    } else {
      setMessages(savedMessages)
    }
  }, [])

  // Save messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      storage.saveChat(messages)
    }
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: text.trim(),
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    try {
      // Call the real API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: text.trim() }] })
      })

      const botReply = await response.text()
      const botMessage: ChatMessage = {
        id: `robot-${Date.now()}`,
        role: "robot",
        text: botReply,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `robot-${Date.now()}`,
        role: "robot",
        text: "Sorry, I encountered an error. Please check the connection and try again.",
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const clearChat = () => {
    const systemMessage: ChatMessage = {
      id: "system-1",
      role: "robot",
      text: "This chat sends instructions to Aura-67. Type natural language like 'go towards the apple'.",
      timestamp: Date.now(),
    }
    setMessages([systemMessage])
    storage.clearChat()
    storage.saveChat([systemMessage])
  }

  return (
    <Card className="h-full flex flex-col rounded-2xl shadow-sm bg-card text-card-foreground">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/robot-svgrepo-com.svg" 
              alt="Aura-67 Robot" 
              className="w-6 h-6"
            />
            <h2 className="text-lg font-semibold text-foreground">Aura-67 Commands</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={clearChat} className="text-foreground hover:text-foreground">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Chat
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {/* Messages */}
        <div className="flex-1 min-h-0">
          <MessageList messages={messages} isTyping={isTyping} />
        </div>

        {/* Quick Commands */}
        <div className="px-4 py-2 border-t border-border">
          <QuickCommands onCommand={sendMessage} disabled={isTyping} />
        </div>

        {/* Composer */}
        <div className="px-4 pb-4">
          <Composer onSend={sendMessage} disabled={isTyping} />
        </div>
      </CardContent>
    </Card>
  )
}
