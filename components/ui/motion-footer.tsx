"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, ArrowUp, GraduationCap, Globe, 
  MapPin, Clock, ShieldCheck, Mail, Cpu, Sparkles 
} from "lucide-react";

export function CinematicFooter() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [pulseActive, setPulseActive] = useState(true);

  // Maintain active UTC real-time clock mapping
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-16 border-t border-white/5 bg-[#030305] text-white overflow-hidden pb-12 pt-16 font-sans">
      
      {/* Decorative Aurora Backdrops */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[400px] h-[300px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-[350px] h-[300px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.005)_1px,_transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-12">
        
        {/* Core Massive Visual Typography Block */}
        <div className="text-center py-4 space-y-6">
          {/* HIGH-TECH SCROLLING BANNER / MARQUEE */}
          <div className="w-full overflow-hidden whitespace-nowrap bg-gradient-to-r from-transparent via-[#090b16]/80 to-transparent py-2 border-y border-white/[0.03] relative shadow-inner">
            <div className="absolute inset-0 bg-radial-gradient from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-[#030305] to-transparent z-10" />
            <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#030305] to-transparent z-10" />
            
            <motion.div
              className="inline-block whitespace-nowrap font-mono text-[9px] tracking-[0.25em] text-cyan-400 font-extrabold space-x-12"
              animate={{ x: [0, -1200] }}
              transition={{
                ease: "linear",
                duration: 32,
                repeat: Infinity,
              }}
            >
              {[
                "HIGH-PERFORMANCE ML ENGINE", "EXTREMELY RANDOMIZED TREES", "CATBOOST SYMMETRIC RECIPE",
                "XGBOOST REGRESSIVE MATRICES", "CNC ROTARY SPINDLE CALIBRATION", "HYDRAULIC VALVE DYNAMICS",
                "FINITE ELEMENT ANOMALY", "THERMAL BOUNDARY INTEGRATION", "UMY ACADEMIC DATA CORE"
              ].concat([
                "HIGH-PERFORMANCE ML ENGINE", "EXTREMELY RANDOMIZED TREES", "CATBOOST SYMMETRIC RECIPE",
                "XGBOOST REGRESSIVE MATRICES", "CNC ROTARY SPINDLE CALIBRATION", "HYDRAULIC VALVE DYNAMICS",
                "FINITE ELEMENT ANOMALY", "THERMAL BOUNDARY INTEGRATION", "UMY ACADEMIC DATA CORE"
              ]).map((word, i) => (
                <span key={i} className="inline-flex items-center gap-3">
                  <span className="text-indigo-500 animate-pulse">✦</span>
                  <span className="bg-gradient-to-r from-cyan-400 via-sky-200 to-white bg-clip-text text-transparent">{word}</span>
                </span>
              ))}
            </motion.div>
          </div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none bg-gradient-to-b from-white via-slate-100 to-slate-400/30 bg-clip-text text-transparent filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
          >
            EXCELLENCE IN ENGINEERING
          </motion.h2>
          <div className="h-px w-52 mx-auto bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
        </div>



        {/* Nav resources & app anchor actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 border-y border-white/5 py-8 text-xs font-mono">
          <a 
            href="#landing_hero_card" 
            className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-350 font-bold hover:text-white hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all duration-300 shadow"
          >
            Mechanical Dataset Workspace
          </a>
          <a 
            href="#landing_page_viewport" 
            className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-350 font-bold hover:text-white hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all duration-300 shadow"
          >
            Process Model Training
          </a>
          <a 
            target="_blank" 
            rel="noopener noreferrer"
            href="https://umy.ac.id" 
            className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-350 font-bold hover:text-white hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all duration-300 shadow"
          >
            UMY Academic Website
          </a>
          <a 
            target="_blank" 
            rel="noopener noreferrer"
            href="https://mesin.umy.ac.id" 
            className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-350 font-bold hover:text-white hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all duration-300 shadow"
          >
            UMY Teknik Mesin
          </a>
        </div>

        {/* Bottom copyright and scholar signature credits */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5">
          
          <div className="text-slate-500 text-[10.5px] font-medium tracking-widest uppercase font-mono text-center md:text-left">
            © 2026 ZAINPROJECT. ALL RIGHTS RESERVED.
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 bg-slate-950/40 border border-white/5 px-5 py-3 rounded-2xl shadow-xl backdrop-blur-md">
            <span className="text-slate-400 text-[10.5px] font-black tracking-widest uppercase font-mono text-center">
              Designed for Academic Excellence by
            </span>
            <div className="relative inline-flex items-center justify-center">
              {/* Cyber-pulsing indicator background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-600 rounded-lg blur-md opacity-60 pointer-events-none" />
              <motion.span 
                animate={{ backgroundPosition: ["0% center", "200% center"] }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="relative font-black font-mono text-xs tracking-widest uppercase bg-gradient-to-r from-cyan-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent bg-[size:200%_auto] px-3.5 py-1.5 rounded-lg bg-black border border-white/10 shadow-inner"
              >
                ZainProject
              </motion.span>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
