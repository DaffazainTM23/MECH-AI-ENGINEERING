import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { audio } from "../utils/audioService";

export default function StartupLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 2200; // Snappy and precise startup
    const intervalTime = 20;
    const steps = totalDuration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(Math.floor(currentProgress));

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 200);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#04060a] text-white flex flex-col items-center justify-center font-sans z-[9999] overflow-hidden select-none">
      
      {/* Luxury ambient illumination */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ 
          backgroundImage: `
            radial-gradient(circle at 50% 45%, rgba(6, 182, 212, 0.05) 0%, transparent 65%)
          `
        }} 
      />

      {/* High-Fidelity 3D Neumorphic Plaque Capsule */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col items-center w-[90%] max-w-[480px] px-8 py-10 rounded-[32px] border border-white/10 text-center select-none bg-gradient-to-b from-[#090b11] to-[#040508] shadow-[24px_24px_60px_rgba(0,0,0,0.85),-8px_-8px_24px_rgba(255,255,255,0.02),inset_1px_1px_2px_rgba(255,255,255,0.1),inset_0_15px_30px_rgba(255,255,255,0.01)]"
        id="loading_plaque_container"
      >
        {/* Subtle decorative glowing line top border */}
        <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        
        {/* 3D Shield-Like Logo Frame */}
        <div className="relative w-28 h-28 flex items-center justify-center mb-8">
          <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-2xl opacity-60" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="absolute -inset-2.5 rounded-full border border-dashed border-white/5"
          />
          <motion.div 
            className="w-24 h-24 p-2.5 rounded-full border border-white/10 bg-[#020306] shadow-[inset_4px_4px_10px_rgba(0,0,0,0.9),4px_4px_10px_rgba(0,0,0,0.6)] flex items-center justify-center relative z-10"
            id="logo_shield_inner_bevel"
          >
            <img
              src="https://res.cloudinary.com/df0razmlr/image/upload/v1781586940/LOGO_AI_hhtfjy.png"
              alt="MECH AI ENGINEER"
              className="w-16 h-16 object-contain filter drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        {/* Dense Formal Typography */}
        <div className="space-y-2 mb-8">
          <h1 className="text-xl sm:text-2xl font-black tracking-[0.22em] text-white uppercase font-sans leading-none">
            MECH AI ENGINEERING
          </h1>
          <p className="text-[9px] tracking-[0.35em] font-bold text-cyan-400 font-mono uppercase">
            TEKNIK MESIN UMY • ZAINPROJECT
          </p>
        </div>

        {/* Snappy 3D Bevel Progress Track */}
        <div className="w-full max-w-[280px] space-y-3.5">
          <div className="h-2.5 w-full bg-[#030406] rounded-full overflow-hidden p-0.5 border border-white/5 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.9)] relative">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-505 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut" }}
            />
          </div>

          {/* Status Label */}
          <div className="flex justify-between items-center text-[9px] text-[#94a3b8] font-mono tracking-widest font-bold uppercase px-1 leading-none">
            <span>COMPILING RUNTIME</span>
            <span className="text-cyan-400 font-extrabold">{progress}%</span>
          </div>
        </div>

        {/* Academic detail row centered */}
        <div className="mt-8 pt-5 border-t border-white/5 w-full flex flex-col items-center justify-center space-y-1 text-[8.5px] font-mono tracking-wide text-zinc-500 uppercase leading-none">
          <div>NIM. 20230130023 • ANANDA NUR DAFFA ZAIN</div>
          <div className="opacity-60 text-[7.5px]">UNIVERSITAS MUHAMMADIYAH YOGYAKARTA</div>
        </div>

      </motion.div>

    </div>
  );
}
