"use client";

import * as React from "react";
import { CircularTestimonials } from "../ui/circular-testimonials";
import { GraduationCap } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export function FacultyCommentsSection() {
  const { t, lecturerComments } = useLanguage();

  return (
    <section id="faculty-comments" className="relative w-full overflow-hidden py-20 border-t border-b border-white/5 bg-slate-950/20">
      {/* Absolute high contrast premium scenic vector light spheres */}
      <div aria-hidden="true" className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div aria-hidden="true" className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[110px] pointer-events-none" />

      {/* Engineering blueprint coordinates grid overlay */}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(3,7,18,0.85)_100%)] pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 flex flex-col items-center">
        {/* Badge - FACULTY NOTES */}
        <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full text-indigo-400 mb-5 animate-pulse">
          <GraduationCap className="w-4 h-4" />
          <span className="text-[10px] sm:text-[11px] font-black font-mono uppercase tracking-widest">
            {t("faculty.badge", "FACULTY NOTES")}
          </span>
        </div>

        {/* Header and description */}
        <div className="text-center max-w-3xl space-y-3 mb-12 flex flex-col items-center justify-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight text-center">
            {t("faculty.title", "Academic Comments from Mechanical Engineering UMY")}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 text-center">
            {t("faculty.subtitle", "Academic-style comments about Artificial Intelligence, Machine Learning, and engineering data prediction.")}
          </p>
        </div>

        {/* Main Testimonial Carousel */}
        <div className="w-full h-full flex justify-center py-2">
          <CircularTestimonials testimonials={lecturerComments} />
        </div>
      </div>
    </section>
  );
}

export default FacultyCommentsSection;
