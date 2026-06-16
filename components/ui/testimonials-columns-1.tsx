"use client";
import React from "react";
import { motion } from "framer-motion";

export interface Testimonial {
  text: string;
  name: string;
}

export const testimonials: Testimonial[] = [
  {
    text: "The regression accuracy of Mech AI Engine helps students predict material wear rates reliably before setting the CNC tool paths.",
    name: "Bambang Setiadi"
  },
  {
    text: "This platform is an excellent bridge between machine learning and foundational metallurgy courses.",
    name: "Aris Widyo Nugroho"
  },
  {
    text: "Highly valuable tool for composite material research, allowing instant benchmarking for tensile indices.",
    name: "Harini Sosiati"
  },
  {
    text: "An ingenious implementation of machine learning benchmarking tailored specifically to mechanical stress analysis.",
    name: "Didik Prasetiyadi"
  },
  {
    text: "Extremely robust performance benchmarking. Students can easily visualize actual vs predicted residuals.",
    name: "Tutook Suryo Budyo"
  },
  {
    text: "Automating mechanical prediction models with tree structures provides students with first-hand validation.",
    name: "Jazaul Ikhsan"
  }
];

const getInitialsAvatar = (name: string) => {
  const parts = name.split(" ").filter(Boolean);
  const initials = parts.map(n => n[0]).join("").slice(0, 2).toUpperCase();
  
  // Generate a premium gradient based on the name character codes
  const code = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradients = [
    "from-indigo-500 via-purple-500 to-sky-500",
    "from-blue-600 via-indigo-600 to-cyan-500",
    "from-purple-600 via-pink-600 to-rose-500",
    "from-teal-500 via-emerald-500 to-cyan-500",
    "from-indigo-600 via-slate-750 to-blue-500"
  ];
  const gradient = gradients[code % gradients.length];
  
  return (
    <div className={`h-11 w-11 rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center text-white text-sm font-black font-mono shadow-[0_0_15px_rgba(99,102,241,0.25)] border border-white/20 shrink-0`}>
      {initials || "ME"}
    </div>
  );
};

export function TestimonialsDemo() {
  return (
    <section className="py-20 relative overflow-hidden" id="testimonials_section_integrated">
      {/* Premium subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-[9px] font-black uppercase tracking-widest">
            <span>LECTURER ACADEMIC COMMENTS</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase font-sans">
            Lecturer Comment Showcase
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto font-medium leading-relaxed">
            Constructive research comments and academic feedback from lecturers of the Mechanical Engineering department. 
            <span className="block mt-1.5 text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">Note: Feedback simulator for academic training model assessments only.</span>
          </p>
        </div>
        
        {/* Responsive Grid: 3 columns desktop, 2 table, 1 mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative p-8 rounded-3xl border border-white/[0.08] bg-slate-950/40 backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:border-indigo-500/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] flex flex-col justify-between"
              id={`lecturer_testimonial_${idx}`}
            >
              <div className="space-y-4">
                {/* Visual quotation accent */}
                <span className="text-4xl text-indigo-500/20 font-black font-serif leading-none block">“</span>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-semibold transition-colors group-hover:text-white text-left">
                  {t.text}
                </p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/[0.04] flex items-center gap-4">
                {getInitialsAvatar(t.name)}
                <div className="flex flex-col text-left">
                  <span className="font-extrabold text-white text-xs sm:text-sm tracking-tight group-hover:text-indigo-300 transition-colors">
                    {t.name}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
