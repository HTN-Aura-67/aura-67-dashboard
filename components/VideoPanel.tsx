"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Play, Square, Maximize, Camera, VolumeX, Volume2, RotateCcw } from "lucide-react"
import { storage } from "@/lib/storage"
import { StatusPill } from "@/components/StatusPill"
import { convertToProxyUrl, isRobotUrl, getDisplayUrl } from "@/lib/streamUtils"

type VideoStatus = "disconnected" | "connecting" | "live" | "error"

interface VideoPanelProps {
  onStatusChange?: (status: VideoStatus) => void
  onUrlChange?: (url: string) => void
}

export function VideoPanel({ onStatusChange, onUrlChange }: VideoPanelProps) {
  const [url, setUrl] = useState("")
  const [status, setStatus] = useState<VideoStatus>("disconnected")
  const [muted, setMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [latency, setLatency] = useState("~150 ms (est.)")
  const [errorMessage, setErrorMessage] = useState("")

  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hlsRef = useRef<any>(null)

  useEffect(() => {
    onStatusChange?.(status)
  }, [status, onStatusChange])

  useEffect(() => {
    onUrlChange?.(url)
  }, [url, onUrlChange])

  // Helper function to convert robot URLs to proxy URLs
  const getProxiedUrl = (originalUrl: string): string => {
    return convertToProxyUrl(originalUrl)
  }

  // Load saved URL on mount
  useEffect(() => {
    const savedUrl = storage.loadUrl()
    // Convert robot URLs to proxy URLs automatically
    const proxiedUrl = getProxiedUrl(savedUrl)
    setUrl(proxiedUrl)
    
    // Update storage if URL was converted
    if (proxiedUrl !== savedUrl) {
      storage.saveUrl(proxiedUrl)
    }
  }, [])

  // Mock latency updates
  useEffect(() => {
    if (status === "live") {
      const interval = setInterval(() => {
        const randomLatency = Math.floor(Math.random() * 100) + 120
        setLatency(`~${randomLatency} ms (est.)`)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [status])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const connect = async () => {
    if (!url.trim()) return

    // Convert direct robot URLs to proxied URLs to avoid CORS
    let finalUrl = getProxiedUrl(url)
    
    // Update URL state and storage if it was converted
    if (finalUrl !== url) {
      setUrl(finalUrl)
      storage.saveUrl(finalUrl)
    }

    setStatus("connecting")
    setErrorMessage("")

    try {
      const video = videoRef.current
      if (!video) throw new Error("Video element not found")

      // Check if browser supports native HLS (Safari)
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = finalUrl
        
        const handleLoadedMetadata = () => {
          setStatus("live")
          video.removeEventListener("loadedmetadata", handleLoadedMetadata)
        }
        
        const handleError = () => {
          setStatus("error")
          setErrorMessage("Failed to load stream. Please check the URL.")
          video.removeEventListener("error", handleError)
        }
        
        video.addEventListener("loadedmetadata", handleLoadedMetadata)
        video.addEventListener("error", handleError)
      } else {
        // Use hls.js for other browsers
        const { default: Hls } = await import("hls.js")

        if (Hls.isSupported()) {
          if (hlsRef.current) {
            hlsRef.current.destroy()
          }

          const hls = new Hls({
            enableWorker: false,
            lowLatencyMode: true,
          })

          hlsRef.current = hls
          hls.loadSource(finalUrl)
          hls.attachMedia(video)

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setStatus("live")
          })

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              setStatus("error")
              setErrorMessage("HLS error: " + (data.details || "Unknown error"))
            }
          })
        } else {
          throw new Error("HLS is not supported in this browser")
        }
      }
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Connection failed")
    }
  }

  const disconnect = () => {
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.src = ""
    }
    setStatus("disconnected")
  }

  const toggleFullscreen = async () => {
    if (!containerRef.current) return

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error("Fullscreen error:", error)
    }
  }

  const takeSnapshot = () => {
    const video = videoRef.current
    if (!video) return

    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob((blob) => {
      if (!blob) return

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `aura-67-snapshot-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, "image/png")
  }

  const retry = () => {
    setStatus("disconnected")
    setErrorMessage("")
    setTimeout(connect, 100)
  }

  return (
    <Card className="h-full flex flex-col rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">Video Feed</h2>
            <StatusPill status={status} />
          </div>

          {status === "live" && (
            <Badge variant="outline" className="text-xs">
              {latency}
            </Badge>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Input
              placeholder="Enter robot URL or HLS stream URL (auto-proxied for CORS)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={status === "connecting"}
              onKeyDown={(e) => e.key === "Enter" && connect()}
            />
            {isRobotUrl(url) && (
              <p className="text-xs text-blue-400 mt-1">
                🔒 Using proxy to avoid CORS: {getDisplayUrl(url)}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {status === "disconnected" || status === "error" ? (
              <Button onClick={connect} disabled={!url.trim()}>
                <Play className="w-4 h-4 mr-2" />
                Connect
              </Button>
            ) : status === "connecting" ? (
              <Button disabled>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Connecting...
              </Button>
            ) : (
              <Button onClick={disconnect} variant="outline">
                <Square className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            )}

            <TooltipProvider>
              <div className="flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={toggleFullscreen} disabled={status !== "live"}>
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Fullscreen</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={takeSnapshot} disabled={status !== "live"}>
                      <Camera className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Snapshot</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setMuted(!muted)
                        if (videoRef.current) {
                          videoRef.current.muted = !muted
                        }
                      }}
                      disabled={status !== "live"}
                    >
                      {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle Mute</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <div ref={containerRef} className="relative h-full min-h-[360px] bg-black rounded-b-2xl overflow-hidden">
          {status === "disconnected" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 mb-4 rounded-full bg-muted flex items-center justify-center">
                <Play className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No Stream Connected</h3>
              <p className="text-gray-400 mb-4 max-w-md">
                Enter a robot stream URL (http://100.112.177.9:8000/...) or HLS URL above. Robot URLs are automatically proxied to avoid CORS issues.
              </p>
              <p className="text-sm text-gray-500">Default robot camera stream pre-loaded</p>
            </div>
          )}

          {status === "connecting" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white">Connecting to stream...</p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <RotateCcw className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Connection Failed</h3>
              <p className="text-gray-400 mb-4 max-w-md">
                {errorMessage || "Unable to connect to the stream. Please check the URL and try again."}
              </p>
              <Button onClick={retry} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry Connection
              </Button>
            </div>
          )}

          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            autoPlay
            muted={muted}
            playsInline
            controls={false}
          />
        </div>
      </CardContent>
    </Card>
  )
}
