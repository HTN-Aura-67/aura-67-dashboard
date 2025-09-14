"use client";
import { useEffect, useRef, useState } from "react";

export default function LiveVideo() {
  const url = process.env.NEXT_PUBLIC_VIDEO_URL || "";
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMJPEG, setIsMJPEG] = useState(false);

  useEffect(() => {
    if (!url) return;
    // naive check: if it ends with .mjpg/.mjpeg or lacks .m3u8, treat as MJPEG
    if (url.match(/mjp(e)?g$/i) || !url.includes(".m3u8")) setIsMJPEG(true);
  }, [url]);

  if (!url) return <div className="text-sm text-muted-foreground">Set NEXT_PUBLIC_VIDEO_URL</div>;

  if (isMJPEG) {
    return (
      <img
        src={url}
        alt="Live stream"
        className="w-full h-auto rounded-xl shadow"
      />
    );
  }

  // HLS path
  return (
    <video
      ref={videoRef}
      autoPlay
      controls
      muted
      playsInline
      src={url}
      className="w-full h-auto rounded-xl shadow"
    />
  );
}
