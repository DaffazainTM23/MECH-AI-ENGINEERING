"use client";

import * as React from "react";

/* ----------------------------------------------------------------
 * ScrollReelTestimonials
 *
 * Counter-rotating scroll reel + per-character text rise.
 * Updated to support premium initials fallback of Mechanical Engineering 
 * lecturers or fallbacks like the MECH AI logo. Styled with 
 * a premium dark glassmorphism aesthetic suitable for MECH AI ENGINEER.
 * ---------------------------------------------------------------- */

export interface ScrollReelTestimonial {
  quote: string;
  author: string;
  image?: string;
  initials?: string;
  alt?: string;
}

export interface ScrollReelTestimonialsProps {
  testimonials: ScrollReelTestimonial[];
  charStaggerMs?: number;
  className?: string;
}

const CELL = 121.33;
const GAP = 8;
const STEP = 3 * (CELL + GAP);

const EXIT_MS = 240;
const SLIDE_MS = 800;

const EASE_INOUT = "cubic-bezier(0.65,0,0.35,1)";

const QUOTE_CLASSES =
  "m-0 text-md sm:text-[16px] md:text-[18px] leading-[1.4] tracking-tight text-slate-100 font-sans italic";
const AUTHOR_CLASSES =
  "m-0 text-sm font-black font-mono tracking-wider text-cyan-400 uppercase";

const FEATURED_SHADOW =
  "0 1.008px 0.705px -0.563px rgba(0,0,0,0.3), 0 2.389px 1.672px -1.125px rgba(0,0,0,0.28), 0 4.357px 3.05px -1.688px rgba(0,0,0,0.25), 0 7.244px 5.07px -2.25px rgba(0,0,0,0.22), 0 11.698px 8.188px -2.813px rgba(0,0,0,0.2), 0 19.148px 13.404px -3.375px rgba(0,0,0,0.18), 0 0 15px rgba(6,182,212,0.15), inset 0 1px 0 rgba(255,255,255,0.05)";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* Blurred placeholder cell */
function Cell() {
  return (
    <div
      aria-hidden="true"
      className="shrink-0 rounded-xl border border-white/5 bg-gradient-to-b from-slate-950 to-slate-900/60 blur-[1px] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
      style={{ width: CELL, height: CELL }}
    />
  );
}

