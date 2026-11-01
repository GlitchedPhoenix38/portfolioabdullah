import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const DEFAULT_FRAME_COUNT = 483;
const DEFAULT_PRIORITY_FRAMES = 30;
const MOBILE_BREAKPOINT = 768;
const MOBILE_CONCURRENCY = 4;
const DESKTOP_CONCURRENCY = 8;

type HeroSequenceProps = {
  poster: string;
  frameCount?: number;
  frameDirectory?: string;
  scrubDistance?: string;
  priorityFrames?: number;
  id?: string;
  className?: string;
  "aria-labelledby"?: string;
  children?: ReactNode;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function frameSource(index: number, directory: string) {
  const cleanDirectory = directory.replace(/^\/+|\/+$/g, "");
  return `${import.meta.env.BASE_URL}${cleanDirectory}/frame_${String(index).padStart(6, "0")}.jpg`;
}

/**
 * Scroll-scrubbed hero background.
 *
 * The wrapper is one viewport tall plus the scrub distance. Its sticky child
 * stays pinned for exactly that distance, and the frame index is derived
 * directly from the same progress value with no interpolation.
 */
export function HeroSequence({
  poster,
  frameCount = DEFAULT_FRAME_COUNT,
  frameDirectory = "hero-frames",
  scrubDistance,
  priorityFrames = DEFAULT_PRIORITY_FRAMES,
  id,
  className,
  "aria-labelledby": ariaLabelledBy,
  children,
}: HeroSequenceProps) {
  const wrapperRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Array<HTMLImageElement | null>>([]);
  const loadedRef = useRef<boolean[]>([]);
  const pendingRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const inflightRef = useRef<Set<number>>(new Set());
  const priorityRef = useRef<number[]>([]);
  const prioritySetRef = useRef<Set<number>>(new Set());
  const requestedFrameRef = useRef(1);
  const lastDrawnFrameRef = useRef(-1);
  const lastDrawnFallbackRef = useRef(-1);
  const nextSequentialRef = useRef(1);
  const lastEvictFrameRef = useRef(1);
  const rafRef = useRef<number | null>(null);
  const destroyedRef = useRef(false);
  const pausedRef = useRef(false);
  const reducedRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);

  const total = Math.max(1, frameCount);
  const style = scrubDistance ? ({ "--hero-scrub": scrubDistance } as CSSProperties) : undefined;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    const stage = wrapper.querySelector<HTMLElement>(".hero-sequence__sticky");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    destroyedRef.current = false;
    reducedRef.current = motionQuery.matches;
    pausedRef.current = document.hidden;
    setReduced(motionQuery.matches);

    imagesRef.current = new Array(total + 1).fill(null);
    loadedRef.current = new Array(total + 1).fill(false);
    pendingRef.current.clear();
    inflightRef.current.clear();
    priorityRef.current = [];
    prioritySetRef.current.clear();
    // Capture the live collections so cleanup aborts exactly these requests,
    // even if the effect is torn down while frames are still in flight.
    const pendingImages = pendingRef.current;
    const inflightFrames = inflightRef.current;
    const prioritySet = prioritySetRef.current;
    requestedFrameRef.current = 1;
    lastDrawnFrameRef.current = -1;
    lastDrawnFallbackRef.current = -1;
    nextSequentialRef.current = 2;
    lastEvictFrameRef.current = 1;
    setReady(false);

    const setData = (name: string, value: string) => {
      wrapper.dataset[name] = value;
    };

    const draw = (image: HTMLImageElement, index: number) => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imageWidth = image.naturalWidth;
      const imageHeight = image.naturalHeight;
      if (!canvasWidth || !canvasHeight || !imageWidth || !imageHeight) return;

      // Always cover the stage; the source frames are 16:9 and centre-weighted.
      const scale = Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight);
      const drawWidth = imageWidth * scale;
      const drawHeight = imageHeight * scale;
      const offsetX = (canvasWidth - drawWidth) / 2;
      const offsetY = (canvasHeight - drawHeight) / 2;

      context.fillStyle = "#000000";
      context.fillRect(0, 0, canvasWidth, canvasHeight);
      context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
      // If we temporarily hid the canvas while waiting for a nearby frame,
      // let the CSS readiness state control its visibility again.
      canvas.style.opacity = "";
      setData("heroDrawn", String(index));
    };

    const findNearest = (target: number) => {
      // Only search the cache window. A full 483-frame scan on every scroll
      // frame is wasted work, and a very distant frame looks worse than the
      // poster while the requested frame is loading.
      const maxDistance = Math.min(
        total,
        window.innerWidth < MOBILE_BREAKPOINT ? 48 : 96,
      );

      for (let offset = 0; offset <= maxDistance; offset += 1) {
        const left = target - offset;
        const right = target + offset;

        if (left >= 1 && loadedRef.current[left] && imagesRef.current[left]) {
          return { image: imagesRef.current[left] as HTMLImageElement, index: left };
        }

        if (
          offset > 0 &&
          right <= total &&
          loadedRef.current[right] &&
          imagesRef.current[right]
        ) {
          return { image: imagesRef.current[right] as HTMLImageElement, index: right };
        }
      }

      return null;
    };

    const renderCurrent = (force = false) => {
      if (destroyedRef.current || reducedRef.current) return;

      const requested = requestedFrameRef.current;
      const exact =
        loadedRef.current[requested] && imagesRef.current[requested]
          ? (imagesRef.current[requested] as HTMLImageElement)
          : null;

      if (exact) {
        setData("heroExact", "true");
        if (!force && lastDrawnFrameRef.current === requested) return;
        draw(exact, requested);
        lastDrawnFrameRef.current = requested;
        lastDrawnFallbackRef.current = -1;
        return;
      }

      const nearest = findNearest(requested);
      setData("heroExact", "false");
      if (!nearest) {
        // Reveal the static poster instead of leaving a stale frame on screen
        // after a fast scroll to a part of the sequence that is not cached yet.
        canvas.style.opacity = "0";
        return;
      }
      if (!force && lastDrawnFallbackRef.current === nearest.index) return;
      draw(nearest.image, nearest.index);
      lastDrawnFrameRef.current = -1;
      lastDrawnFallbackRef.current = nearest.index;
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(rect.width * dpr);
      const height = Math.round(rect.height * dpr);
      if (canvas.width === width && canvas.height === height) return;

      canvas.width = width;
      canvas.height = height;
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      lastDrawnFrameRef.current = -1;
      lastDrawnFallbackRef.current = -1;
      renderCurrent(true);
    };

    const queueFrame = (index: number) => {
      if (index < 1 || index > total) return;
      if (loadedRef.current[index] || inflightRef.current.has(index)) return;
      if (prioritySetRef.current.has(index)) return;
      prioritySetRef.current.add(index);
      priorityRef.current.push(index);
    };

    const queueNearby = (frame: number) => {
      const behind = 16;
      const ahead = 32;

      // Discard queued requests from an old scroll position. Otherwise a fast
      // scroll can leave dozens of obsolete frames ahead of the current frame.
      priorityRef.current = [];
      prioritySetRef.current.clear();

      // Keep sequential preloading moving forward from the current window,
      // rather than downloading old frames after a user jumps deep into the page.
      nextSequentialRef.current = Math.max(
        nextSequentialRef.current,
        Math.min(total + 1, frame + ahead + 1),
      );

      queueFrame(frame);
      for (let offset = 1; offset <= ahead; offset += 1) {
        queueFrame(frame + offset);
      }
      for (let offset = 1; offset <= behind; offset += 1) {
        queueFrame(frame - offset);
      }
    };

    const loadFrame = (index: number) => {
      if (destroyedRef.current || reducedRef.current || pausedRef.current) return;
      if (index < 1 || index > total) return;
      if (loadedRef.current[index] || inflightRef.current.has(index)) return;

      const image = new Image();
      image.decoding = "async";
      image.setAttribute(
        "fetchpriority",
        index === 1 || index === total || index <= priorityFrames ? "high" : "auto",
      );
      inflightRef.current.add(index);
      pendingRef.current.set(index, image);

      image.onload = () => {
        const finish = () => {
          inflightRef.current.delete(index);
          pendingRef.current.delete(index);
          if (destroyedRef.current) return;

          imagesRef.current[index] = image;
          loadedRef.current[index] = true;

          if (index === 1) {
            renderCurrent(true);
            if (!destroyedRef.current) setReady(true);
          } else if (index === requestedFrameRef.current) {
            // The exact frame arrived after a fallback was shown. Repaint even
            // though the scroll position has not changed.
            renderCurrent(true);
          }

          pump();
        };

        if (typeof image.decode === "function") {
          image.decode().then(finish).catch(finish);
        } else {
          finish();
        }
      };

      image.onerror = () => {
        inflightRef.current.delete(index);
        pendingRef.current.delete(index);
        if (destroyedRef.current) return;
        pump();
      };

      image.src = frameSource(index, frameDirectory);
    };

    const pump = () => {
      if (destroyedRef.current || reducedRef.current || pausedRef.current) return;

      const concurrency =
        window.innerWidth < MOBILE_BREAKPOINT ? MOBILE_CONCURRENCY : DESKTOP_CONCURRENCY;

      while (inflightRef.current.size < concurrency && priorityRef.current.length > 0) {
        const index = priorityRef.current.shift() as number;
        prioritySetRef.current.delete(index);
        if (loadedRef.current[index] || inflightRef.current.has(index)) continue;
        loadFrame(index);
      }

      while (inflightRef.current.size < concurrency) {
        let index = nextSequentialRef.current;
        while (index <= total && (loadedRef.current[index] || inflightRef.current.has(index))) {
          index += 1;
        }
        if (index > total) break;
        nextSequentialRef.current = index + 1;
        loadFrame(index);
      }
    };

    const evictDistant = (frame: number) => {
      if (Math.abs(frame - lastEvictFrameRef.current) < 16) return;
      lastEvictFrameRef.current = frame;

      const radius = window.innerWidth < MOBILE_BREAKPOINT ? 40 : 90;
      for (let index = 1; index <= total; index += 1) {
        if (index === 1 || index === total || index === frame) continue;
        if (Math.abs(index - frame) <= radius) continue;
        if (!loadedRef.current[index]) continue;
        imagesRef.current[index] = null;
        loadedRef.current[index] = false;
      }
    };

    const sync = () => {
      const rect = wrapper.getBoundingClientRect();
      const stageHeight = stage?.getBoundingClientRect().height || window.innerHeight;
      const scrollable = rect.height - stageHeight;
      const wrapperTop = rect.top + window.scrollY;
      const progress = scrollable > 0 ? clamp((window.scrollY - wrapperTop) / scrollable, 0, 1) : 0;
      const frame = clamp(1 + Math.round(progress * (total - 1)), 1, total);

      requestedFrameRef.current = frame;

      // Keep diagnostic attributes in sync only when the displayed frame
      // changes; mutating data attributes on every scroll event is unnecessary.
      if (wrapper.dataset.heroFrame !== String(frame)) {
        setData("heroFrame", String(frame));
        setData("heroProgress", progress.toFixed(4));
      }

      if (!reducedRef.current) {
        renderCurrent();
        queueNearby(frame);
        evictDistant(frame);
      }
    };

    const scheduleSync = () => {
      if (destroyedRef.current || rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        sync();
      });
    };

    const onScroll = () => scheduleSync();
    const onResize = () => {
      resizeCanvas();
      scheduleSync();
    };
    const onVisibilityChange = () => {
      pausedRef.current = document.hidden;
      if (!document.hidden) pump();
    };
    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedRef.current = event.matches;
      pausedRef.current = event.matches || document.hidden;
      setReduced(event.matches);

      if (!event.matches) {
        if (!loadedRef.current[1]) loadFrame(1);
        if (total > 1 && !loadedRef.current[total]) loadFrame(total);
        queueNearby(requestedFrameRef.current);
        pump();
        scheduleSync();
      }
    };

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;

    resizeCanvas();
    sync();

    if (!reducedRef.current) {
      loadFrame(1);
      if (total > 1) loadFrame(total);
      queueNearby(1);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    motionQuery.addEventListener("change", onMotionChange);
    resizeObserver?.observe(canvas);

    return () => {
      destroyedRef.current = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      motionQuery.removeEventListener("change", onMotionChange);
      resizeObserver?.disconnect();
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      pendingImages.forEach((image) => {
        image.onload = null;
        image.onerror = null;
        image.src = "";
      });
      pendingImages.clear();
      inflightFrames.clear();
      priorityRef.current = [];
      prioritySet.clear();
      imagesRef.current = [];
      loadedRef.current = [];
      canvas.width = 0;
      canvas.height = 0;
    };
  }, [frameDirectory, priorityFrames, total]);

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
        <img
          className="hero-sequence__poster"
          src={poster}
          alt=""
          aria-hidden="true"
          width={1920}
          height={1088}
          fetchPriority="high"
          decoding="async"
        />
        <canvas className="hero-sequence__canvas" ref={canvasRef} aria-hidden="true" />
        <div className="hero-sequence__scrim" aria-hidden="true" />
        <div className="hero-sequence__content">{children}</div>
      </div>
    </section>
  );
}
