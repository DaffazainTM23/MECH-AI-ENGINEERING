import { cn } from "@/lib/utils";
import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type FeatureType = {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
};

type FeatureCardProps = React.ComponentProps<"div"> & {
  feature: FeatureType;
};

export function FeatureCard({ feature, className, ...props }: FeatureCardProps) {
  const p = React.useMemo(() => genRandomPattern(), []);

  // Motion values for responsive 3D card tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Deep structural 3D tilts for true tactile responsiveness
  const rotateX = useSpring(useTransform(y, [-150, 150], [15, -15]), { stiffness: 220, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-15, 15]), { stiffness: 220, damping: 18 });

  // Floating 3D scale spring on hover
  const scale = useSpring(1.0, { stiffness: 350, damping: 20 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
    scale.set(1.03);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    scale.set(1.0);
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden p-8 rounded-[36px] group transition-all duration-300 flex flex-col justify-between min-h-[250px] cursor-pointer text-left select-none",
        // Luxe 3D Neumorphism with double bevel borders and metallic inset-outset dual shadow layers:
        "bg-gradient-to-br from-[#121624] via-[#090b12] to-[#030406]",
        "border border-white/10 shadow-[24px_24px_48px_rgba(0,0,0,0.95),_-12px_-12px_36px_rgba(255,255,255,0.02),_inset_3px_3px_8px_rgba(255,255,255,0.08),_inset_-3px_-3px_8px_rgba(0,0,0,0.8)]",
        "hover:shadow-[0_45px_100px_rgba(0,0,0,1),_0_0_50px_rgba(99,102,241,0.08),_inset_4px_4px_12px_rgba(255,255,255,0.12),_inset_-4px_-4px_12px_rgba(0,0,0,0.9)] hover:border-indigo-500/50",
        className
      )}
      {...props}
    >
      
      {/* Dynamic 3D Floating light orb following mouse */}
      <div className="absolute top-0 right-0 w-[180px] h-[180px] bg-gradient-to-br from-indigo-500/10 to-violet-500/5 group-hover:from-indigo-400/15 group-hover:to-violet-500/10 rounded-full blur-[60px] transition-all duration-550 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-gradient-to-tr from-cyan-500/5 to-transparent rounded-full blur-[50px] pointer-events-none" />

      {/* Grid Pattern overlays */}
      <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full opacity-40 [mask-image:linear-gradient(white,transparent)]">
        <div className="from-white/5 to-transparent absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
          <GridPattern
            width={20}
            height={20}
            x="-12"
            y="4"
            squares={p}
            className="fill-white/15 stroke-white/5 absolute inset-0 h-full w-full mix-blend-overlay"
          />
        </div>
      </div>

      <div className="space-y-5 relative z-10 flex flex-col justify-between h-full" style={{ transform: "translateZ(30px)" }}>
        
        {/* Animated Icon badge with premium 3D inset socket pocket */}
        <div className="flex items-center justify-between" style={{ transform: "translateZ(10px)" }}>
          <div className="p-3.5 rounded-2xl bg-[#04050a] border border-white/5 group-hover:border-indigo-400/40 shadow-[inset_6px_6px_10px_rgba(0,0,0,0.9),_inset_-6px_-6px_10px_rgba(255,255,255,0.015),_0_8px_16px_rgba(0,0,0,0.4)] transition-all duration-300 flex items-center justify-center">
            <feature.icon className="text-slate-400 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-300 size-6" strokeWidth={1.5} aria-hidden />
          </div>
          
          {/* Subtle terminal design coordinates watermark */}
          <span className="text-[9px] font-mono font-black text-indigo-400/40 group-hover:text-cyan-400/60 uppercase tracking-widest leading-none pointer-events-none transition-colors">
            COORD // [0{p[0][0]}.0{p[0][1]}]
          </span>
        </div>

        <div className="space-y-2.5 mt-4" style={{ transform: "translateZ(15px)" }}>
          <h3 className="text-sm md:text-base font-black tracking-widest text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-300 transition-all duration-350 leading-tight uppercase font-mono">
            {feature.title}
          </h3>
          <p className="text-slate-400 text-xs font-normal leading-relaxed group-hover:text-slate-200 transition-colors">
            {feature.description}
          </p>
        </div>

      </div>

      {/* Dual metallic neon edge accent glows */}
      <div className="absolute bottom-0 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent group-hover:via-cyan-400/40 transition-all duration-500" />
      <div className="absolute top-0 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500/30 transition-all duration-500" />

    </motion.div>
  );
}

function GridPattern({
  width,
  height,
  x,
  y,
  squares,
  ...props
}: React.ComponentProps<"svg"> & { width: number; height: number; x: string; y: string; squares?: number[][] }) {
  const patternId = React.useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern id={patternId} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([xVal, yVal], index) => (
            <rect strokeWidth="0" key={index} width={width + 1} height={height + 1} x={xVal * width} y={yVal * height} />
          ))}
        </svg>
      )}
    </svg>
  );
}

function genRandomPattern(length?: number): number[][] {
  length = length ?? 5;
  return Array.from({ length }, () => [
    Math.floor(Math.random() * 4) + 7, // random x between 7 and 10
    Math.floor(Math.random() * 6) + 1, // random y between 1 and 6
  ]);
}
