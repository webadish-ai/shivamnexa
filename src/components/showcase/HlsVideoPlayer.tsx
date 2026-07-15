"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

type HlsVideoPlayerProps = {
  src: string;
  poster: string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  disablePictureInPicture?: boolean;
};

export default function HlsVideoPlayer({
  src,
  poster,
  className,
  autoPlay = false,
  controls = true,
  loop = false,
  muted = true,
  disablePictureInPicture = true,
}: HlsVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryAutoplay = async () => {
      if (!autoPlay) return;
      try {
        await video.play();
      } catch {
        // Ignore autoplay rejection; some environments still require user gesture.
      }
    };

    video.muted = muted;
    video.loop = loop;
    video.autoplay = autoPlay;
    video.playsInline = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      const onLoadedMetadata = () => {
        void tryAutoplay();
      };
      video.addEventListener("loadedmetadata", onLoadedMetadata);
      return () => {
        video.removeEventListener("loadedmetadata", onLoadedMetadata);
      };
    }

    if (!Hls.isSupported()) return;

    const hls = new Hls({
      enableWorker: true,
    });

    const handleManifestParsed = () => {
      void tryAutoplay();
    };

    hls.loadSource(src);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, handleManifestParsed);

    return () => {
      hls.off(Hls.Events.MANIFEST_PARSED, handleManifestParsed);
      hls.destroy();
    };
  }, [autoPlay, loop, muted, src]);

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay={autoPlay}
      controls={controls}
      loop={loop}
      muted={muted}
      playsInline
      preload="metadata"
      poster={poster}
      disablePictureInPicture={disablePictureInPicture}
      controlsList={controls ? "nodownload noplaybackrate" : "nodownload noplaybackrate nofullscreen"}
    />
  );
}
