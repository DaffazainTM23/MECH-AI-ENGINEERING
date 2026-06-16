"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Cpu, 
  Layers, 
  TrendingUp, 
  Zap, 
  Sliders, 
  Award, 
  Code,
  CheckCircle2,
  Workflow,
  Sparkles,
  ArrowRight,
  ChevronRight,
  BrainCircuit,
  Database,
  Search,
  BookMarked
} from "lucide-react";
import { InfiniteGrid } from "@/components/ui/the-infinite-grid";
import { useLanguage } from "../context/LanguageContext";

export default function SimulationTwin() {
  const { language, t } = useLanguage();
  const [activeEduTab, setActiveEduTab] = useState<"basics" | "system" | "evolution" | "sandbox">("basics");
  
  // Quiz/Interactive sandbox states
  const [dataCleanLevel, setDataCleanLevel] = useState<number>(85);
  const [modelComplexity, setModelComplexity] = useState<number>(75);
  const [noiseReduction, setNoiseReduction] = useState<number>(90);
  const [selectedAIModel, setSelectedAIModel] = useState<"ExtraTrees" | "CatBoost" | "XGBoost">("CatBoost");

  // Calculated predictive metric simulator for students
  const simulatedAccuracy = (
    (dataCleanLevel * 0.45) + 
    (modelComplexity * 0.35) + 
    (noiseReduction * 0.20) + 
    (selectedAIModel === "CatBoost" ? 4 : selectedAIModel === "XGBoost" ? 3 : 2)
  ).toFixed(1);

  // Core Basic Cards (Tepat Sama Rata Ukurannya - Grid Layout)
  const basicConcepts = language === "en" ? [
    {
      id: "concept-1",
      title: "What is Artificial Intelligence?",
      topic: "General Definition",
      desc: "Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning (information acquisition and rule application), reasoning, and self-correction.",
      badge: "AI Basics",
      color: "border-indigo-500/30 text-indigo-400",
      icon: <BrainCircuit className="w-8 h-8 text-indigo-400" />
    },
    {
      id: "concept-2",
      title: "Machine Learning (ML) vs Traditional AI",
      topic: "New Paradigm",
      desc: "ML is a branch of AI that gives computers the ability to learn without being explicitly programmed. Traditional AI relies on rule-based expert systems (SOP), whereas ML discovers functional patterns autonomously.",
      badge: "Machine Learning",
      color: "border-emerald-500/30 text-emerald-400",
      icon: <Cpu className="w-8 h-8 text-emerald-400" />
    },
    {
      id: "concept-3",
      title: "Ensemble Regression Algorithms",
      topic: "XGBoost, CatBoost & ExtraTrees",
      desc: "A modern ML approach combining predictions from multiple base estimators to boost robustness and accuracy. These algorithms cut outline variations and model deeply non-linear mechanical variables.",
      badge: "Core Model",
      color: "border-purple-500/30 text-purple-400",
      icon: <Layers className="w-8 h-8 text-purple-400" />
    },
    {
      id: "concept-4",
      title: "The Importance of Supervised Learning",
      topic: "Mechanical Focus",
      desc: "In mechanical engineering analysis (such as surface roughness or tensile strength), we utilize historical labeled data (Input parameters) to teach AI to predict continuous, precisely calibrated outcomes.",
      badge: "Methodology",
      color: "border-cyan-500/30 text-cyan-400",
      icon: <Database className="w-8 h-8 text-cyan-400" />
    }
  ] : [
    {
      id: "concept-1",
      title: "Apakah itu Artificial Intelligence?",
      topic: "Definisi Umum",
      desc: "Kecerdasan Buatan (AI) adalah simulasi proses kecerdasan manusia oleh mesin, khususnya sistem komputer. Proses tersebut meliputi pembelajaran (pemerolehan informasi dan aturan penggunaan), penalaran, serta koreksi mandiri.",
      badge: "Dasar AI",
      color: "border-indigo-500/30 text-indigo-400",
      icon: <BrainCircuit className="w-8 h-8 text-indigo-400" />
    },
    {
      id: "concept-2",
      title: "Machine Learning (ML) vs AI Tradisional",
      topic: "Paradigma Baru",
      desc: "ML merupakan cabang dari AI yang memberikan komputer kemampuan untuk belajar tanpa diprogram secara eksplisit. AI tradisional mengandalkan sistem pakar berbasis aturan (SOP), sedangkan ML menemukan pola fungsional mandiri.",
      badge: "Pembelajaran Mesin",
      color: "border-emerald-500/30 text-emerald-400",
      icon: <Cpu className="w-8 h-8 text-emerald-400" />
    },
    {
      id: "concept-3",
      title: "Algoritma Regresi Ensemble",
      topic: "XGBoost, CatBoost & ExtraTrees",
      desc: "Merupakan teknik ML modern yang menggabungkan prediksi dari beberapa estimator dasar untuk meningkatkan ketahanan dan keakuratan. Algoritma ini memotong outlier dan memodelkan variabel mekanik yang sangat non-linear.",
      badge: "Core Model",
      color: "border-purple-500/30 text-purple-400",
      icon: <Layers className="w-8 h-8 text-purple-400" />
    },
    {
      id: "concept-4",
      title: "Pentingnya Pembelajaran Terbimbing (Supervised)",
      topic: "Fokus Teknik Mesin",
      desc: "Dalam analisis teknik mesin (seperti kekasaran permukaan atau kekuatan tarik), kita menggunakan data berlabel masa lalu (Input parameter) untuk mengajari AI memprediksi output yang kontinu dan terkalibrasi secara presisi.",
      badge: "Metodologi",
      color: "border-cyan-500/30 text-cyan-400",
      icon: <Database className="w-8 h-8 text-cyan-400" />
    }
  ];

  // System Stages (Bagaimana AI Bekerja)
  const systemStages = language === "en" ? [
    {
      step: "01",
      title: "Data Retrieval & Sensing",
      desc: "Spreadsheet datasets from laboratory tests or field sensors are gathered. XLS/CSV files are analyzed for feature structures.",
      detail: "Every row is a real material test with mechanical deformation coordinates."
    },
    {
      step: "02",
      title: "Preprocessing & Cleaning",
      desc: "Removing outliers and noise, normalizing or scaling features for uniform distribution (Standard Scaling) to prevent numerical biases.",
      detail: "Categorical variables are transformed via coding, and missing data is handled automatically."
    },
    {
      step: "03",
      title: "Fitment training & Feature Weighting",
      desc: "AutoML algorithms (such as Extra Trees or Gradient Boosting) extract crucial correlation patterns between inputs and target variables.",
      detail: "Cross-Validation iterations minimize Mean Squared Error (MSE) by training the model iteratively."
    },
    {
      step: "04",
      title: "Predictive Inference System",
      desc: "The fully trained model is stored in memory to accept random test inputs and compute instantaneous mechanical predictions.",
      detail: "Generates residual charts and actual accuracy rates of independent datasets."
    }
  ] : [
    {
      step: "01",
      title: "Pengumpulan & Sensor Data",
      desc: "Kumpulan data spreadsheet dari uji laboratorium atau sensor lapangan dikumpulkan. File berformat XLS/CSV dianalisis fiturnya.",
      detail: "Setiap baris merupakan pengujian material nyata dengan koordinat deformasi mekanis."
    },
    {
      step: "02",
      title: "Prapemrosesan (Data Cleaning)",
      desc: "Menghapus noise, menskalakan atau menormalkan fitur agar distribusinya seragam (Standard Scaling), mencegah bias numerik.",
      detail: "Variabel nominal diubah melalui encoding dan data kosong ditangani secara otomatis."
    },
    {
      step: "03",
      title: "Pelatihan & Pembobotan Fitur",
      desc: "Algoritma AutoML (seperti Extra Trees atau Gradient Boosting) mengekstrak pola korelasi penting antara input dan target.",
      detail: "Iterasi Cross-Validation meminimalkan Mean Squared Error (MSE) dengan melatih model berulang kali."
    },
    {
      step: "04",
      title: "Sistem Inferensi Prediksi",
      desc: "Model yang telah terlatih disimpan di memori dan siap menerima input acak baru untuk memprediksi hasil teknik secara instan.",
      detail: "Menghasilkan grafik residual dan tingkat akurasi nyata berbasis data independen."
    }
  ];

  // Evolution/Perkembangan AI
  const evolutionTimeline = language === "en" ? [
    {
      phase: "Logical Order Era 1950 to 1980",
      headline: "Symbolic AI & Expert Systems",
      desc: "Dominated by rule-based and hard-coded 'IF-THEN' decisions. Highly brittle when diagnosing flexible material tolerances in mechanical engineering.",
      status: "Rule-Based",
      pulse: false
    },
    {
      phase: "Neural Networks Dawn 1980 to 2000",
      headline: "Backpropagation & Stats Models",
      desc: "Pioneers begin modeling brain structure via Artificial Neural Networks. Computation starts using training datasets to adjust analytical neuron weights.",
      status: "Statistical Era",
      pulse: false
    },
    {
      phase: "Big Data & GPU Explosion 2000 to 2018",
      headline: "Deep Learning & Ensembling",
      desc: "High-power GPU computing triggers the Deep Learning revolution. Groundbreaking algorithms like Random Forest, XGBoost, and SVM arise for multidimensional datasets.",
      status: "Supercharged ML",
      pulse: false
    },
    {
      phase: "Generative Systems & AutoML Present",
      headline: "Large Models & Automated Machine Learning",
      desc: "Autonomous AI era where models automatically design their own architectures (AutoML). AI is fused with natural language processing (Gemini) and interactive 3D visualizations.",
      status: "Autonomous AI",
      pulse: true
    }
  ] : [
    {
      phase: "Era Orde Logik 1950 ke 1980",
      headline: "AI Simbolik & Sistem Pakar",
      desc: "AI didominasi oleh logika keputusan dan pemrograman manual berbasis aturan keras 'IF-THEN'. Sangat rapuh untuk mendiagnosis toleransi fleksibel material teknik mesin.",
      status: "Rule-Based",
      pulse: false
    },
    {
      phase: "Lahirnya Jaringan Saraf 1980 ke 2000",
      headline: "Backpropagation & Model Statistik",
      desc: "Ilmuwan mulai memodelkan struktur otak manusia melalui Jaringan Saraf Tiruan. Komputasi mulai menggunakan data latihan awal untuk menyesuaikan bobot analitis.",
      status: "Statistical Era",
      pulse: false
    },
    {
      phase: "Eksplosi Big Data & GPU 2000 ke 2018",
      headline: "Deep Learning & Ensembling",
      desc: "Akses terhadap komputasi GPU berdaya tinggi memicu revolusi Deep Learning. Lahirlah algoritma tangguh seperti Random Forest, XGBoost, dan SVM untuk dataset multidimensi.",
      status: "Supercharged ML",
      pulse: false
    },
    {
      phase: "Sistem Generatif & AutoML Saat Ini",
      headline: "Large Models & Automated Machine Learning",
      desc: "Era AI otonom di mana model merancang modelnya sendiri secara otomatis (AutoML). AI dipadukan dengan pemrosesan bahasa alami (Gemini) dan visual 3D interaktif.",
      status: "Autonomous AI",
      pulse: true
    }
  ];

  return (
    <div id="ai_education_system_workspace">
      <InfiniteGrid className="py-12 md:py-20">
        
        {/* Decorative background watermark */}
        <div className="absolute top-12 right-12 opacity-5 select-none pointer-events-none hidden xl:block">
          <BookMarked className="w-96 h-96 text-indigo-400" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
          
          {/* Header section with modern bold titles and large typography */}
          <div className="text-center space-y-5 max-w-4xl mx-auto select-none">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 font-mono text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              {t("edu.center_badge", "MECH-AI ACADEMIC STUDY CENTER")}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-none font-sans">
              {language === "en" ? "INTEGRATING SMART SYSTEMS AND AI BASICS" : "INTEGRASI SISTEM CERDAS DAN DASAR KECERDASAN BUATAN"} <br />
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-white bg-clip-text text-transparent">
                {t("edu.header_title_gradient", "ACADEMIC KNOWLEDGE SUITE")}
              </span>
            </h1>
            
            <p className="text-slate-400 text-sm md:text-md max-w-2xl mx-auto font-sans font-medium leading-relaxed">
              {t("edu.header_subtitle", "Learn the core foundations of artificial intelligence science, AutoML algorithm workflows in Mechanical Engineering, and the journey of intelligent computing technologies.")}
            </p>
          </div>

          {/* Premium Selector Navigation Tab Docks */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <button
              onClick={() => setActiveEduTab("basics")}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all duration-300 font-sans border font-bold uppercase text-xs tracking-wider ${
                activeEduTab === "basics"
                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-[0_4px_20px_rgba(99,102,241,0.25)] scale-[1.02]"
                  : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-white hover:bg-slate-900/40"
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>{t("edu.tab_basics", "AI Basics")}</span>
            </button>

            <button
              onClick={() => setActiveEduTab("system")}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all duration-300 font-sans border font-bold uppercase text-xs tracking-wider ${
                activeEduTab === "system"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.25)] scale-[1.02]"
                  : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-white hover:bg-slate-900/40"
              }`}
            >
              <Workflow className="w-5 h-5" />
              <span>{t("edu.tab_system", "How AI Works")}</span>
            </button>

            <button
              onClick={() => setActiveEduTab("evolution")}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all duration-300 font-sans border font-bold uppercase text-xs tracking-wider ${
                activeEduTab === "evolution"
                  ? "bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-[0_4px_20px_rgba(168,85,247,0.25)] scale-[1.02]"
                  : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-white hover:bg-slate-900/40"
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>{t("edu.tab_evolution", "AI Evolution")}</span>
            </button>

            <button
              onClick={() => setActiveEduTab("sandbox")}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all duration-300 font-sans border font-bold uppercase text-xs tracking-wider ${
                activeEduTab === "sandbox"
                  ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_4px_20px_rgba(6,182,212,0.25)] scale-[1.02]"
                  : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-white hover:bg-slate-900/40"
              }`}
            >
              <Sliders className="w-5 h-5" />
              <span>{t("edu.tab_sandbox", "Sandbox Simulation")}</span>
            </button>
          </div>

          {/* Core Content Shell with tactile Glassmorphism */}
          <div className="nm-card p-6 md:p-10 rounded-[2.5rem] relative backdrop-blur-3xl overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
            
            <AnimatePresence mode="wait">
              
              {/* TAB 1: DASAR-DASAR AI */}
              {activeEduTab === "basics" && (
                <motion.div
                  key="basics-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-10 text-left"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-black block">{t("edu.basics_pre", "LEARNING CORE MATERIAL")}</span>
                    <h2 className="text-2xl md:text-3.5xl font-black text-white uppercase tracking-tight font-sans">
                      {t("edu.basics_title", "MAIN CONCEPTS IN ARTIFICIAL INTELLIGENCE")}
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-2xl font-sans font-medium">
                      {t("edu.basics_subtitle", "Here is an explanation of four epistemological basic pillars for applied artificial intelligence in engineering fields.")}
                    </p>
                  </div>

                  {/* 4 Equal Height and Width Neumorphic Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {basicConcepts.map((item) => (
                      <div 
                        key={item.id}
                        className="nm-card p-6 sm:p-8 flex flex-col justify-between min-h-[280px] h-auto hover:translate-y-[-2px] transition-all duration-300 relative group"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="space-y-1.5">
                            <span className="text-[9.5px] font-mono font-bold text-slate-500 uppercase tracking-wide block">{item.topic}</span>
                            <h3 className="text-md sm:text-lg font-black text-white font-sans uppercase leading-tight tracking-tight">{item.title}</h3>
                          </div>
                          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl shrink-0">
                            {item.icon}
                          </div>
                        </div>

                        <p className="text-slate-400 text-xs sm:text-[13px] leading-relaxed font-sans font-medium line-clamp-3 my-2">
                          {item.desc}
                        </p>

                        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[9.5px] font-mono font-black text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-400/20">
                            {item.badge}
                          </span>
                          <span className="text-[8.5px] font-mono text-slate-500 tracking-wider">{t("nav.campus", "TEKNIK MESIN UMY")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 2: SISTEM KERJA AI */}
              {activeEduTab === "system" && (
                <motion.div
                  key="system-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-10 text-left"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-black block">{t("edu.system_pre", "PIPELINE EXECUTION FLOW")}</span>
                    <h2 className="text-2xl md:text-3.5xl font-black text-white uppercase tracking-tight font-sans">
                      {t("edu.system_title", "HOW DOES AN AI SYSTEM READ DATA & OPERATE?")}
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm font-sans font-medium">
                      {t("edu.system_subtitle", "Here is the lifecycle workflow from binary spreadsheet inputs up to precision predictions inside MechAutoML.")}
                    </p>
                  </div>

                  {/* Flow Steps - 4 Equal Balanced Boxes with Connected Arrow animations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {systemStages.map((stage, i) => (
                      <div 
                        key={stage.step}
                        className="nm-card p-6 flex flex-col justify-between min-h-[300px] h-auto relative transition-all duration-350 hover:translate-y-[-2px]"
                      >
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-3xl font-black font-mono bg-gradient-to-br from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                              {stage.step}
                            </span>
                            <span className="text-[8px] font-mono text-emerald-500 border border-emerald-500/10 px-2 py-0.5 rounded-md uppercase font-extrabold bg-emerald-500/5">
                              {t("edu.phase_prefix", "Phase")} {i + 1}
                            </span>
                          </div>

                          <h3 className="text-sm sm:text-base font-black text-white font-sans uppercase leading-tight tracking-tight mb-2">
                            {stage.title}
                          </h3>
                          <p className="text-slate-400 text-xs leading-relaxed font-sans font-medium">
                            {stage.desc}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-white/5 mt-3 text-[10px] text-slate-500 font-mono italic">
                          {stage.detail}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mechanical Visual representation of Neural Synthesis */}
                  <div className="p-8 rounded-3xl bg-black/40 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2.5 max-w-xl">
                      <h4 className="text-white font-black text-sm uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block animate-ping" />
                        {t("edu.synthesis_title", "AutoML Model Synthesis & Smart Predictions")}
                      </h4>
                      <p className="text-slate-400 text-xs leading-relaxed font-sans font-medium">
                        {t("edu.synthesis_subtitle", "Mech-AI technology leverages iterative grids where Extra Trees estimations are serially refined by dynamic XGBoost engines, preventing single-algorithm dependencies.")}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <svg className="w-24 h-24 animate-spin-around text-emerald-400" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 12" />
                        <polygon points="50,15 15,75 85,75" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" />
                        <circle cx="50" cy="50" r="10" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: PERKEMBANGAN AI */}
              {activeEduTab === "evolution" && (
                <motion.div
                  key="evolution-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-10 text-left"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-black block">{t("edu.evolution_pre", "CHRONOLOGY TIMELINE")}</span>
                    <h2 className="text-2xl md:text-3.5xl font-black text-white uppercase tracking-tight font-sans">
                      {t("edu.evolution_title", "HISTORY AND EVOLVING PHASES OF AI THROUGH THE YEARS")}
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm font-sans font-medium">
                      {t("edu.evolution_subtitle", "Here is the timeline trace of artificial intelligence evolution from automata logic theories up to automated machine learning (AutoML) systems.")}
                    </p>
                  </div>

                  {/* Vertical Timeline Tree */}
                  <div className="space-y-6 relative border-l border-white/5 pl-6 sm:pl-10 ml-4 max-w-5xl">
                    {evolutionTimeline.map((item, index) => (
                      <div key={item.phase} className="relative group">
                        
                        {/* Bullet points indicators */}
                        <div className={`absolute -left-[35px] sm:-left-[51px] top-1.5 w-7 h-7 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 ${
                          item.pulse 
                            ? "bg-purple-500/10 border-purple-400 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.4)] animate-pulse" 
                            : "bg-[#0a0d14] border-white/10 text-slate-500"
                        }`}>
                          <span className="text-[10px] font-mono font-black">{index + 1}</span>
                        </div>

                        {/* Timeline Neumorphic Panels with identical design layout */}
                        <div className="bg-[#0a0d14] border border-white/5 rounded-3xl p-6 sm:p-7 shadow-[10px_10px_20px_rgba(0,0,0,0.8)] hover:border-purple-500/20 transition-all duration-300">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <span className="text-xs font-bold font-mono text-purple-400 uppercase tracking-wider block">
                              {item.phase}
                            </span>
                            <span className="text-[9px] font-mono text-slate-500 bg-white/[0.02] px-2.5 py-0.5 rounded-full border border-white/5 uppercase font-bold">
                              {item.status}
                            </span>
                          </div>

                          <h3 className="text-base sm:text-lg font-sans font-black text-white uppercase tracking-tight">
                            {item.headline}
                          </h3>
                          <p className="text-slate-400 text-xs sm:text-[13px] leading-relaxed font-sans font-medium mt-1">
                            {item.desc}
                          </p>
                        </div>

                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 4: INTERACTIVE SANDBOX */}
              {activeEduTab === "sandbox" && (
                <motion.div
                  key="sandbox-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-10 text-left"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-black block">{t("edu.sandbox_pre", "INTERACTIVE SIMULATION")}</span>
                    <h2 className="text-2xl md:text-3.5xl font-black text-white uppercase tracking-tight font-sans">
                      {t("edu.sandbox_title", "STUDENT CORNER: INTERACTIVE PREDICTOR SANDBOX")}
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm font-sans font-medium">
                      {t("edu.sandbox_subtitle", "Use the controls below to simulate how dataset quality and model parameter layers affect weighting quality and ML prediction accuracy.")}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2" style={{ perspective: "1250px" }}>
                    
                    {/* Left Side Sandbox Variable Sliders (Tactile 3D Console deck) */}
                    <motion.div 
                      whileHover={{ transform: "rotateY(1.5deg) rotateX(1deg) translateZ(4px)", boxShadow: "20px 20px 50px rgba(0,0,0,0.92)" }}
                      transition={{ type: "spring", stiffness: 350, damping: 22 }}
                      className="lg:col-span-7 nm-card p-6 sm:p-8 flex flex-col justify-between space-y-6 [transform-style:preserve-3d]"
                    >
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full bg-cyan-500/5 font-black tracking-widest uppercase">
                          {t("edu.sandbox_lbl_manipulate", "3D NEUMORPHIC HARDWARE DECK AUTOMATED MODEL TUNING")}
                        </span>
                      </div>

                      <div className="space-y-6">
                        
                        {/* Dataset Cleanliness - Real-Time 3D Slider */}
                        <div className="space-y-2 p-4 rounded-2xl bg-[#04050a] border border-white/5 shadow-[inset_4px_4px_10px_rgba(0,0,0,0.9)] hover:border-emerald-500/30 transition-all duration-300">
                          <div className="flex justify-between items-center text-xs font-mono">
                            <span className="text-slate-300 font-extrabold uppercase flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                              {t("edu.param_cleanliness", "DATASET PURITY INDEX")}
                            </span>
                            <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">{dataCleanLevel}%</span>
                          </div>
                          
                          <div className="relative flex items-center py-2">
                            <input 
                              type="range" 
                              min="20" 
                              max="100" 
                              value={dataCleanLevel} 
                              onChange={(e) => setDataCleanLevel(Number(e.target.value))}
                              className="w-full accent-emerald-400 h-1.5 rounded-full bg-black border border-white/5 cursor-pointer outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"
                            />
                          </div>
                          
                          <div className="flex justify-between text-[10px] text-slate-500 font-sans leading-relaxed">
                            <span>{t("edu.param_cleanliness_desc", "Reduces outliers, standard error deviation of feature attributes.")}</span>
                            <span className="font-mono text-emerald-500/80 font-semibold">MSE: {(Math.pow(100 - dataCleanLevel, 1.5) / 1000).toFixed(4)}</span>
                          </div>
                        </div>

                        {/* Model Complexity - Tree Depth / Estimators */}
                        <div className="space-y-2 p-4 rounded-2xl bg-[#04050a] border border-white/5 shadow-[inset_4px_4px_10px_rgba(0,0,0,0.9)] hover:border-indigo-500/30 transition-all duration-300">
                          <div className="flex justify-between items-center text-xs font-mono">
                            <span className="text-slate-300 font-extrabold uppercase flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                              {t("edu.param_complexity", "ESTIMATORS TREE DEPTH (MAX_DEPTH)")}
                            </span>
                            <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 font-bold">{modelComplexity}%</span>
                          </div>
                          
                          <div className="relative flex items-center py-2">
                            <input 
                              type="range" 
                              min="10" 
                              max="100" 
                              value={modelComplexity} 
                              onChange={(e) => setModelComplexity(Number(e.target.value))}
                              className="w-full accent-indigo-400 h-1.5 rounded-full bg-black border border-white/5 cursor-pointer outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"
                            />
                          </div>

                          <div className="flex justify-between text-[10px] text-slate-500 font-sans leading-relaxed">
                            <span>{t("edu.param_complexity_desc", "Configures complex layers split boundaries to lock non-linear weight bounds.")}</span>
                            <span className="font-mono text-indigo-500/80 font-semibold">Layers: {Math.floor(modelComplexity / 5)}</span>
                          </div>
                        </div>

                        {/* Normalization Ratio - Scaling Index */}
                        <div className="space-y-2 p-4 rounded-2xl bg-[#04050a] border border-white/5 shadow-[inset_4px_4px_10px_rgba(0,0,0,0.9)] hover:border-purple-500/30 transition-all duration-300">
                          <div className="flex justify-between items-center text-xs font-mono">
                            <span className="text-slate-300 font-extrabold uppercase flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                              {t("edu.param_normalization", "NORMALIZATION / SCALING INDEX (MinMax)")}
                            </span>
                            <span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20 font-bold">{noiseReduction}%</span>
                          </div>
                          
                          <div className="relative flex items-center py-2">
                            <input 
                              type="range" 
                              min="30" 
                              max="100" 
                              value={noiseReduction} 
                              onChange={(e) => setNoiseReduction(Number(e.target.value))}
                              className="w-full accent-purple-400 h-1.5 rounded-full bg-black border border-white/5 cursor-pointer outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"
                            />
                          </div>

                          <div className="flex justify-between text-[10px] text-slate-500 font-sans leading-relaxed">
                            <span>{t("edu.param_normalization_desc", "Aligns numeric ranges of attributes to keep convergence paths stable.")}</span>
                            <span className="font-mono text-purple-500/80 font-semibold">LR rate: {(noiseReduction * 0.001 + 0.005).toFixed(3)}</span>
                          </div>
                        </div>

                        {/* Selected Ingress Regressor Algorithm */}
                        <div className="space-y-3 pt-2">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold block">
                            {t("edu.lbl_sel_algo", "CHOOSE MODEL ALGORITHM BASE")}
                          </span>
                          <div className="grid grid-cols-3 gap-3">
                            {["ExtraTrees", "CatBoost", "XGBoost"].map((m) => {
                              const isSelected = selectedAIModel === m;
                              return (
                                <button
                                  key={m}
                                  onClick={() => setSelectedAIModel(m as any)}
                                  className={`relative py-3 rounded-xl text-center text-[10.5px] font-mono font-black uppercase tracking-widest border transition-all duration-300 cursor-pointer ${
                                    isSelected
                                      ? "bg-slate-900 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15),inset_2px_2px_5px_rgba(0,0,0,0.8)] scale-[1.03]"
                                      : "bg-black/50 border-white/5 text-slate-400 hover:text-white hover:border-white/10 hover:bg-slate-900 shadow-[3px_3px_6px_rgba(0,0,0,0.6)]"
                                  }`}
                                >
                                  {isSelected && (
                                    <span className="absolute -top-1.5 -right-1 flex h-3 w-3">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                                    </span>
                                  )}
                                  {m}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    </motion.div>

                    {/* Right Side Predictive Metric gauges (Realistic Neumorphic Circular Dashboard) */}
                    <motion.div 
                      whileHover={{ transform: "rotateY(-1.5deg) rotateX(1deg) translateZ(4px)", boxShadow: "20px 20px 50px rgba(0,0,0,0.92)" }}
                      transition={{ type: "spring", stiffness: 350, damping: 22 }}
                      className="lg:col-span-5 nm-card p-6 sm:p-8 flex flex-col justify-between overflow-hidden relative text-left [transform-style:preserve-3d]"
                    >
                      <div className="space-y-5">
                        <span className="text-[8px] font-mono text-cyan-300 border border-cyan-500/20 px-2.5 py-1 rounded-full bg-cyan-500/5 font-black tracking-widest uppercase inline-block">
                          {t("edu.gauge_title", "FINAL MODEL PREDICTIVE ESTIMATION")}
                        </span>

                        {/* Interactive Rotating SVG Gauge */}
                        <div className="flex flex-col items-center justify-center py-4 relative">
                          <div className="relative w-44 h-44 flex items-center justify-center p-3 rounded-full bg-black/60 border border-white/5 shadow-[inset_6px_6px_15px_rgba(0,0,0,0.9),4px_4px_12px_rgba(255,255,255,0.02)]">
                            {/* SVG Speedometer Dial Arc */}
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                              {/* Background concentric reference track */}
                              <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                className="stroke-slate-900 fill-none" 
                                strokeWidth="6" 
                              />
                              {/* Glowing Active Track */}
                              <motion.circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                className="stroke-cyan-500 fill-none" 
                                strokeWidth="6" 
                                strokeDasharray="251.2"
                                initial={{ strokeDashoffset: 251.2 }}
                                animate={{ strokeDashoffset: 251.2 - (251.2 * parseFloat(simulatedAccuracy)) / 100 }}
                                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                                strokeLinecap="round"
                                style={{ filter: "drop-shadow(0px 0px 6px rgba(6,182,212,0.6))" }}
                              />
                            </svg>

                            {/* Centered Neumorphic Accuracy Readout */}
                            <div className="absolute inset-5 rounded-full bg-[#05060b] border border-white/10 flex flex-col items-center justify-center shadow-[5px_5px_10px_rgba(0,0,0,0.8),-2px_-2px_6px_rgba(255,255,255,0.02)]">
                              <span className="text-[9px] font-mono text-cyan-400/70 font-black tracking-widest uppercase">COEF R²</span>
                              <motion.span 
                                key={simulatedAccuracy} 
                                initial={{ scale: 0.85, opacity: 0.5 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-3xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-cyan-300"
                              >
                                {simulatedAccuracy}%
                              </motion.span>
                              <span className="text-[7.5px] font-mono text-slate-500 uppercase font-black">{selectedAIModel}</span>
                            </div>
                          </div>
                        </div>

                        {/* Dynamic hyperparameter calibration status nodes */}
                        <div className="space-y-3 font-mono text-[11px] pt-4 border-t border-white/5">
                          <div className="flex justify-between items-center text-slate-400">
                            <span>{t("edu.lbl_outlier", "Outlier Variance Estimation")}</span>
                            <span className="text-red-400 font-extrabold font-mono bg-red-400/5 px-2 py-0.5 rounded border border-red-500/10">
                              {((100 - dataCleanLevel) * 0.15).toFixed(2)}%
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center text-slate-400">
                            <span>{t("edu.lbl_convergence", "Model Convergence Steps")}</span>
                            <span className="text-cyan-400 font-extrabold font-mono bg-cyan-400/5 px-2 py-0.5 rounded border border-cyan-500/10">
                              {(modelComplexity * 0.95).toFixed(1)} iter
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-slate-400 font-bold">
                            <span>{t("edu.lbl_optimality", "Accuracy Bounds")}</span>
                            <span className={`text-[9.5px] font-mono font-black uppercase px-2.5 py-0.5 rounded border ${
                              parseFloat(simulatedAccuracy) > 85 
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                                : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                            }`}>
                              {parseFloat(simulatedAccuracy) > 85 ? t("edu.status_optimal", "HIGHLY OPTIMAL") : t("edu.status_suboptimal", "SUBOPTIMAL (DATA NOISE)")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-400 font-sans leading-relaxed text-left border-t border-white/5 pt-4 mt-6 select-none">
                        <span className="font-black text-cyan-400">Lesson Principle:</span> {t("edu.sandbox_lesson", "Increasing model tree depth on noisy data causes overfitting (high variance). Clean preprocessing calibration (Purity > 80%) remains the key to real-world deployment accuracy.")}
                      </div>
                    </motion.div>

                  </div>
                </motion.div>
              )}

            </AnimatePresence>

          </div>

          {/* SOP Core guidance banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none" id="neumorphic_edu_specs_grid">
            
            <div className="nm-card p-6.5 flex flex-col justify-between min-h-[190px] h-auto transition-all duration-300 text-left hover:scale-[1.005]">
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">{t("edu.card1_topic", "Teori Automata")}</span>
                  <h3 className="text-sm font-black text-white font-sans uppercase leading-tight">{t("edu.card1_title", "1. Representasi Fitur")}</h3>
                </div>
                <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 shrink-0">
                  <BrainCircuit className="w-4 h-4" />
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed font-sans pt-1">
                {t("edu.card1_desc", "Cara representasi angka biner menjadi nilai kontinu dari karakteristik fisik logam presisi.")}
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9.5px] font-mono text-indigo-400 font-bold uppercase bg-indigo-500/10 px-2 py-0.5 rounded">{t("edu.card1_badge", "Fisika Cerdas")}</span>
                <span className="text-[8.5px] font-mono text-slate-500">{t("edu.card1_sub", "LAB TEKNIK")}</span>
              </div>
            </div>

            <div className="nm-card p-6.5 flex flex-col justify-between min-h-[190px] h-auto transition-all duration-300 text-left hover:scale-[1.005]">
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">{t("edu.card2_topic", "Matematika Sistem")}</span>
                  <h3 className="text-sm font-black text-white font-sans uppercase leading-tight">{t("edu.card2_title", "2. Fungsi Kerugian (Loss)")}</h3>
                </div>
                <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 shrink-0">
                  <Workflow className="w-4 h-4" />
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed font-sans pt-1">
                {t("edu.card2_desc", "Mengukur besarnya deviasi antara nilai prediksi model AI dengan data sesungguhnya menggunakan MAE/RMSE.")}
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9.5px] font-mono text-emerald-400 font-bold uppercase bg-emerald-500/10 px-2 py-0.5 rounded">{t("edu.card2_badge", "Akurasi Statistik")}</span>
                <span className="text-[8.5px] font-mono text-slate-500 font-bold">{t("edu.card2_sub", "UMY MESIN")}</span>
              </div>
            </div>

            <div className="nm-card p-6.5 flex flex-col justify-between min-h-[190px] h-auto transition-all duration-300 text-left hover:scale-[1.005]">
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">{t("edu.card3_topic", "Etika Komputasi")}</span>
                  <h3 className="text-sm font-black text-white font-sans uppercase leading-tight">{t("edu.card3_title", "3. Validasi Otonom")}</h3>
                </div>
                <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400 shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed font-sans pt-1">
                {t("edu.card3_desc", "Kombinasi model dalam ensemble ditujukan untuk mendistribusikan simpangan secara rata demi integritas keputusan akademik.")}
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9.5px] font-mono text-purple-400 font-bold uppercase bg-purple-500/10 px-2 py-0.5 rounded">{t("edu.card3_badge", "ZainProject Core")}</span>
                <span className="text-[8.5px] font-mono text-slate-500">2026 EDITION</span>
              </div>
            </div>

          </div>

        </div>

      </InfiniteGrid>
    </div>
  );
}
