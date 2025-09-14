// app/api/manual/route.ts
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { direction, speed } = await req.json() as { direction: "w"|"a"|"s"|"d"; speed?: number };
    
    if (!direction || !"wasd".includes(direction)) {
      return new Response(JSON.stringify({ accepted: false, message: "direction must be one of w,a,s,d" }), {
        status: 400, headers: { "Content-Type": "application/json" }
      });
    }

    // For now, just log the command since tracking backend is not connected
    console.log(`Manual control command: ${direction} at speed ${speed ?? 1}`);
    
    // Simulate successful response
    const response = { 
      accepted: true, 
      message: `Command received: ${direction.toUpperCase()} at speed ${speed ?? 1}`,
      note: "Tracking backend not connected - command logged only"
    };
    
    return new Response(JSON.stringify(response), { 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (error) {
    console.error("Manual control API error:", error);
    return new Response(JSON.stringify({ 
      accepted: false, 
      message: "Internal server error" 
    }), {
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
}
