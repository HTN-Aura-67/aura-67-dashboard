export interface ChatMessage {
  id: string
  role: "user" | "robot"
  text: string
  timestamp: number
}

export const storage = {
  saveChat: (messages: ChatMessage[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("robopilot-chat", JSON.stringify(messages))
    }
  },

  loadChat: (): ChatMessage[] => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("robopilot-chat")
      return saved ? JSON.parse(saved) : []
    }
    return []
  },

  saveUrl: (url: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("robopilot-stream-url", url)
    }
  },

  loadUrl: (): string => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("robopilot-stream-url") || "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
    }
    return "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  },

  clearChat: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("robopilot-chat")
    }
  },
}
