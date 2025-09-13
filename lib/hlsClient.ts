export interface HLSClient {
  loadSource: (url: string) => void
  attachMedia: (video: HTMLVideoElement) => void
  destroy: () => void
  on: (event: string, callback: (event: any, data: any) => void) => void
}

export async function createHLSClient(): Promise<HLSClient | null> {
  try {
    const { default: Hls } = await import("hls.js")

    if (!Hls.isSupported()) {
      return null
    }

    return new Hls({
      enableWorker: false,
      lowLatencyMode: true,
      backBufferLength: 90,
      maxBufferLength: 30,
      maxMaxBufferLength: 60,
    })
  } catch (error) {
    console.error("Failed to load HLS.js:", error)
    return null
  }
}

export function supportsNativeHLS(video: HTMLVideoElement): boolean {
  return video.canPlayType("application/vnd.apple.mpegurl") !== ""
}
