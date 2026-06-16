"use client"

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  Home, 
  FileSpreadsheet, 
  Sliders, 
  Cpu, 
  LineChart, 
  TrendingUp, 
  Target, 
  History,
  Activity,
  Heart,
  User,
  GitBranch
} from 'lucide-react';
import { ActiveTab } from '../../src/types';

// --- HoverGradientNavBar Component ---

interface HoverGradientMenuItem {
  icon: React.ReactNode;
  label: string;
  tabId: ActiveTab;
  gradient: string;
  iconColor: string;
}

const menuItems: HoverGradientMenuItem[] = [
  { 
    icon: <Home className="h-4.5 w-4.5" />, 
    label: "Home", 
    tabId: "home", 
    gradient: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)", 
    iconColor: "group-hover:text-blue-500 dark:group-hover:text-blue-400" 
  },
  { 
    icon: <FileSpreadsheet className="h-4.5 w-4.5" />, 
    label: "Dataset", 
    tabId: "upload", 
    gradient: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.06) 50%, rgba(4,120,87,0) 100%)", 
    iconColor: "group-hover:text-emerald-500 dark:group-hover:text-emerald-450" 
  },
  { 
    icon: <Sliders className="h-4.5 w-4.5" />, 
    label: "Features", 
    tabId: "features", 
    gradient: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.06) 50%, rgba(185,28,28,0) 100%)", 
    iconColor: "group-hover:text-red-500 dark:group-hover:text-red-400" 
  },
  { 
    icon: <Cpu className="h-4.5 w-4.5" />, 
    label: "Training", 
    tabId: "train", 
    gradient: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(109,40,217,0.06) 50%, rgba(93,33,209,0) 100%)", 
    iconColor: "group-hover:text-violet-500 dark:group-hover:text-violet-400" 
  },
  { 
    icon: <LineChart className="h-4.5 w-4.5" />, 
    label: "Results", 
    tabId: "performance", 
    gradient: "radial-gradient(circle, rgba(245,158,11) 0%, rgba(217,119,6,0.06) 50%, rgba(180,83,9,0) 100%)", 
    iconColor: "group-hover:text-amber-500 dark:group-hover:text-amber-400" 
  },
  { 
    icon: <TrendingUp className="h-4.5 w-4.5" />, 
    label: "Diagnostics", 
    tabId: "analytics", 
    gradient: "radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(2,132,199,0.06) 50%, rgba(3,105,161,0) 100%)", 
    iconColor: "group-hover:text-sky-500 dark:group-hover:text-sky-400" 
  },
  { 
    icon: <Target className="h-4.5 w-4.5" />, 
    label: "Predictor", 
    tabId: "predict", 
    gradient: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(219,39,119,0.06) 50%, rgba(190,24,93,0) 100%)", 
    iconColor: "group-hover:text-pink-500 dark:group-hover:text-pink-400" 
  },
  { 
    icon: <History className="h-4.5 w-4.5" />, 
    label: "History", 
    tabId: "history", 
    gradient: "radial-gradient(circle, rgba(20,184,166,0.15) 0%, rgba(13,148,136,0.06) 50%, rgba(15,118,110,0) 100%)", 
    iconColor: "group-hover:text-teal-500 dark:group-hover:text-teal-400" 
  },
  { 
    icon: <GitBranch className="h-4.5 w-4.5" />, 
    label: "Workflow", 
    tabId: "workflow", 
    gradient: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(79,70,229,0.06) 50%, rgba(67,56,202,0) 100%)", 
    iconColor: "group-hover:text-indigo-500 dark:group-hover:text-indigo-400" 
  },
  { 
    icon: <Heart className="h-4.5 w-4.5" />, 
    label: "Ethics", 
    tabId: "ethics", 
    gradient: "radial-gradient(circle, rgba(244,63,94,0.15) 0%, rgba(225,29,72,0.06) 50%, rgba(190,18,60,0) 100%)", 
    iconColor: "group-hover:text-rose-500 dark:group-hover:text-rose-450" 
  },
  { 
    icon: <User className="h-4.5 w-4.5" />, 
    label: "Profile", 
    tabId: "about", 
    gradient: "radial-gradient(circle, rgba(75,85,99,0.15) 0%, rgba(55,65,81,0.06) 50%, rgba(31,41,55,0) 100%)", 
    iconColor: "group-hover:text-slate-400 dark:group-hover:text-slate-300" 
  }
];

