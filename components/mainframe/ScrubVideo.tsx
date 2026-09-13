"use client";

import React, { useCallback, useEffect, useRef } from "react";

const VIDEO_SRC = "/no_speaking_1080p_20260911001235.mp4";

const SENSITIVITY = 0.8;
// Anything closer than this counts as "arrived" — media elements rarely land
// on the exact requested timestamp.
const SEEK_EPSILON = 0.01;

export default function ScrubVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef(0);
  const seekingRef = useRef(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const video = videoRef.current;
      if (!video) return;

      const prevX = prevXRef.current;
      prevXRef.current = e.clientX;
      if (prevX === null) return; // first move only establishes the origin

      const { duration } = video;
      if (!Number.isFinite(duration) || duration <= 0) return;

      const delta = e.clientX - prevX;
      const offset = (delta / window.innerWidth) * SENSITIVITY * duration;
      targetTimeRef.current = Math.min(
        Math.max(targetTimeRef.current + offset, 0),
        duration
      );

      // Only issue a seek while the element is idle; onSeeked picks up the
      // drift accumulated during the last one, so we never flood it.
      if (!seekingRef.current) {
        seekingRef.current = true;
        video.currentTime = targetTimeRef.current;
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const onSeeked = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Math.abs(video.currentTime - targetTimeRef.current) > SEEK_EPSILON) {
      video.currentTime = targetTimeRef.current;
      return;
    }
    seekingRef.current = false;
  }, []);

  return (
    <video
      ref={videoRef}
      src={VIDEO_SRC}
      muted
      playsInline
      preload="auto"
      onSeeked={onSeeked}
      className="fixed inset-0 h-full w-full"
      style={{ zIndex: 0, objectFit: "cover", objectPosition: "70% center" }}
    />
  );
}
