"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  name: string;
  icon: LucideIcon;
  disabled?: boolean;
  color?: string;
}

interface NavBarProps {
  items: NavItem[];
  activeId: string;
  onSelect: (id: any) => void;
  className?: string;
  datasetLoaded: boolean;
  modelTrained: boolean;
}

export function NavBar({ items, activeId, onSelect, className, datasetLoaded, modelTrained }: NavBarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={cn(
        "w-full bg-[#050608]/95 backdrop-blur-3xl border-b border-white/15 px-6 py-4.5 flex items-center justify-between transition-all duration-300 shadow-[0_12px_45px_rgba(0,0,0,0.98),inset_0_1px_1px_rgba(255,255,255,0.08)] print-hidden select-none relative z-50",
        className
      )}
      id="tubelight_nav_bar_container"
    >
      {/* 3D Glowing running line at the top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-indigo-500 blur-[0.5px] opacity-80" />

      {/* Brand logo pinning strictly to the top left */}
      <div 
        className="flex items-center space-x-3 cursor-pointer shrink-0" 
        onClick={() => onSelect("home")} 
        id="nav_logo_tubelight"
      >
        <div className="relative w-10 h-10 bg-[#020305] rounded-xl overflow-hidden border border-white/10 flex items-center justify-center shadow-inner shadow-black/80 transition-transform duration-300 hover:scale-105 active:scale-95 shrink-0">
          <img 
            src="https://res.cloudinary.com/df0razmlr/image/upload/v1776131772/LOGO_TEKNIK_MESIN_UMY_cngjwf.jpg" 
            alt="UMY Teknik Mesin Logo" 
            className="w-full h-full object-cover select-none filter brightness-110"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-left">
          <span className="font-sans font-black text-xs sm:text-[13px] text-white tracking-wider block uppercase bg-gradient-to-r from-cyan-400 via-indigo-300 to-white bg-clip-text text-transparent leading-none">
            MECH AI ENGINEERING
          </span>
          <span className="text-[7.5px] text-indigo-400 font-black tracking-widest uppercase block mt-1 font-mono leading-none">
            TEKNIK MESIN UMY
          </span>
        </div>
      </div>

      {/* Main Slide Tab Indicators Container (3D NEUMORPHIC DOCK) */}
      <div className="hidden lg:flex items-center gap-1.5 bg-[#030405] border border-white/5 px-2 py-1.5 rounded-[1.5rem] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.95)]">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;

          return (
            <button
              key={item.id}
              disabled={item.disabled}
              onClick={() => {
                if (!item.disabled) onSelect(item.id);
              }}
              className={cn(
                "relative cursor-pointer text-[10.5px] font-black uppercase tracking-widest px-4 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2",
                isActive 
                  ? "text-cyan-400 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.95)]" 
                  : "text-slate-400 hover:text-white",
                item.disabled && "opacity-20 cursor-not-allowed"
              )}
            >
              <Icon size={14} className={cn("", isActive ? "text-cyan-400 animate-pulse" : "text-slate-400")} />
              <span className="font-sans font-black tracking-widest">{item.name}</span>

              {/* Slider Active indicator (Lamp glow) */}
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-cyan-500/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-9 h-[2px] bg-cyan-400 rounded-t-full">
                    <div className="absolute w-12 h-6 bg-cyan-400/20 rounded-full blur-md -top-2 -left-[6px]" />
                    <div className="absolute w-8 h-4 bg-cyan-400/30 rounded-full blur-sm -top-1 left-0.5" />
                  </div>
                </motion.div>
              )}
            </button>
          );
        })}
      </div>

      {/* Right HUD Information Pin */}
      <div className="flex items-center space-x-4 shrink-0">
        <div className="hidden sm:flex flex-col text-right font-mono text-[9px] border-r border-white/5 pr-4">
          <span className="text-slate-500 font-bold uppercase tracking-widest">SYSTEM_STATE</span>
          <span className={cn("font-black", datasetLoaded ? "text-emerald-400" : "text-amber-405 animate-pulse")}>
            {datasetLoaded ? "● DATA_ACTIVE" : "● AWAITING_LOAD"}
          </span>
        </div>

        <div>
          {datasetLoaded && !modelTrained ? (
            <button
               onClick={() => onSelect("train")}
               className="bg-amber-600 hover:bg-amber-500 text-white font-sans font-black uppercase text-[9.5px] tracking-widest px-4 py-2.5 rounded-xl border border-amber-500/30 active:scale-95 transition-all shadow-[0_4px_15px_rgba(245,158,11,0.3)] cursor-pointer"
            >
              Train AutoML
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