/* Featured avatar tile with premium fallback support */
function Featured({ src, alt, initials, active = false }: { src?: string; alt?: string; initials?: string; active?: boolean; key?: any }) {
  const defaultLogo = "https://res.cloudinary.com/df0razmlr/image/upload/v1781586940/LOGO_AI_hhtfjy.png";
  const imageSource = src ? src : (!initials ? defaultLogo : undefined);

  if (imageSource) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-xl bg-slate-950 transition-all duration-700 ease-out",
          active 
            ? "border border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-100 rotate-0 brightness-110 opacity-100 z-10" 
            : "border border-white/5 opacity-30 scale-85 saturate-[0.6] blur-[0.2px] hover:opacity-50 pointer-events-none"
        )}
        style={{ 
          width: CELL, 
          height: CELL, 
          boxShadow: active ? FEATURED_SHADOW : undefined 
        }}
      >
        <img
          src={imageSource}
          alt={alt ?? "Lecturer Profile"}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        {/* Desaturate or overlay blend to match premium theme */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 z-[2] mix-blend-color transition-opacity",
            active ? "bg-cyan-950/5 opacity-100" : "bg-slate-950/40 opacity-80"
          )}
        />
        {/* Diagonal gradient sheen on active */}
        {active && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[3] blur-[4px] mix-blend-overlay animate-pulse"
            style={{
              background:
                "linear-gradient(220.99deg, rgba(6,182,212,0) 32%, rgb(6,182,212,0.6) 41%, rgb(99,102,241,0.6) 47%, rgba(6,182,212,0) 65%)",
            }}
          />
        )}
      </div>
    );
  }

  // Initials circular gradient avatar
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 flex flex-col items-center justify-center transition-all duration-700 ease-out",
        active 
          ? "border border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-100 opacity-100 z-10" 
          : "border border-white/5 opacity-25 scale-85 pointer-events-none"
      )}
      style={{ width: CELL, height: CELL, boxShadow: active ? FEATURED_SHADOW : undefined }}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-radial-gradient from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
      <span className="font-mono text-xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-200 to-white drop-shadow-[0_2px_8px_rgba(6,182,212,0.3)] leading-none select-none">
        {initials || "ME"}
      </span>
      {/* Light sheen overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3] mix-blend-overlay"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 100%)",
        }}
      />
    </div>
  );
}

/* Per-character split. Spaces live between word spans as plain text nodes */
function Chars({
  text,
  startIndex,
  staggerMs,
}: {
  text: string;
  startIndex: number;
  staggerMs: number;
}) {
  let idx = startIndex;
  const words = text.split(" ");
  return (
    <>
      {words.map((word, wi) => {
        const wordSpan = (
          <span key={wi} className="inline-block whitespace-nowrap">
            {Array.from(word).map((ch, ci) => {
              const delay = idx * staggerMs;
              idx++;
              return (
                <span
                  key={ci}
                  className="scroll-reel-char"
                  style={{ animationDelay: `${delay}ms` }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        );
        if (wi < words.length - 1) idx++;
        return (
          <React.Fragment key={wi}>
            {wordSpan}
            {wi < words.length - 1 ? " " : null}
          </React.Fragment>
        );
      })}
    </>
  );
}

export function ScrollReelTestimonials({
  testimonials,
  charStaggerMs = 6,
  className,
}: ScrollReelTestimonialsProps) {
  const [index, setIndex] = React.useState(0);
  const [displayIndex, setDisplayIndex] = React.useState(0);
  const [exiting, setExiting] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const animating = React.useRef(false);
  const timeouts = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  const count = testimonials.length;

  React.useEffect(() => {
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setMounted(true))
    );
    return () => {
      cancelAnimationFrame(raf);
      timeouts.current.forEach(clearTimeout);
    };
  }, []);

  const paginate = React.useCallback(
    (dir: 1 | -1) => {
      if (animating.current) return;
      let next = index + dir;
      // Infinite circular wrap-around
      if (next < 0) {
        next = count - 1;
      } else if (next >= count) {
        next = 0;
      }
      animating.current = true;

      setIndex(next);
      setExiting(true);

      timeouts.current.push(
        setTimeout(() => {
          setDisplayIndex(next);
          setExiting(false);
        }, EXIT_MS)
      );
      timeouts.current.push(
        setTimeout(() => {
          animating.current = false;
        }, SLIDE_MS)
      );
    },
    [index, count]
  );

  // Setup fine-tuned automatic scrolling interval (4.5s cycle)
  React.useEffect(() => {
    if (!isPlaying) return;
    const intervalId = setInterval(() => {
      paginate(1);
    }, 4500);
    return () => clearInterval(intervalId);
  }, [isPlaying, paginate]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      paginate(1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      paginate(-1);
    }
  };

  const middleItems = React.useMemo(() => {
    const items: Array<{ type: "cell" } | { type: "featured"; i: number }> = [];
    for (let i = 0; i < 3; i++) items.push({ type: "cell" });
    testimonials.forEach((_, i) => {
      items.push({ type: "featured", i });
      if (i < count - 1) {
        items.push({ type: "cell" }, { type: "cell" });
      }
    });
    for (let i = 0; i < 3; i++) items.push({ type: "cell" });
    return items;
  }, [testimonials, count]);

  const sideCellCount = 4 + 2 * count;

  // Populate left side reel column with offset lecturer pics
  const leftItems = React.useMemo(() => {
    const items: number[] = [];
    for (let i = 0; i < sideCellCount; i++) {
      items.push((i + 3) % count);
    }
    return items;
  }, [count, sideCellCount]);

  // Populate right side reel column with another subset / offset combination
  const rightItems = React.useMemo(() => {
    const items: number[] = [];
    for (let i = 0; i < sideCellCount; i++) {
      items.push((i * 3 + 7) % count);
    }
    return items;
  }, [count, sideCellCount]);

  const centerIdx = (count - 1) / 2;
  const middleY = (centerIdx - index) * STEP;
  const sideY = -middleY;

  const colStyle = (y: number): React.CSSProperties => ({
    transform: `translateY(${y}px)`,
    transition: mounted ? `transform ${SLIDE_MS}ms ${EASE_INOUT}` : "none",
  });

  const current = testimonials[displayIndex];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Lecturer Academic Comments"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      className={cn(
        "relative flex w-full max-w-[1100px] flex-col items-stretch gap-4 overflow-hidden rounded-3xl border border-white/10 md:min-h-[350px] md:flex-row bg-slate-950/40 backdrop-blur-xl shadow-2xl p-1 md:p-1.5 focus-visible:ring-1 focus-visible:ring-cyan-500/50 outline-none select-none group/reel",
        className
      )}
    >
      {/* Glow highlight effects */}
      <div aria-hidden="true" className="absolute -left-20 -top-20 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div aria-hidden="true" className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Reel section */}
      <div
        aria-hidden="true"
        className="relative h-60 w-full shrink-0 self-stretch overflow-hidden md:h-auto md:w-[320px] rounded-2xl bg-[#03050a]"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskComposite: "source-in",
          maskComposite: "intersect",
        }}
      >
        {/* Subtle engineering grid within mask */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.02)_1px,_transparent_0)] bg-[size:16px_16px] pointer-events-none opacity-40" />

        <div className="absolute inset-0 flex items-center justify-center gap-2">
          {/* Left column */}
          <div
            className="flex shrink-0 flex-col gap-2 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(sideY)}
          >
            {leftItems.map((testIdx, i) => (
              <Featured
                key={i}
                src={testimonials[testIdx].image}
                alt={testimonials[testIdx].alt}
                initials={testimonials[testIdx].initials}
                active={false}
              />
            ))}
          </div>

          {/* Middle column */}
          <div
            className="flex shrink-0 flex-col gap-2 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(middleY)}
          >
            {middleItems.map((item, i) =>
              item.type === "featured" ? (
                <Featured
                  key={i}
                  src={testimonials[item.i].image}
                  alt={testimonials[item.i].alt}
                  initials={testimonials[item.i].initials}
                  active={item.i === index}
                />
              ) : (
                <Cell key={i} />
              )
            )}
          </div>

          {/* Right column */}
          <div
            className="flex shrink-0 flex-col gap-2 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(sideY)}
          >
            {rightItems.map((testIdx, i) => (
              <Featured
                key={i}
                src={testimonials[testIdx].image}
                alt={testimonials[testIdx].alt}
                initials={testimonials[testIdx].initials}
                active={false}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch px-6 py-6 md:px-10 md:py-10 text-left">
        <div className="flex flex-col gap-4">
          {/* Cyan Quotation mark icon */}
          <div className="text-cyan-500/25 shrink-0 flex items-center justify-between">
            <svg
              className="block h-10 w-10 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M4.58 17.32C3.55 16.23 3 15 3 13.01c0-3.5 2.46-6.64 6.03-8.19l.9 1.38c-3.34 1.8-4 4.15-4.25 5.62.54-.28 1.24-.38 1.93-.31 1.8.17 3.23 1.65 3.23 3.49a3.5 3.5 0 0 1-3.5 3.5c-1.07 0-2.1-.49-2.75-1.18zm10 0C13.55 16.23 13 15 13 13.01c0-3.5 2.46-6.64 6.03-8.19l.9 1.38c-3.34 1.8-4 4.15-4.25 5.62.54-.28 1.24-.38 1.93-.31 1.8.17 3.23 1.65 3.23 3.49a3.5 3.5 0 0 1-3.5 3.5c-1.07 0-2.1-.49-2.75-1.18z" />
            </svg>
            <span className="text-[10px] font-mono text-cyan-400/55 uppercase tracking-wider animate-pulse hidden sm:inline-block">
              {!isPlaying ? "Paused (Hover)" : "Autoscroll Active"}
            </span>
          </div>

          {/* Text stage */}
          <div
            className="relative w-full max-w-[480px] overflow-hidden"
            aria-live="polite"
          >
            {/* Invisible baseline copy to layout parent properly */}
            <div
              aria-hidden="true"
              className="invisible flex min-h-[120px] flex-col gap-4"
            >
              <p className={QUOTE_CLASSES}>{current.quote}</p>
              <p className={AUTHOR_CLASSES}>{current.author}</p>
            </div>
            <div
              key={displayIndex}
              className={cn(
                "absolute inset-x-0 top-0 flex flex-col gap-4 will-change-[transform,opacity]",
                exiting && "scroll-reel-exit"
              )}
            >
              <p className={QUOTE_CLASSES}>
                <Chars
                  text={current.quote}
                  startIndex={0}
                  staggerMs={charStaggerMs}
                />
              </p>
              <p className={AUTHOR_CLASSES}>
                <Chars
                  text={current.author}
                  startIndex={current.quote.length + 6}
                  staggerMs={charStaggerMs}
                />
              </p>
            </div>
          </div>
        </div>

        {/* Controls and Index indicator */}
        <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-5">
          <div className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
            COMMENT {displayIndex + 1} OF {count}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label="Previous testimonial"
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-white/10 bg-black/40 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all duration-300 select-none active:scale-90"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7.5 2.5 3.5 6l4 3.5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Next testimonial"
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-white/10 bg-black/40 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all duration-300 select-none active:scale-90"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m4.5 2.5 4 3.5-4 3.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScrollReelTestimonials;
