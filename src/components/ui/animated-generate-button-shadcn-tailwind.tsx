import * as React from "react";
import clsx from "clsx";

export type AnimatedGenerateButtonProps = {
  className?: string;
  labelIdle?: string;
  labelActive?: string;
  generating?: boolean;
  highlightHueDeg?: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  id?: string;
  ariaLabel?: string;
};

export default function AnimatedGenerateButton({
  className,
  labelIdle = "Generate",
  labelActive = "Generating",
  generating = false,
  highlightHueDeg = 210, // Stunning Electric Blue
  onClick,
  type = "button",
  disabled = false,
  id,
  ariaLabel,
}: AnimatedGenerateButtonProps) {
  const isFullWidth = className?.includes("w-full");
  return (
    <div className={clsx("relative", isFullWidth ? "w-full block" : "inline-block", className)} id={id}>
      <button
        type={type}
        aria-label={ariaLabel || (generating ? labelActive : labelIdle)}
        aria-pressed={generating}
        disabled={disabled}
        onClick={onClick}
        className={clsx(
          "ui-anim-btn",
          "relative flex items-center justify-center cursor-pointer select-none whitespace-nowrap overflow-hidden",
          "rounded-[24px] px-8 py-3.5 text-[11px] uppercase tracking-widest font-extrabold font-mono",
          "bg-gradient-to-b from-[#181b28] to-[#0a0c12] text-white",
          "border border-zinc-700/50 w-full min-w-[120px]",
          "shadow-[8px_8px_16px_rgba(0,0,0,0.65),-4px_-4px_12px_rgba(255,255,255,0.015),inset_1px_1px_2px_rgba(255,255,255,0.08)]",
          "transition-[box-shadow,border,background-color,transform] duration-400 hover:scale-[1.01] active:scale-[0.98]"
        )}
        style={
          {
            ["--highlight-hue" as any]: `${highlightHueDeg}deg`,
          } as React.CSSProperties
        }
      >
        <div className="ui-anim-txt-wrapper relative flex items-center justify-center select-none font-bold uppercase tracking-widest whitespace-nowrap flex-nowrap">
          {!generating ? (
            <div
              className="flex justify-center items-center gap-[1px] whitespace-nowrap flex-nowrap"
              style={{ transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
              {Array.from(labelIdle).map((ch, i) => (
                <span key={i} className="ui-anim-letter inline-block shrink-0">
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </div>
          ) : (
            <div
              className="flex justify-center items-center gap-[1px] whitespace-nowrap flex-nowrap"
              style={{ transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
              {Array.from(labelActive).map((ch, i) => (
                <span key={i} className="ui-anim-letter inline-block shrink-0 animate-pulse">
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </div>
          )}
        </div>
      </button>
      <style jsx>{`
        .ui-anim-btn {
          --padding: 5px;
          --radius: 24px;
          --transition: 0.4s;
          --highlight: hsl(var(--highlight-hue), 100%, 65%);
          --highlight-50: hsla(var(--highlight-hue), 100%, 65%, 0.5);
          --highlight-30: hsla(var(--highlight-hue), 100%, 65%, 0.3);
          --highlight-20: hsla(var(--highlight-hue), 100%, 65%, 0.2);
          --highlight-80: hsla(var(--highlight-hue), 100%, 65%, 0.8);
        }

        .ui-anim-btn::before {
          content: "";
          position: absolute;
          top: calc(0px - var(--padding));
          left: calc(0px - var(--padding));
          width: calc(100% + var(--padding) * 2);
          height: calc(100% + var(--padding) * 2);
          border-radius: calc(var(--radius) + var(--padding));
          pointer-events: none;
          background-image: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.4) 100%);
          z-index: -1;
          transition: box-shadow var(--transition), filter var(--transition);
          box-shadow:
            0 -8px 8px -6px #0000 inset,
            0 -16px 16px -8px #00000000 inset,
            1px 1px 1.5px rgba(255,255,255,0.05),
            2px 2px 3px rgba(255,255,255,0.03),
            -1px -1px 1.5px rgba(0,0,0,0.4),
            -2px -2px 3px rgba(0,0,0,0.3);
        }

        .ui-anim-btn::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background-image: linear-gradient(0deg, rgba(255,255,255,0.05), var(--highlight), var(--highlight-50), 12%, transparent);
          background-position: 0 0;
          opacity: 0.15;
          transition: opacity var(--transition), filter var(--transition);
        }

        /* Letters with Premium Glimmer */
        .ui-anim-letter {
          color: rgba(255, 255, 255, 0.85);
          text-shadow: 0 0 1px rgba(255, 255, 255, 0.15);
          animation: ui-letter-anim 2.5s ease-in-out infinite;
          transition: color var(--transition), text-shadow var(--transition), opacity var(--transition);
        }

        @keyframes ui-letter-anim {
          0%, 100% {
            text-shadow: 0 0 1px rgba(255, 255, 255, 0.15);
            color: rgba(255, 255, 255, 0.85);
          }
          50% {
            text-shadow: 0 0 8px var(--highlight-80), 0 0 15px var(--highlight-30);
            color: #ffffff;
          }
        }

        /* Hover */
        .ui-anim-btn:hover {
          border-color: hsla(var(--highlight-hue), 100%, 70%, 0.45);
          box-shadow: 
            12px 12px 24px rgba(0,0,0,0.75), 
            -4px -4px 12px rgba(255,255,255,0.02),
            inset 1px 1px 3px rgba(255,255,255,0.12),
            0 0 20px rgba(59, 130, 246, 0.2);
        }
        .ui-anim-btn:hover::before {
          box-shadow:
            0 -8px 8px -6px rgba(255,255,255,0.05) inset,
            0 -16px 16px -8px var(--highlight-30) inset,
            1px 1px 2px rgba(255,255,255,0.08),
            2px 2px 3px rgba(255,255,255,0.04),
            -1px -1px 2px rgba(0,0,0,0.4),
            -2px -2px 3px rgba(0,0,0,0.3);
        }
        .ui-anim-btn:hover::after {
          opacity: 0.65;
          -webkit-mask-image: linear-gradient(0deg, #fff, transparent);
          mask-image: linear-gradient(0deg, #fff, transparent);
        }

        /* Active / Generating State */
        .ui-anim-btn:active, .ui-anim-btn[aria-pressed="true"] {
          border-color: hsla(var(--highlight-hue), 100%, 75%, 0.7);
          background-color: hsla(var(--highlight-hue), 60%, 15%, 0.7);
          box-shadow: 
            4px 4px 10px rgba(0,0,0,0.8), 
            -2px -2px 8px rgba(255,255,255,0.01),
            inset 2px 2px 5px rgba(0,0,0,0.7),
            0 0 30px var(--highlight-30);
        }
        .ui-anim-btn:active::before, .ui-anim-btn[aria-pressed="true"]::before {
          box-shadow:
            0 -8px 12px -6px rgba(255,255,255,0.1) inset,
            0 -16px 16px -8px var(--highlight-80) inset,
            1px 1px 2px rgba(255,255,255,0.1),
            2px 2px 3px rgba(255,255,255,0.05),
            -1px -1px 2px rgba(0,0,0,0.5),
            -2px -2px 3px rgba(0,0,0,0.4);
        }
        .ui-anim-btn:active::after, .ui-anim-btn[aria-pressed="true"]::after {
          opacity: 0.9;
          filter: brightness(180%);
        }

        /* Letter stagger delays */
        .ui-anim-letter:nth-child(1) { animation-delay: 0s; }
        .ui-anim-letter:nth-child(2) { animation-delay: 0.1s; }
        .ui-anim-letter:nth-child(3) { animation-delay: 0.2s; }
        .ui-anim-letter:nth-child(4) { animation-delay: 0.3s; }
        .ui-anim-letter:nth-child(5) { animation-delay: 0.4s; }
        .ui-anim-letter:nth-child(6) { animation-delay: 0.5s; }
        .ui-anim-letter:nth-child(7) { animation-delay: 0.6s; }
        .ui-anim-letter:nth-child(8) { animation-delay: 0.7s; }
        .ui-anim-letter:nth-child(9) { animation-delay: 0.8s; }
        .ui-anim-letter:nth-child(10) { animation-delay: 0.9s; }
        .ui-anim-letter:nth-child(11) { animation-delay: 1.0s; }
        .ui-anim-letter:nth-child(12) { animation-delay: 1.1s; }
        .ui-anim-letter:nth-child(13) { animation-delay: 1.2s; }
        .ui-anim-letter:nth-child(14) { animation-delay: 1.3s; }
        .ui-anim-letter:nth-child(15) { animation-delay: 1.4s; }
        .ui-anim-letter:nth-child(16) { animation-delay: 1.5s; }

        .ui-anim-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
}
