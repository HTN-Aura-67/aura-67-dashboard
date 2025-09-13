"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

interface ComposerProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function Composer({ onSend, disabled }: ComposerProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Focus on Ctrl/Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        textareaRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = Math.min(textarea.scrollHeight, 128) + "px"
    }
  }, [message])

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSend(message)
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <Textarea
          ref={textareaRef}
          placeholder="Type a command for the robot... (Enter to send, Shift+Enter for new line)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="min-h-[44px] max-h-32 resize-none"
          rows={1}
        />
      </div>
      <Button onClick={handleSubmit} disabled={!message.trim() || disabled} size="icon" className="h-11 w-11 shrink-0">
        <Send className="w-4 h-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  )
}
