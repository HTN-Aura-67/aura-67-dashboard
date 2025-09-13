export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" />
      </div>
      <span className="text-xs text-muted-foreground ml-2">Robot is thinking...</span>
    </div>
  )
}
