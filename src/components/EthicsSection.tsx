import { ShieldAlert, AlertTriangle, Scale, EyeOff, CheckCircle, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export default function EthicsSection() {
  const { t } = useLanguage();

  const principles = [
    {
      titleKey: "ethics.p1.title",
      defaultTitle: "Dependency on Empirical Quality",
      descKey: "ethics.p1.desc",
      defaultDesc: "AI prediction models are fully dependent on the quality, size, and relevance of the uploaded dataset. Garbage in, garbage out - if empirical readings lack physical precision, machine predictions will fail correspondingly.",
      icon: ShieldAlert,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20"
    },
    {
      titleKey: "ethics.p2.title",
      defaultTitle: "Statistical Probability, Not Absolute Truth",
      descKey: "ethics.p2.desc",
      defaultDesc: "Machine learning models generate statistical estimates based on learned data patterns, not absolute laws of physics. They lack intrinsic awareness of material thermodynamics or structural fluid formulas and must not be treated as absolute facts.",
      icon: Scale,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20"
    },
    {
      titleKey: "ethics.p3.title",
      defaultTitle: "Theory & Experimental Validation",
      descKey: "ethics.p3.desc",
      defaultDesc: "Prediction outputs must always be validated using standard engineering theory (such as stress calculations, finite element analysis, or Hooke's laws), physical laboratory testing, or expert academic inspection.",
      icon: CheckCircle,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      titleKey: "ethics.p4.title",
      defaultTitle: "Mitigation of Statistical Bias",
      descKey: "ethics.p4.desc",
      defaultDesc: "Poor-quality datasets, highly unskewed bounds, or narrow test vectors will generate highly biased models. It is the researcher's responsibility to balance input profiles to prevent misleading estimations.",
      icon: AlertTriangle,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    },
    {
      titleKey: "ethics.p5.title",
      defaultTitle: "Decision Support, Not Decision Maker",
      descKey: "ethics.p5.desc",
      defaultDesc: "MechAutoML AI must act strictly as a learning tool and auxiliary decision-support module, never as the single source for critical manufacturing, aerospace, or structural structural structural components design decisions.",
      icon: Info,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
    },
    {
      titleKey: "ethics.p6.title",
      defaultTitle: "Data Confidentiality & Privacy",
      descKey: "ethics.p6.desc",
      defaultDesc: "Avoid uploading proprietary or sensitive industrial trial datasets. All operations are processed locally in-browser to protect basic privacy, but academic boundaries demand careful file sharing.",
      icon: EyeOff,
      color: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20"
    }
  ] as const;

  return (
    <div className="space-y-12 py-4 text-left" id="ethics_viewport">
      
      {/* Intro section */}
      <div className="space-y-3 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-white tracking-tight text-center uppercase font-sans">
          {t("ethics.title", "Ethical Reflections & Technical Limitations")}
        </h2>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed text-center font-semibold max-w-2xl mx-auto">
          {t("ethics.subtitle", "A core academic breakdown concerning the limits, security risks, responsibilities, and guidelines of deploying Artificial Intelligence algorithms into physical mechanical systems.")}
        </p>
      </div>

      {/* Grid of Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch" id="ethics_principles_grid">
        {principles.map((pr, idx) => {
          const Icon = pr.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative rounded-3xl p-6 bg-gradient-to-b from-[#090b16] to-[#04050a] border border-white/10 shadow-[8px_8px_20px_rgba(0,0,0,0.85),-3px_-3px_10px_rgba(255,255,255,0.01),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-indigo-500/30 hover:shadow-[12px_12px_28px_rgba(0,0,0,0.98)] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className={`p-3.5 rounded-2xl border inline-flex shadow-[inset_2px_2px_8px_rgba(0,0,0,0.95)] ${pr.color}`}>
                  <Icon className="w-5.5 h-5.5 font-bold" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-white text-sm tracking-wide font-sans uppercase">
                    {t(pr.titleKey, pr.defaultTitle)}
                  </h3>
                  <p className="text-slate-300 text-xs leading-relaxed font-semibold">
                    {t(pr.descKey, pr.defaultDesc)}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* LUXURY EMBOSSED 3D NEUMORPHIC GLOWING SIGN-OFF CARD */}
      <div className="relative pt-8" id="ethics_signoff_wrapper">
        
        {/* Pulsing Backlight Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[75%] bg-gradient-to-r from-cyan-500/10 via-indigo-500/15 to-sky-500/10 rounded-full blur-[80px] pointer-events-none animate-pulse" />

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ 
            scale: 1.025,
            rotateX: 1.5,
            rotateY: -1.5,
            boxShadow: "0_20px_50px_rgba(6,182,212,0.25), 0_0_100px_rgba(99,102,241,0.15)"
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
          className="relative overflow-hidden rounded-[32px] p-8 md:p-10 text-center space-y-6 bg-gradient-to-br from-[#0e1224] via-[#070914] to-[#030408] border border-cyan-500/35 shadow-[20px_20px_50px_rgba(0,0,0,0.95),-15px_-15px_35px_rgba(255,255,255,0.01),inset_0_2px_4px_rgba(255,255,255,0.05),inset_2px_2px_12px_rgba(6,182,212,0.1)] transition-all duration-300 group"
          id="ethics_signoff_banner"
        >
          {/* Futuristic ambient light vector scan lines */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.15),transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-repeat bg-[linear-gradient(rgba(18,24,48,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,48,0.1)_1px,transparent_1px)] bg-[size:20px_20px] mix-blend-color-dodge opacity-35" />

          {/* Animated corner glows */}
          <div className="absolute top-0 left-0 w-32 h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
          <div className="absolute bottom-0 right-0 w-32 h-1.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-pulse" />

          <div className="space-y-4 relative z-10" style={{ transform: "translateZ(30px)" }}>
            
            {/* Super premium metallic glowing title banner */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-950/80 to-indigo-950/80 border border-cyan-400/30 text-[9.5px] text-cyan-300 font-mono tracking-[0.2em] font-black uppercase shadow-[inset_0_1px_6px_rgba(6,182,212,0.3)] animate-pulse">
                🎓 ACADEMIC STUDENT HONOR CODE
              </span>
              
              <h4 className="text-sm md:text-base font-black font-sans tracking-[0.16em] uppercase bg-gradient-to-r from-cyan-400 via-sky-100 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(6,182,212,0.5)] block">
                {t("ethics.signoff.title", "STUDENT & RESEARCH STATEMENT OF RESPONSIBILITY")}
              </h4>
            </div>

            {/* Crisp Statement Quote with luxurious styled layout */}
            <div className="max-w-3xl mx-auto p-4 md:p-6 rounded-2xl bg-black/45 border border-white/5 shadow-inner relative">
              <div className="absolute top-2 left-3 text-cyan-500/20 text-5xl font-serif select-none pointer-events-none">“</div>
              <p className="text-slate-200 text-xs md:text-[14px] leading-relaxed md:leading-loose font-medium italic relative z-10 font-sans tracking-wide px-4">
                {t("ethics.signoff.desc", "\"As engineering students and practitioners, human oversight represents the final safeguard. AI tools provide powerful statistical calculations, but expert physical reasoning and peer-reviewed mechanical laws remain the absolute pillars of professional engineering excellence.\"")}
              </p>
              <div className="absolute bottom-[-10px] right-3 text-indigo-500/20 text-5xl font-serif select-none pointer-events-none">”</div>
            </div>

            {/* Interactive verification signature credentials */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
              <div className="px-4 py-2 rounded-xl bg-[#030409] border border-cyan-550/20 shadow-md text-[11px] font-mono font-black tracking-wide text-cyan-300 uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                ANANDA NUR DAFFA ZAIN
              </div>
              <div className="px-4 py-2 rounded-xl bg-[#030409] border border-indigo-550/20 shadow-md text-[11px] font-mono text-slate-350 flex items-center gap-1.5 uppercase font-semibold">
                NIM: <span className="text-white font-extrabold font-mono tracking-wider">20230130023</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-white/10 text-[10px] font-mono text-slate-400 tracking-widest uppercase">
                {t("ethics.signoff.meta", "Created by ZainProject")}
              </div>
            </div>

          </div>
        </motion.div>
      </div>

    </div>
  );
}
