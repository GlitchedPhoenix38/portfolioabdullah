import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const VIDEO_DURATION = 16.066667;

type HeroSequenceProps = {
  poster: string;
  videoSrc?: string;
  frameCount?: number;
  scrubDistance?: string;
  id?: string;
  className?: string;
  "aria-labelledby"?: string;
  children?: ReactNode;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Scroll-scrubbed hero driven by one all-intra H.264 video.
 * Scroll position selects a timestamp; the canvas displays decoded video frames.
 */
export function HeroSequence({
  poster,
  videoSrc = `${import.meta.env.BASE_URL}hero-sequence.mp4`,
  frameCount = 483,
  scrubDistance,
  id,
  className,
  "aria-labelledby": ariaLabelledBy,
  children,
}: HeroSequenceProps) {
  const wrapperRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const requestedTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const style = scrubDistance ? ({ "--hero-scrub": scrubDistance } as CSSProperties) : undefined;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!wrapper || !canvas || !video) return;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;
    const stage = wrapper.querySelector<HTMLElement>(".hero-sequence__sticky");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let destroyed = false;
    let isReduced = motionQuery.matches;
    setReduced(isReduced);

    const setData = (name: string, value: string) => {
      wrapper.dataset[name] = value;
    };

    const drawVideo = () => {
      if (destroyed || isReduced || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      const width = canvas.width;
      const height = canvas.height;
      if (!width || !height || !video.videoWidth || !video.videoHeight) return;
      const scale = Math.max(width / video.videoWidth, height / video.videoHeight);
      const drawWidth = video.videoWidth * scale;
      const drawHeight = video.videoHeight * scale;
      context.fillStyle = "#000";
      context.fillRect(0, 0, width, height);
      context.drawImage(video, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
      setData("heroDrawnTime", video.currentTime.toFixed(3));
      setData("heroReady", "true");
      setReady(true);
    };

    const seekToRequested = () => {
      if (destroyed || isReduced || video.readyState < HTMLMediaElement.HAVE_METADATA) return;
      const target = requestedTimeRef.current;
      if (Math.abs(video.currentTime - target) < 0.012) {
        drawVideo();
        return;
      }
      // Assigning currentTime while a seek is in progress lets the media
      // element coalesce rapid scroll updates toward the newest requested time.
      try {
        video.currentTime = target;
      } catch {
        // Metadata may become unavailable during teardown; the next sync retries.
      }
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.round(rect.width * dpr);
      const height = Math.round(rect.height * dpr);
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      drawVideo();
    };

    const sync = () => {
      const rect = wrapper.getBoundingClientRect();
      const stageHeight = stage?.getBoundingClientRect().height || window.innerHeight;
      const scrollable = rect.height - stageHeight;
      const wrapperTop = rect.top + window.scrollY;
      const progress = scrollable > 0 ? clamp((window.scrollY - wrapperTop) / scrollable, 0, 1) : 0;
      const frame = clamp(1 + Math.round(progress * (frameCount - 1)), 1, frameCount);
      requestedTimeRef.current = ((frame - 1) / Math.max(1, frameCount - 1)) * VIDEO_DURATION;
      setData("heroFrame", String(frame));
      setData("heroProgress", progress.toFixed(4));
      setData("heroExact", String(Math.abs(video.currentTime - requestedTimeRef.current) < 0.012));
      if (!isReduced) seekToRequested();
    };

    const scheduleSync = () => {
      if (destroyed || rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        sync();
      });
    };

    const onSeeked = () => {
      if (destroyed || isReduced) return;
      drawVideo();
      // If the user scrolled again during this seek, immediately chase the
      // newest timestamp rather than displaying a stale intermediate frame.
      if (Math.abs(video.currentTime - requestedTimeRef.current) >= 0.012) seekToRequested();
    };
    const onLoaded = () => {
      if (!destroyed) {
        setReady(true);
        scheduleSync();
      }
    };
    const onResize = () => {
      resizeCanvas();
      scheduleSync();
    };
    const onMotionChange = (event: MediaQueryListEvent) => {
      isReduced = event.matches;
      setReduced(isReduced);
      if (!isReduced) {
        video.currentTime = requestedTimeRef.current;
        scheduleSync();
      }
    };

    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", () => setData("heroVideoError", "true"));
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    motionQuery.addEventListener("change", onMotionChange);
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
    resizeObserver?.observe(canvas);

    resizeCanvas();
    sync();

    return () => {
      destroyed = true;
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", onResize);
      motionQuery.removeEventListener("change", onMotionChange);
      resizeObserver?.disconnect();
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [frameCount]);

  return (
    <section
      ref={wrapperRef}
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={`hero hero-sequence${className ? ` ${className}` : ""}`}
      style={style}
      data-hero-sequence=""
      data-ready={ready ? "true" : "false"}
      data-reduced={reduced ? "true" : "false"}
    >
      <div className="hero-sequence__sticky">
        <img className="hero-sequence__poster" src={poster} alt="" aria-hidden="true" width={1920} height={1088} fetchPriority="high" decoding="async" />
        <canvas className="hero-sequence__canvas" ref={canvasRef} aria-hidden="true" />
        <video
          ref={videoRef}
          className="hero-sequence__decoder"
          src={videoSrc}
          poster={poster}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />
        <div className="hero-sequence__scrim" aria-hidden="true" />
        <div className="hero-sequence__content">{children}</div>
      </div>
    </section>
  );
}
