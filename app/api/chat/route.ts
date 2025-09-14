// app/api/chat/route.ts
import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

type Msg = { role: "system" | "user" | "assistant" | "tool"; content: string; name?: string };

// For now, we'll use a simplified approach without tool calling
// until the tracking backend is ready

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as { messages: Msg[] };

    const system: Msg = {
      role: "system",
      content: `You are Aura-67, a robot assistant. You can help with navigation and object detection tasks. 
      
Currently, the tracking backend is not connected, so I can't scan for objects or navigate automatically. 
However, I can provide guidance on how to use the manual controls and explain what I would do if the tracking system was available.

For manual control, use the WASD keys or the control buttons in the manual tab.
- W: Move forward
- A: Turn left  
- S: Move backward
- D: Turn right

When the tracking system is connected, I'll be able to:
- Scan the area for objects like apples, blocks, etc.
- Navigate toward specific targets
- Make decisions about which direction to move based on object detection

What would you like to know about controlling Aura-67?`
    };

    const thread: Msg[] = [system, ...messages];

    const resp = await openai.chat.completions.create({
      model: MODEL,
      messages: thread as any,
      max_tokens: 500,
      temperature: 0.7
    });

    const content = resp.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    
    return new Response(content, {
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("I'm sorry, I encountered an error. Please check your OpenAI API key and try again.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }
}
