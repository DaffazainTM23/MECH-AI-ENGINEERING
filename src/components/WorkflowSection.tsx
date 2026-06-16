import { 
  GitFork, UploadCloud, Eye, Sliders, 
  Settings, Cpu, Trophy, BarChart3, History 
} from "lucide-react";
import { motion } from "framer-motion";

export default function WorkflowSection() {
  const steps = [
    {
      id: "01",
      title: "Dataset Upload",
      desc: "Users stream engineering spreadsheets in CSV or XLSX format containing empirical testing data logs.",
      icon: UploadCloud,
      color: "from-blue-500/20 to-indigo-500/5",
      iconColor: "text-blue-400"
    },
    {
      id: "02",
      title: "Dataset Preview",
      desc: "Automatic structural mapping triggers to determine cell counts, categories, and null distributions.",
      icon: Eye,
      color: "from-purple-500/20 to-indigo-500/5",
      iconColor: "text-purple-400"
    },
    {
      id: "03",
      title: "Feature & Target Selection",
      desc: "Students define separate training variables (X) and designate a continuous numeric prediction target (Y).",
      icon: Sliders,
      color: "from-sky-500/20 to-indigo-500/5",
      iconColor: "text-sky-400"
    },
    {
      id: "04",
      title: "Data Preprocessing",
      desc: "Automatic mean cell imputations and string category label encoders are established to secure mathematical integrity.",
      icon: Settings,
      color: "from-indigo-500/20 to-purple-500/5",
      iconColor: "text-indigo-400"
    },
    {
      id: "05",
      title: "Model Training",
      desc: "Ananda's ML engine trains Extra Trees, Oblivious CatBoost, and loss-regularized XGBoost regressors on 80% splits.",
      icon: Cpu,
      color: "from-pink-500/20 to-indigo-500/5",
      iconColor: "text-pink-400"
    },
    {
      id: "06",
      title: "Model Evaluation",
      desc: "Calculations resolve R², MAE, RMSE, and MAPE scores on the withheld 20% validation splits.",
      icon: Trophy,
      color: "from-emerald-500/20 to-indigo-500/5",
      iconColor: "text-emerald-400"
    },
    {
      id: "07",
      title: "Visual Analytics",
      desc: "The system plots interactive scatter charts, horizontal contribution weights, and residual frequency curves.",
      icon: BarChart3,
      color: "from-amber-500/20 to-indigo-500/5",
      iconColor: "text-amber-400"
    },
    {
      id: "08",
      title: "History & CSV Export",
      desc: "Predictions cache to local storage where they are searched, removed, or compiled into a downloadable CSV sheet.",
      icon: History,
      color: "from-rose-500/20 to-indigo-500/5",
      iconColor: "text-rose-400"
    }
  ] as const;

  return (
    <div className="space-y-12 py-4 text-left" id="workflow_viewport">
      
      {/* Intro section */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 font-mono text-[10px] font-bold uppercase tracking-wider">
          System Blueprints
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight uppercase font-sans">
          System Operational Workflow
        </h2>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-4xl font-sans">
          A modular step-by-step schematic breaking down how MechAutoML AI processes raw material spreadsheets into high-accuracy, deployable predictive engineering models.
        </p>
      </div>

      {/* Grid Layout - Perfectly Equal Sized Bento Neumorphic cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="workflow_flow_grid">
        {steps.map((st) => {
          const Icon = st.icon;
          return (
            <motion.div
              key={st.id}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between min-h-[285px] bg-gradient-to-b from-[#090b16] to-[#04050a] border border-white/10 shadow-[8px_8px_20px_rgba(0,0,0,0.85),-3px_-3px_10px_rgba(255,255,255,0.01),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-indigo-500/30 hover:shadow-[12px_12px_28px_rgba(0,0,0,0.98)]"
              id={`workflow_card_${st.id}`}
            >
              {/* Corner Badge */}
              <div className="absolute top-4 right-4 bg-black/90 border border-white/5 px-2.5 py-1 rounded-xl text-[10px] font-black font-mono text-slate-400 tracking-wider">
                STEP {st.id}
              </div>

              {/* Icon & Content block */}
              <div className="space-y-4">
                {/* Neumorphic Rounded Icon Frame */}
                <div className={`p-4 rounded-2xl bg-[#07070a] border border-white/5 inline-flex shadow-[inset_2px_2px_8px_rgba(0,0,0,0.8),2px_2px_4px_rgba(255,255,255,0.02)]`}>
                  <Icon className={`w-5.5 h-5.5 ${st.iconColor}`} strokeWidth={1.75} />
                </div>
                
                <h3 className="text-sm font-black text-white tracking-wide uppercase font-sans leading-tight">
                  {st.title}
                </h3>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed font-sans pt-3 border-t border-white/5 mt-4">
                {st.desc}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Academic methodology note - Premium Neumorphic styling */}
      <div className="rounded-3xl p-6 md:p-8 space-y-4 bg-[#0b0c10] border border-white/5 shadow-[12px_12px_28px_rgba(0,0,0,0.8),-6px_-6px_20px_rgba(255,255,255,0.012)]" id="methodology_conclusion_box">
        <div className="flex items-center space-x-3 border-b border-white/5 pb-3">
          <div className="p-2 bg-[#07070a] rounded-xl text-indigo-400 border border-white/5 shadow-inner">
            <GitFork className="w-5 h-5" strokeWidth={2} />
          </div>
          <h4 className="text-sm font-black text-white tracking-wider font-sans uppercase">
            Validation & Methodology Summary
          </h4>
        </div>
        <p className="text-xs md:text-[13.5px] text-slate-350 leading-relaxed font-sans">
          The processing architecture establishes a fully structured pipeline aligned with the CRISP-DM methodology. Raw data parsed via our client file-worker is clean-partitioned using seed replication vectors corresponding to institutional student constraints (<strong>NIM: 20230130023</strong>). This deterministic consistency allows students and research panels to audit metrics iteratively with 100% mathematical reproducibility.
        </p>
      </div>

    </div>
  );
}