// Animation variants
const itemVariants: Variants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
};

const backVariants: Variants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
};

const glowVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
    },
  },
};

const sharedTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  duration: 0.5,
};

interface HoverGradientNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isDatasetLoaded: boolean;
}

export function HoverGradientNavBar({ activeTab, onTabChange, isDatasetLoaded }: HoverGradientNavBarProps): React.JSX.Element {
  return (
    <div className="w-full z-40 relative">
      <motion.nav
        className="w-full md:w-fit mx-auto px-3 py-2 rounded-2xl md:rounded-full 
        bg-black/70 backdrop-blur-2xl ring-1 ring-white/10
        border border-white/5 
        shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] relative overflow-visible"
        initial="initial"
        whileHover="hover"
      >
        <ul className="flex items-center justify-start md:justify-center gap-1 overflow-x-auto no-scrollbar max-w-full relative z-10 px-0.5">
          {menuItems.map((item: HoverGradientMenuItem) => {
            const isActive = activeTab === item.tabId;
            // Disable some workspace tabs if dataset is not loaded yet
            const isDisabled = !isDatasetLoaded && 
              item.tabId !== "home" && 
              item.tabId !== "upload" && 
              item.tabId !== "workflow" && 
              item.tabId !== "ethics" && 
              item.tabId !== "about";

            return (
              <motion.li 
                key={item.label} 
                className={`relative shrink-0 ${isDisabled ? 'opacity-35 pointer-events-none' : ''}`}
              >
                <button
                  onClick={() => !isDisabled && onTabChange(item.tabId)}
                  className="block rounded-xl overflow-visible group relative focus:outline-none cursor-pointer"
                  style={{ perspective: "600px" }}
                >
                  <motion.div
                    className="relative w-full rounded-xl"
                    whileHover={isDisabled ? "initial" : "hover"}
                    initial="initial"
                  >
                    {/* Per-item glow */}
                    <motion.div
                      className="absolute inset-0 z-0 pointer-events-none rounded-xl"
                      variants={glowVariants}
                      style={{
                        background: item.gradient,
                        opacity: 0,
                      }}
                    />
                    
                    {/* Background active tab highlight badge */}
                    {isActive && (
                      <motion.div 
                        layoutId="activeTabPill"
                        className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}

                    {/* Front-facing */}
                    <motion.div
                      className={`flex flex-row items-center justify-center gap-2 
                      px-3 px-y-2 py-1.5 relative z-10 
                      bg-transparent transition-colors rounded-xl text-xs font-semibold font-mono tracking-wider uppercase
                      ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}
                      variants={itemVariants}
                      transition={sharedTransition}
                      style={{
                        transformStyle: "preserve-3d",
                        transformOrigin: "center bottom"
                      }}
                    >
                      <span className={`transition-colors duration-300 ${isActive ? 'text-white' : item.iconColor}`}>
                        {item.icon}
                      </span>
                      <span className="inline font-bold text-[10px]">{item.label}</span>
                    </motion.div>

                    {/* Back-facing (flipped animation dimension) */}
                    <motion.div
                      className="flex flex-row items-center justify-center gap-2 
                      px-3 py-1.5 absolute inset-0 z-10 
                      bg-white/5 border border-white/10 text-white
                      transition-colors rounded-xl text-xs font-bold font-mono tracking-wider uppercase"
                      variants={backVariants}
                      transition={sharedTransition}
                      style={{
                        transformStyle: "preserve-3d",
                        transformOrigin: "center top",
                        transform: "rotateX(90deg)"
                      }}
                    >
                      <span className="text-white">
                        {item.icon}
                      </span>
                      <span className="inline text-[10px]">{item.label}</span>
                    </motion.div>
                  </motion.div>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </motion.nav>
    </div>
  );
}

export default HoverGradientNavBar;
