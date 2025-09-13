export function mockBotReply(userText: string): string {
  const text = userText.toLowerCase()

  if (text.includes("scan")) {
    return "Scanning surroundings… detected: table, chair, apple 2.3 m ahead."
  }

  if (text.includes("apple")) {
    return "Navigating toward the apple using visual detection…"
  }

  if (text.includes("return") || text.includes("base")) {
    return "Returning to base. ETA 14s."
  }

  if (text.includes("avoid") || text.includes("obstacle")) {
    return "Obstacle avoidance mode activated. Adjusting path."
  }

  return "Acknowledged. Executing command."
}

export function getRandomDelay(): number {
  return Math.random() * 500 + 700 // 700-1200ms
}
