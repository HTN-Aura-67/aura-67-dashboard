// components/useChatApi.ts
import { useState } from "react";

export type ChatMessage = { role: "user"|"assistant"; content: string };

export function useChatApi() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  async function send(userText: string) {
    const next = [...messages, { role: "user", content: userText } as ChatMessage];
    setMessages(next);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: userText }] })
    });

    const text = await res.text();
    setMessages([...next, { role: "assistant", content: text } as ChatMessage]);
  }

  return { messages, send };
}
