import { ShieldAlert, AlertTriangle, Scale, EyeOff, CheckCircle, Info } from "lucide-react";

export default function EthicsSection() {
  const principles = [
    {
      title: "Dependency on Empirical Quality",
      desc: "AI prediction models are fully dependent on the quality, size, and relevance of the uploaded dataset. Garbage in, garbage out - if empirical readings lack physical precision, machine predictions will fail correspondingly.",
      icon: ShieldAlert,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20"
    },
    {
      title: "Statistical Probability, Not Absolute Truth",
      desc: "Machine learning models generate statistical estimates based on learned data patterns, not absolute laws of physics. They lack intrinsic awareness of material thermodynamics or structural fluid formulas and must not be treated as absolute facts.",
      icon: Scale,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20"
    },
    {
      title: "Theory & Experimental Validation",
      desc: "Prediction outputs must always be validated using standard engineering theory (such as stress calculations, finite element analysis, or Hooke's laws), physical laboratory testing, or expert academic inspection.",
      icon: CheckCircle,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      title: "Mitigation of Statistical Bias",
      desc: "Poor-quality datasets, highly unskewed bounds, or narrow test vectors will generate highly biased models. It is the researcher's responsibility to balance input profiles to prevent misleading estimations.",
      icon: AlertTriangle,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    },
    {
      title: "Decision Support, Not Decision Maker",
      desc: "MechAutoML AI must act strictly as a learning tool and auxiliary decision-support module, never as the single source for critical manufacturing, aerospace, or structural structural structural components design decisions.",
      icon: Info,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
    },
    {
      title: "Data Confidentiality & Privacy",
      desc: "Avoid uploading proprietary or sensitive industrial trial datasets. All operations are processed locally in-browser to protect basic privacy, but academic boundaries demand careful file sharing.",
      icon: EyeOff,
      color: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20"
    }
  ] as const;

  return (
    <div className="space-y-12 py-4 text-left" id="ethics_viewport">
      
      {/* Intro section */}
      <div className="space-y-3 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
        <h2 className="text-2xl font-black text-white tracking-tight text-center">Ethical Reflections & Technical Limitations</h2>
        <p className="text-slate-400 text-sm text-center font-medium max-w-2xl mx-auto">
          A core academic breakdown concerning the limits, security risks, responsibilities, and guidelines of deploying Artificial Intelligence algorithms into physical mechanical systems.
        </p>
      </div>

      {/* Grid of Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch" id="ethics_principles_grid">
        {principles.map((pr, idx) => {
          const Icon = pr.icon;
          return (
            <div
              key={idx}
              className="relative rounded-3xl p-6 bg-gradient-to-b from-[#090b16] to-[#04050a] border border-white/10 shadow-[8px_8px_20px_rgba(0,0,0,0.85),-3px_-3px_10px_rgba(255,255,255,0.01),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-indigo-500/30 hover:shadow-[12px_12px_28px_rgba(0,0,0,0.98)] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className={`p-3.5 rounded-2xl border inline-flex shadow-[inset_2px_2px_8px_rgba(0,0,0,0.95)] ${pr.color}`}>
                  <Icon className="w-5.5 h-5.5 font-bold" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-white text-sm tracking-wide font-sans">
                    {pr.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-normal">
                    {pr.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Academic ethical signoff */}
      <div className="backdrop-blur-sm bg-slate-950/50 border border-white/10 rounded-3xl p-6 text-center space-y-3" id="ethics_signoff_banner">
        <h4 className="text-xs font-black font-mono tracking-widest uppercase text-blue-405 block">
          STUDENT & RESEARCH STATEMENT OF RESPONSIBILITY
        </h4>
        <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
          "As engineering students and practitioners, human oversight represents the final safeguard. AI tools provide powerful statistical calculations, but expert physical reasoning and peer-reviewed mechanical laws remain the absolute pillars of professional engineering excellence."
        </p>
        <span className="text-[10px] text-slate-500 block font-mono">
          Daffa Zain (NIM: 20230130023) | Created by ZainProject
        </span>
      </div>

    </div>
  );
}
