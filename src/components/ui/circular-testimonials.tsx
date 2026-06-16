"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Quote, Sparkles, Star, BrainCircuit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";

interface Testimonial {
  name: string;
  quote: string;
  src: string;
}

interface CircularTestimonialsProps {
  testimonials: Testimonial[];
}

export const CircularTestimonials = ({ testimonials }: CircularTestimonialsProps) => {
  const { t } = useLanguage();
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [selectedLecturer, setSelectedLecturer] = useState<Testimonial | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Parse initials correctly for initials-based fallback
  const getInitials = (name: string) => {
    // Strip titles like Prof., Dr., Ir., S.T., M.Eng., etc.
    const cleanName = name
      .replace(/Prof\.|Drs\.|Dr\.|Ir\.|S\.T\.|M\.Eng\.|M\.T\.|Ph\.D\.|IPU|ASEAN|Eng|IPP|IPM|Sc/g, "")
      .replace(/,\s*/g, " ")
      .trim();
    
    const parts = cleanName.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "UMY";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Helper handling image failures
  const handleImageError = (src: string) => {
    setFailedImages((prev) => ({ ...prev, [src]: true }));
  };

  // Split testimonials into two tracks for a rich dual-row 3D marquee
  const track1 = useMemo(() => testimonials.filter((_, idx) => idx % 2 === 0), [testimonials]);
  const track2 = useMemo(() => testimonials.filter((_, idx) => idx % 2 !== 0), [testimonials]);

  // Triple arrays to guarantee seamless auto-scroll marquee loop across any resolution
  const tripeTrack1 = useMemo(() => [...track1, ...track1, ...track1], [track1]);
  const tripeTrack2 = useMemo(() => [...track2, ...track2, ...track2], [track2]);

  return (
    <div className="w-full flex flex-col space-y-12 py-10 relative overflow-hidden" id="marquee-lecturer-3d-deck">
      {/* Absolute high-fidelity background grid lines & glowing vectors */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,180,216,0.03)_0%,_transparent_70%)] pointer-events-none" />

      {/* 3D PERSPECTIVE WRAPPER SHELL */}
      <div 
        className="relative flex flex-col space-y-8 py-4 pointer-events-auto"
        style={{ perspective: "1200px" }}
      >
        {/* ROW 1: Continuously Auto-scrolling Left to Right with 3D Perspective tilt */}
        <div className="w-full relative overflow-hidden h-[260px] flex items-center">
          <motion.div 
            className="flex gap-6 absolute left-0"
            animate={{ x: [0, -2000] }}
            transition={{
              repeat: Infinity,
              duration: 45,
              ease: "linear",
            }}
            style={{ width: "fit-content" }}
          >
            {tripeTrack1.map((item, idx) => {
              const actsFailed = failedImages[item.src] || !item.src;
              return (
                <motion.div
                  key={`track1-${idx}`}
                  className="w-[380px] h-[210px] shrink-0 p-5 nm-card flex flex-col justify-between relative cursor-pointer group active:scale-98 select-none"
                  style={{
                    transformStyle: "preserve-3d",
                    rotateY: hoveredIndex === idx ? 0 : 8,
                    z: hoveredIndex === idx ? 20 : 0
                  }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setSelectedLecturer(item)}
                >
                  {/* Subtle 3D light highlight bevel inside the card */}
                  <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent rounded-full" />
                  
                  {/* Top Header Row */}
                  <div className="flex items-center space-x-3.5">
                    {/* AVATAR SYSTEM with Neumorphic 3D Inset Fallback */}
                    <div className="w-13 h-13 rounded-full nm-inset p-[2px] flex items-center justify-center relative overflow-hidden select-none shrink-0">
                      {!actsFailed ? (
                        <img
                          src={item.src}
                          alt={item.name}
                          className="w-full h-full object-cover object-top select-none rounded-full filter brightness-105"
                          onError={() => handleImageError(item.src)}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        /* Inset Neumorphic Metal Monogram */
                        <div className="w-full h-full rounded-full bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center">
                          <span className="font-mono text-sm font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 via-indigo-300 to-white">
                            {getInitials(item.name)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col text-left overflow-hidden">
                      <span className="text-[9.5px] font-mono font-extrabold tracking-widest text-[#22d3ee] uppercase block mb-0.5">
                        {t("lecturer.title_badge", "FACULTY AGENT")}
                      </span>
                      <h4 className="text-[13.5px] font-display font-black text-white hover:text-cyan-300 transition-colors duration-300 truncate tracking-tight">
                        {item.name}
                      </h4>
                    </div>
                  </div>

                  {/* Testimonial Quote excerpt */}
                  <p className="text-slate-300 font-sans italic text-[12px] leading-relaxed line-clamp-3 text-left pl-1 mt-1 font-normal">
                    "{item.quote}"
                  </p>

                  {/* Card Bottom / Structural Status lines */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-2.5 mt-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                      <Star className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                      <Star className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                      <Star className="w-3 h-3 text-indigo-400 fill-indigo-400" />
                      <Star className="w-3 h-3 text-indigo-400 fill-indigo-400" />
                    </div>
                    
                    <span className="text-[8.5px] font-mono font-extrabold tracking-widest text-slate-500 uppercase">
                      TEKNIK MESIN UMY
                    </span>
                  </div>
                  
                  {/* Hover scanline effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2rem] pointer-events-none" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>


        {/* ROW 2: Continuously Auto-scrolling Right to Left with opposite 3D Perspective tilt */}
        <div className="w-full relative overflow-hidden h-[260px] flex items-center">
          <motion.div 
            className="flex gap-6 absolute left-0"
            animate={{ x: [-2000, 0] }}
            transition={{
              repeat: Infinity,
              duration: 52,
              ease: "linear",
            }}
            style={{ width: "fit-content" }}
          >
            {tripeTrack2.map((item, idx) => {
              const actsFailed = failedImages[item.src] || !item.src;
              const uniqueIdx = idx + 100;
              return (
                <motion.div
                  key={`track2-${idx}`}
                  className="w-[380px] h-[210px] shrink-0 p-5 nm-card flex flex-col justify-between relative cursor-pointer group active:scale-98 select-none"
                  style={{
                    transformStyle: "preserve-3d",
                    rotateY: hoveredIndex === uniqueIdx ? 0 : -8,
                    z: hoveredIndex === uniqueIdx ? 20 : 0
                  }}
                  onMouseEnter={() => setHoveredIndex(uniqueIdx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setSelectedLecturer(item)}
                >
                  {/* Subtle 3D light highlight bevel inside the card */}
                  <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent rounded-full" />
                  
                  {/* Top Header Row */}
                  <div className="flex items-center space-x-3.5">
                    {/* AVATAR SYSTEM with Neumorphic 3D Inset Fallback */}
                    <div className="w-13 h-13 rounded-full nm-inset p-[2px] flex items-center justify-center relative overflow-hidden select-none shrink-0">
                      {!actsFailed ? (
                        <img
                          src={item.src}
                          alt={item.name}
                          className="w-full h-full object-cover object-top select-none rounded-full filter brightness-105"
                          onError={() => handleImageError(item.src)}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        /* Inset Neumorphic Metal Monogram */
                        <div className="w-full h-full rounded-full bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center">
                          <span className="font-mono text-sm font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 via-indigo-300 to-white">
                            {getInitials(item.name)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col text-left overflow-hidden">
                      <span className="text-[9.5px] font-mono font-extrabold tracking-widest text-[#6366f1] uppercase block mb-0.5">
                        {t("lecturer.title_badge", "FACULTY AGENT")}
                      </span>
                      <h4 className="text-[13.5px] font-display font-black text-white hover:text-indigo-300 transition-colors duration-300 truncate tracking-tight">
                        {item.name}
                      </h4>
                    </div>
                  </div>

                  {/* Testimonial Quote excerpt */}
                  <p className="text-slate-305 font-sans italic text-[12px] leading-relaxed line-clamp-3 text-left pl-1 mt-1 font-normal">
                    "{item.quote}"
                  </p>

                  {/* Card Bottom / Structural Status lines */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-2.5 mt-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                      <Star className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                      <Star className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                      <Star className="w-3 h-3 text-indigo-400 fill-indigo-400" />
                      <Star className="w-3 h-3 text-indigo-400 fill-indigo-400" />
                    </div>
                    
                    <span className="text-[8.5px] font-mono font-extrabold tracking-widest text-slate-500 uppercase">
                      TEKNIK MESIN UMY
                    </span>
                  </div>
                  
                  {/* Hover scanline effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2rem] pointer-events-none" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* FULL-SCREEN FOCUS OVERLAY CARD: Neumorphic Masterpiece Focus Showcase Modal */}
      <AnimatePresence>
        {selectedLecturer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010204]/85 backdrop-blur-md">
            {/* Modal dismiss hit area */}
            <div className="absolute inset-0" onClick={() => setSelectedLecturer(null)} />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-xl p-8 nm-card relative overflow-hidden z-10 flex flex-col items-center text-center justify-between min-h-[400px] border border-white/10"
            >
              {/* Top ambient lights */}
              <div className="absolute top-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 to-indigo-500" />
              <div className="absolute top-4 left-4 text-[#22d3ee] font-mono text-[9px] font-black uppercase tracking-widest opacity-40">
                SYS_FOCUS // ACC_994
              </div>
              <div className="absolute top-4 right-4 text-slate-500 font-mono text-[9px] font-bold uppercase tracking-widest opacity-45">
                UMY // FT
              </div>

              {/* Large Neumorphic Avatar Centerpiece */}
              <div className="relative mt-4 mb-2 flex items-center justify-center">
                <div className="absolute w-28 h-28 rounded-full bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 blur-md opacity-75 animate-pulse" />
                
                {/* 3D Circular Bevel Container */}
                <div className="w-24 h-24 rounded-full nm-inset p-1 flex items-center justify-center relative overflow-hidden select-none">
                  {failedImages[selectedLecturer.src] || !selectedLecturer.src ? (
                    /* Monogram fallback inside Modal */
                    <div className="w-full h-full rounded-full bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center">
                      <span className="font-mono text-xl font-black tracking-widest text-[#22d3ee]">
                        {getInitials(selectedLecturer.name)}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={selectedLecturer.src}
                      alt={selectedLecturer.name}
                      className="w-full h-full object-cover object-top select-none rounded-full"
                      onError={() => handleImageError(selectedLecturer.src)}
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              </div>

              {/* Lecturer details */}
              <div className="space-y-4 w-full flex flex-col items-center px-2">
                <div className="flex items-center space-x-1.5 justify-center py-1 bg-cyan-950/20 border border-cyan-500/20 rounded-full px-4 w-fit">
                  <BrainCircuit className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest">
                    {t("lecturer.status", "ACADEMIC ADVISORY BOARD")}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-display font-medium text-white tracking-tight text-center leading-snug">
                  {selectedLecturer.name}
                </h3>

                <div className="h-[1.5px] w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full" />

                {/* Main Quote Statement */}
                <div className="relative pt-2 px-4 max-h-[180px] overflow-y-auto">
                  <Quote className="absolute top-0 left-0 w-8 h-8 text-cyan-400/10 pointer-events-none" />
                  <p className="text-slate-200 font-sans italic leading-relaxed sm:text-[15px] text-[13.5px] italic text-center text-slate-200 mt-2">
                    "{selectedLecturer.quote}"
                  </p>
                  <Quote className="absolute bottom-0 right-0 w-8 h-8 text-cyan-400/10 pointer-events-none transform rotate-180" />
                </div>
              </div>

              {/* Back button */}
              <button
                onClick={() => setSelectedLecturer(null)}
                className="mt-8 px-6 py-2.5 nm-btn text-xs font-mono font-extrabold uppercase tracking-widest border border-white/5 text-cyan-400 hover:text-white"
              >
                {t("lecturer.dismiss", "DISMISS SPECS")}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CircularTestimonials;
