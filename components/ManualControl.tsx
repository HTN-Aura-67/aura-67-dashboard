"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, RotateCw } from "lucide-react"

interface ManualControlProps {
  onCommand: (command: string) => void
}

export function ManualControl({ onCommand }: ManualControlProps) {
  const [isPressed, setIsPressed] = useState<string | null>(null)

  const handleKeyPress = async (direction: string) => {
    setIsPressed(direction)
    onCommand(direction)
    
    // Map direction to WASD format for API
    let apiDirection: "w" | "a" | "s" | "d" | null = null
    switch (direction) {
      case "forward":
        apiDirection = "w"
        break
      case "backward":
        apiDirection = "s"
        break
      case "left":
        apiDirection = "a"
        break
      case "right":
        apiDirection = "d"
        break
    }
    
    if (apiDirection) {
      try {
        await fetch("/api/manual", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ direction: apiDirection, speed: 1 })
        })
      } catch (error) {
        console.error("Manual control error:", error)
      }
    }
  }

  const handleKeyRelease = () => {
    setIsPressed(null)
  }

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return // Prevent repeated key events
      
      switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
          handleKeyPress("forward")
          break
        case "ArrowDown":
        case "s":
        case "S":
          handleKeyPress("backward")
          break
        case "ArrowLeft":
        case "a":
        case "A":
          handleKeyPress("left")
          break
        case "ArrowRight":
        case "d":
        case "D":
          handleKeyPress("right")
          break
        case "q":
        case "Q":
          handleKeyPress("rotate_left")
          break
        case "e":
        case "E":
          handleKeyPress("rotate_right")
          break
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
        case "ArrowDown":
        case "s":
        case "S":
        case "ArrowLeft":
        case "a":
        case "A":
        case "ArrowRight":
        case "d":
        case "D":
        case "q":
        case "Q":
        case "e":
        case "E":
          handleKeyRelease()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  const controlButtons = [
    { key: "forward", icon: ArrowUp, label: "Forward", keys: "↑ / W" },
    { key: "backward", icon: ArrowDown, label: "Backward", keys: "↓ / S" },
    { key: "left", icon: ArrowLeft, label: "Left", keys: "← / A" },
    { key: "right", icon: ArrowRight, label: "Right", keys: "→ / D" },
    { key: "rotate_left", icon: RotateCcw, label: "Rotate Left", keys: "Q" },
    { key: "rotate_right", icon: RotateCw, label: "Rotate Right", keys: "E" },
  ]

  return (
    <Card className="h-full flex flex-col rounded-2xl shadow-sm bg-card text-card-foreground">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <img 
            src="/robot-svgrepo-com.svg" 
            alt="Aura-67 Robot" 
            className="w-6 h-6"
          />
          <h2 className="text-lg font-semibold text-foreground">Manual Control</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Use arrow keys or WASD to control Aura-67's movement
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="grid grid-cols-3 gap-4 w-full max-w-md">
          {/* Empty top-left */}
          <div></div>
          
          {/* Forward */}
          <div className="flex flex-col items-center">
            <Button
              variant={isPressed === "forward" ? "default" : "outline"}
              size="lg"
              className="w-full h-16 text-lg font-semibold"
              onMouseDown={() => handleKeyPress("forward")}
              onMouseUp={handleKeyRelease}
              onMouseLeave={handleKeyRelease}
            >
              <ArrowUp className="w-6 h-6" />
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {controlButtons[0].keys}
            </p>
          </div>

          {/* Empty top-right */}
          <div></div>

          {/* Left */}
          <div className="flex flex-col items-center">
            <Button
              variant={isPressed === "left" ? "default" : "outline"}
              size="lg"
              className="w-full h-16 text-lg font-semibold"
              onMouseDown={() => handleKeyPress("left")}
              onMouseUp={handleKeyRelease}
              onMouseLeave={handleKeyRelease}
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {controlButtons[2].keys}
            </p>
          </div>

          {/* Backward (center) */}
          <div className="flex flex-col items-center">
            <Button
              variant={isPressed === "backward" ? "default" : "outline"}
              size="lg"
              className="w-full h-16 text-lg font-semibold"
              onMouseDown={() => handleKeyPress("backward")}
              onMouseUp={handleKeyRelease}
              onMouseLeave={handleKeyRelease}
            >
              <ArrowDown className="w-6 h-6" />
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {controlButtons[1].keys}
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-col items-center">
            <Button
              variant={isPressed === "right" ? "default" : "outline"}
              size="lg"
              className="w-full h-16 text-lg font-semibold"
              onMouseDown={() => handleKeyPress("right")}
              onMouseUp={handleKeyRelease}
              onMouseLeave={handleKeyRelease}
            >
              <ArrowRight className="w-6 h-6" />
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {controlButtons[3].keys}
            </p>
          </div>
        </div>

        {/* Rotation Controls */}
        <div className="flex gap-4 mt-8">
          <div className="flex flex-col items-center">
            <Button
              variant={isPressed === "rotate_left" ? "default" : "outline"}
              size="lg"
              className="w-20 h-16 text-lg font-semibold"
              onMouseDown={() => handleKeyPress("rotate_left")}
              onMouseUp={handleKeyRelease}
              onMouseLeave={handleKeyRelease}
            >
              <RotateCcw className="w-6 h-6" />
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {controlButtons[4].keys}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <Button
              variant={isPressed === "rotate_right" ? "default" : "outline"}
              size="lg"
              className="w-20 h-16 text-lg font-semibold"
              onMouseDown={() => handleKeyPress("rotate_right")}
              onMouseUp={handleKeyRelease}
              onMouseLeave={handleKeyRelease}
            >
              <RotateCw className="w-6 h-6" />
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {controlButtons[5].keys}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Hold keys or click buttons to move Aura-67
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Movement:</strong> Arrow Keys or WASD</p>
            <p><strong>Rotation:</strong> Q (left) / E (right)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
