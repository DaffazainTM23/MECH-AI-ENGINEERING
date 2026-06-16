import { Sun, Moon, Settings } from "lucide-react";

interface DocksProps {
  onToggleTheme?: () => void;
  currentTheme?: "navy" | "contrast";
  onOpenSettings?: () => void;
}

export const Component = ({ onToggleTheme, currentTheme, onOpenSettings }: DocksProps) => {
  return (
    <div
      className="
        inline-flex rounded-xl overflow-hidden relative
        bg-white/5 dark:bg-slate-900/40
        backdrop-blur-md
        shadow-lg shadow-black/20
        border border-white/10
        transition-colors duration-300
      "
    >
      <button
        onClick={onToggleTheme}
        className={`
          px-4 py-2 rounded-l-xl
          flex items-center gap-2
          text-slate-300 hover:text-white
          bg-transparent
          hover:bg-white/10
          transition-colors duration-300
          focus:outline-none focus:ring-0
          border-r border-white/10
          group
          ${currentTheme === "navy" ? "bg-blue-600/20 text-blue-400" : ""}
        `}
        aria-label="Toggle Navy Theme"
      >
        <Sun
          className="
            w-4 h-4
            text-current
            transition-transform duration-300
            group-hover:rotate-45
          "
          aria-hidden="true"
        />
        <span className="select-none text-xs font-mono">Navy Mode</span>
      </button>

      <button
        onClick={onToggleTheme}
        className={`
          px-4 py-2
          flex items-center gap-2
          text-slate-300 hover:text-white
          bg-transparent
          hover:bg-white/10
          transition-colors duration-300
          focus:outline-none focus:ring-0
          border-r border-white/10
          group
          ${currentTheme === "contrast" ? "bg-emerald-600/20 text-emerald-400" : ""}
        `}
        aria-label="Toggle Contrast Theme"
      >
        <Moon
          className="
            w-4 h-4
            text-current
            transition-transform duration-300
            group-hover:scale-115
          "
          aria-hidden="true"
        />
        <span className="select-none text-xs font-mono">Contrast Mode</span>
      </button>

      <button
        onClick={onOpenSettings}
        className="
          px-4 py-2 rounded-r-xl
          flex items-center gap-2
          text-slate-300 hover:text-white
          bg-transparent
          hover:bg-white/10
          transition-colors duration-300
          focus:outline-none focus:ring-0
          group
        "
        aria-label="Open App Info"
      >
        <Settings
          className="
            w-4 h-4
            text-current
            transition-transform duration-300
            group-hover:rotate-90
          "
          aria-hidden="true"
        />
        <span className="select-none text-xs font-mono">Status Board</span>
      </button>
    </div>
  );
};
export { Component as Docks };
