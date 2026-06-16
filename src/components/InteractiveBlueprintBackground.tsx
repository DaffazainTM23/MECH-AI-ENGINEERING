import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import gsap from "gsap";

export default function InteractiveBlueprintBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const group1Ref = useRef<SVGGElement>(null);
  const group2Ref = useRef<SVGGElement>(null);
  const group3Ref = useRef<SVGGElement>(null);

  // High performance motion values for framer-motion cursor spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    // GSAP floating animation for secondary decorative glow balls
    const ctx = gsap.context(() => {
      gsap.to(".glowing-orb-1", {
        x: "random(-30, 30)",
        y: "random(-35, 35)",
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      gsap.to(".glowing-orb-2", {
        x: "random(-25, 25)",
        y: "random(-20, 40)",
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, containerRef);

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;

      // Update framer-motion hardware accelerated values
      mouseX.set(localX);
      mouseY.set(localY);

      // Raw normalized coordinate calculation (-1 to 1)
      const normX = (localX / rect.width - 0.5) * 2;
      const normY = (localY / rect.height - 0.5) * 2;

      // Smooth GSAP coordinate animation direct to DOM nodes, bypassing React state re-renders entirely for high performance!
      if (group1Ref.current) {
        gsap.to(group1Ref.current, {
          x: normX * -16,
          y: normY * -16,
          duration: 0.8,
          ease: "power2.out"
        });
      }
      if (group2Ref.current) {
        gsap.to(group2Ref.current, {
          x: normX * 12,
          y: normY * 12,
          duration: 0.8,
          ease: "power2.out"
        });
      }
      if (group3Ref.current) {
        gsap.to(group3Ref.current, {
          x: normX * 6,
          y: normY * 6,
          duration: 0.8,
          ease: "power2.out"
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      ctx.revert();
    };
  }, []);

  // Mask string template matching mouse position for active grid layer
  const maskImage = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#020204]"
      id="global_mechanical_infinite_canvas"
    >
      {/* Deep Metallic Base Shader */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#08080f_0%,#020205_70%,#000000_100%)]" />

      {/* GSAP Managed Organic Glowing Ambient Emitters */}
      <div className="absolute top-[10%] left-[10%] w-[55%] h-[55%] rounded-full bg-indigo-500/[0.04] blur-[150px] glowing-orb-1" />
      <div className="absolute bottom-[15%] right-[10%] w-[50%] h-[50%] rounded-full bg-cyan-500/[0.04] blur-[140px] glowing-orb-2" />

      {/* 1. Underlying Base Infinite Grid Grid Map Layer (Low visibility) */}
      <div className="absolute inset-0 opacity-[0.05]">
        <svg className="w-full h-full">
          <defs>
            <pattern
              id="bg-grid-scroller"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
              x="0"
              y="0"
            >
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bg-grid-scroller)" />
        </svg>
      </div>

      {/* 2. Active High-Intensity Scrolling Layer Revealed by Hover Mask (Spotlight effect) */}
      <motion.div 
        className="absolute inset-0 opacity-[0.28]" 
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <svg className="w-full h-full">
          <defs>
            <pattern
              id="active-grid-scroller"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
              x="0"
              y="0"
            >
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6366f1" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#active-grid-scroller)" />
        </svg>
      </motion.div>

      {/* 3. Dots Matrix Companion Layer (revealed under cursor spotlight) */}
      <motion.div 
        className="absolute inset-0 opacity-40" 
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: "radial-gradient(rgba(6, 182, 212, 0.25) 1px, transparent 1.5px)",
            backgroundSize: "20px 20px"
          }}
        />
      </motion.div>

      {/* 4. Rotating Technical Engineering Blueprints (Gears / Concentric circles / HUD) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.14]" xmlns="http://www.w3.org/2000/svg">
        <g 
          ref={group1Ref}
          className="origin-[10%_30%]" 
        >
          {/* Main primary blueprint gear */}
          <g className="animate-spin" style={{ animationDuration: "50s", transformOrigin: "10% 30%" }}>
            <circle cx="10%" cy="30%" r="130" stroke="rgba(99, 102, 241, 0.25)" strokeWidth="1.2" strokeDasharray="6 4" fill="none" />
            <circle cx="10%" cy="30%" r="90" stroke="rgba(99, 102, 241, 0.15)" strokeWidth="2" fill="none" />
            <circle cx="10%" cy="30%" r="50" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="1" fill="none" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line 
                key={deg}
                x1="10%" 
                y1="30%" 
                x2="10%" 
                y2="30%" 
                stroke="rgba(99, 102, 241, 0.25)" 
                strokeWidth="1.5" 
                className="origin-[10%_30%]"
                style={{ transform: `rotate(${deg}deg) translate(90px)` }}
              />
            ))}
          </g>
        </g>

        {/* Dynamic Concentric Target calibration crosshair in margins */}
        <g 
          ref={group2Ref}
          className="origin-[90%_75%]"
        >
          <g className="animate-spin" style={{ animationDuration: "70s", transformOrigin: "90% 75%" }}>
            <circle cx="90%" cy="75%" r="180" stroke="rgba(6, 182, 212, 0.12)" strokeWidth="1" strokeDasharray="10 5" fill="none" />
            <circle cx="90%" cy="75%" r="140" stroke="rgba(6, 182, 212, 0.18)" strokeWidth="1.5" fill="none" />
            <circle cx="90%" cy="75%" r="70" stroke="rgba(6, 182, 212, 0.1)" strokeWidth="1" fill="none" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <rect 
                key={deg}
                x="90%" 
                y="75%" 
                width="6" 
                height="15" 
                fill="rgba(6, 182, 212, 0.15)" 
                className="origin-[90%_75%]"
                style={{ transform: `rotate(${deg}deg) translate(-3px, 140px)` }}
              />
            ))}
          </g>
        </g>

        {/* Global HUD Center grid metrics overlay */}
        <g ref={group3Ref} className="origin-[50%_50%] opacity-40">
          <circle cx="50%" cy="50%" r="350" stroke="rgba(99, 102, 241, 0.03)" strokeWidth="1.2" fill="none" />
          <circle cx="50%" cy="50%" r="200" stroke="rgba(99, 102, 241, 0.04)" strokeWidth="1" strokeDasharray="40 15" fill="none" />
          <line x1="50%" y1="15%" x2="50%" y2="85%" stroke="rgba(99, 102, 241, 0.02)" strokeWidth="1" strokeDasharray="8 8" />
          <line x1="15%" y1="50%" x2="85%" y2="50%" stroke="rgba(99, 102, 241, 0.02)" strokeWidth="1" strokeDasharray="8 8" />
        </g>
      </svg>
      
      {/* CSS Styles and helper definitions */}
      <style>{`
        @keyframes gear-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes gear-rotate-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
