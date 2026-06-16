import { useState, useEffect } from "react";
import { ActiveTab } from "../types";
import { 
  ArrowRight, UploadCloud, Cpu, Play, 
  Settings, Layers, TrendingUp, HelpCircle, GraduationCap, Code, Sparkles, Database,
  Gauge, Flame, Sliders, Activity, Search, BookOpen, Scale, Info, Workflow, Compass, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FeatureCard } from "@/components/ui/grid-feature-cards";
import RobotMechanicalAnimation from "./RobotMechanicalAnimation";
import { FacultyCommentsSection } from "./sections/faculty-comments-section";
import { useLanguage } from "../context/LanguageContext";
import { GooeyText } from "./ui/gooey-text-morphing";
import InkReveal from "./ui/ink-reveal";
import AnimatedGenerateButton from "./ui/animated-generate-button-shadcn-tailwind";


interface LandingPageProps {
  setActiveTab: (tab: ActiveTab) => void;
  datasetLoaded: boolean;
}

export default function LandingPage({ setActiveTab, datasetLoaded }: LandingPageProps) {
  const { t } = useLanguage();

  // Advanced Stateful Interactive Mechanical Assembly Simulator
  const [millingRpm, setMillingRpm] = useState<number>(4500);
  const [feedRate, setFeedRate] = useState<number>(120);
  const [coolantFlow, setCoolantFlow] = useState<number>(18);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [searchVal, setSearchVal] = useState<string>("");

  // Dynamic forecasting indicators computed on-the-fly using material science formulations
  const predictedHardness = (48.4 - (millingRpm / 14000) * (feedRate / 200) + (coolantFlow * 0.12)).toFixed(2);
  const predictedWear = ((millingRpm / 4000) * 0.8 + (feedRate / 100) * 1.45 - (coolantFlow * 0.08)).toFixed(3);
  const predictedTemp = (120 + (millingRpm / 12) * (feedRate / 180) - (coolantFlow * 1.9)).toFixed(1);

  // Generate dynamic wave path based on active parameters representing ultrasonic stress response
  const [waveSeed, setWaveSeed] = useState(0);
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setWaveSeed(s => (s + 0.15) % (Math.PI * 2));
    }, 45);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const cncSpeedFactor = millingRpm / 4000;
  // CNC carriage horizontal movement coordinates across the workpiece
  const cncX = isSimulating ? 170 + Math.sin(waveSeed * 0.45 * (cncSpeedFactor + 0.3)) * 65 : 170;
  // Spindle vertical cutter depth coordinate
  const cncY = isSimulating ? 34 + Math.abs(Math.sin(waveSeed * 0.9)) * 12 : 38;
  
  // Rotating HSS Cutter Spindle rotation calculated from tool RPM speed
  const spindleRotation = isSimulating ? (waveSeed * (millingRpm / 150)) % 360 : 45;
  
  // Interactive Companion Rotational Gear Train ("Mesin Lain")
  // Representing axis feed stepper gear motors mesh with clear structural spokes ("ruji")
  const gearSpeed = isSimulating ? waveSeed * (millingRpm / 4000 + feedRate / 180) : 0;
  const gear1Rotation = gearSpeed * 80;
  const gear2Rotation = -gearSpeed * 110; 
  const gear3Rotation = gearSpeed * 150;

  // High speed sparks & particle scatter coordinate variables at point of milling contact
  const isCuttingContact = isSimulating && Math.abs(cncX - 170) < 64; // spark only when near the billet block
  const sparkXOffset1 = isSimulating ? Math.sin(waveSeed * 18) * 8 : 0;
  const sparkYOffset1 = isSimulating ? Math.cos(waveSeed * 12) * 6 : 0;
  const sparkXOffset2 = isSimulating ? Math.cos(waveSeed * 22) * 7 : 0;
  const sparkYOffset2 = isSimulating ? Math.sin(waveSeed * 16) * 5 : 0;

  // Coolant Offset system flow calculations
  const coolantFlowSpeed = coolantFlow / 8;
  const coolantFlowOffset = isSimulating ? (waveSeed * (coolantFlowSpeed + 0.4) * 8) % 48 : 0;

  // Custom Search trigger list to act as dynamic shortcut finder matching the provided image
  const searchItems = [
    { label: "Upload Engineering Spreadsheet Data", tab: "upload" as ActiveTab },
    { label: "AutoML Training (Extra Trees, CatBoost, XGBoost)", tab: "train" as ActiveTab },
    { label: "Model Multi-Metric Performance Dashboard", tab: "performance" as ActiveTab },
    { label: "Workflow Matrices & ML Execution Guidelines", tab: "workflow" as ActiveTab },
    { label: "Engineering AI Ethics & Transparency Charter", tab: "ethics" as ActiveTab },
    { label: "About ZainProject Academic Core", tab: "about" as ActiveTab },
  ];

  const filteredSearch = searchVal 
    ? searchItems.filter(item => item.label.toLowerCase().includes(searchVal.toLowerCase()))
    : [];

  const benefits = [
    {
      title: t("benefit.title1", "Upload Engineering Datasets"),
      description: t("benefit.desc1", "Easily drag and drop CSV or XLSX datasets containing mechanical test records, material strengths, milling outputs, or thermodynamics statistics."),
      icon: UploadCloud,
    },
    {
      title: t("benefit.title2", "Define Target Variables"),
      description: t("benefit.desc2", "Independently select multiple input features (materials, speeds, pressures) and a target variable (wear, stress, hardness) for supervised regression."),
      icon: Settings,
    },
    {
      title: t("benefit.title3", "Train AI/ML Models"),
      description: t("benefit.desc3", "Optimize parameters recursively using tree splitting algorithms and sequential boosting residuals inside premium ML models, fully optimized in TypeScript."),
      icon: Cpu,
    },
    {
      title: t("benefit.title4", "Compare Advanced Regressors"),
      description: t("benefit.desc4", "Simultaneously train and contrast robust Extremely Randomized Trees, Oblivious Symmetric Trees (CatBoost), and Loss-Regularized Boosted Trees (XGBoost)."),
      icon: Layers,
    },
    {
      title: t("benefit.title5", "Visualize Prediction Accuracy"),
      description: t("benefit.desc5", "Inspect beautiful interactively plotted Actual vs Predicted scatter charts, feature importances, and error residual histograms."),
      icon: TrendingUp,
    },
    {
      title: t("benefit.title6", "Cache Multi-Metric Evaluations"),
      description: t("benefit.desc6", "Instantly analyze model comparisons and save performance reports locally in your academic browser session for offline verification."),
      icon: Play,
    },
  ] as const;

  return (
    <div className="space-y-16 py-4 text-left relative overflow-hidden" id="landing_page_viewport">
      
      {/* GLOSSY METALLIC BLACK CONTAINER INSIDE CENTRAL BODY */}
      <div className="relative rounded-[32px] overflow-hidden border border-white/[0.08]" style={{ background: "linear-gradient(180deg, #050507 0%, #000000 100%)" }}>
        
        {/* Dynamic decorative neon highlights across corners */}
        <div className="absolute top-0 left-[-10%] w-[320px] h-[320px] bg-gradient-to-tr from-indigo-500/[0.06] via-transparent to-transparent rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-br from-indigo-600/[0.05] via-transparent to-transparent rounded-full blur-[130px] pointer-events-none" />

        {/* Removed duplicate navigation header to prevent double headers. Main navigation is managed in App.tsx */}
        <div className="w-full pt-8" />

        {/* 2. MAJESTIC GLOSSY HERO BLOCK MATCHING THE PROVIDED IMAGE - NOW ENLARGED */}
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-8 md:px-12 pt-20 pb-20 relative z-10 flex flex-col items-center">
          
          {/* Subtle hexagon shapes floating in the backdrop */}
          <div className="absolute top-[20%] left-[5%] opacity-[0.06] pointer-events-none select-none">
            <svg width="120" height="120" viewBox="0 0 100 100" className="text-indigo-400 fill-none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="50,1 95,25 95,75 50,99 5,75 5,25" />
            </svg>
          </div>
          <div className="absolute bottom-[20%] right-[5%] opacity-[0.05] pointer-events-none select-none">
            <svg width="100" height="100" viewBox="0 0 100 100" className="text-cyan-400 fill-none" stroke="currentColor" strokeWidth="2">
              <polygon points="50,1 95,25 95,75 50,99 5,75 5,25" />
            </svg>
          </div>

          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-mono tracking-widest text-indigo-400 mb-8 uppercase shadow-[0_0_20px_rgba(99,102,241,0.15)] animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: "3s" }} />
            <span>{t("hero.badge", "ZAINPROJECT • NIM: 20230130023 • MECH AI ENGINEER")}</span>
          </div>

          {/* Huge Beautiful Styled Typography - Majestic, dense, premium and futuristic */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-sans font-black tracking-tight leading-[1.05] text-white uppercase text-center">
            {t("hero.title_part1", "AI-POWERED")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-white font-black">
              {t("hero.title_part2", "ENGINEERING PREDICTION")}
            </span>
          </h1>

          <p className="text-slate-305 text-[14px] sm:text-[16px] max-w-4xl font-normal mt-6 leading-relaxed text-center">
            {t("hero.subtitle", "MECH AI ENGINEER is a web-based machine learning platform designed to support engineering data analysis and prediction. Upload datasets, select input features and target outputs, train AI models, compare model performance, visualize evaluation results, and generate engineering predictions quickly, accurately, and systematically.")}
          </p>

          {/* Action Navigation Buttons - Standardized with AnimatedGenerateButton */}
          <div className="flex flex-wrap items-center justify-center gap-5 mt-10">
            <AnimatedGenerateButton
              labelIdle={t("btn.start_predict", "Launch AutoML Compiler")}
              onClick={() => setActiveTab("upload")}
            />
            <AnimatedGenerateButton
              labelIdle={t("btn.upload_dataset", "Upload Dataset")}
              onClick={() => setActiveTab("upload")}
            />
            <AnimatedGenerateButton
              labelIdle={t("btn.view_workflow", "View ML Workflow")}
              onClick={() => setActiveTab("workflow")}
            />
          </div>

        </div>
      </div>

      {/* Premium Robot Mechanical Core Animation Section */}
      <div className="relative border-y border-white/5 py-4">
        <RobotMechanicalAnimation />
      </div>

      {/* Benefits Section with custom Grid Pattern feature cards */}
      <div className="space-y-8" id="benefits_section">
        <div className="max-w-3xl text-center mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-white tracking-tight text-center">
            {t("cap.title", "Integrated Machine Learning Core Capabilities")}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mx-auto max-w-2xl text-center">
            {t("cap.desc", "Every analytical coordinate is mapped of physical measurement, attribute matrix dependency, selection boundaries, and metric loss residual.")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="benefits_grid">
          {benefits.map((b, i) => (
            <FeatureCard key={i} feature={b} />
          ))}
        </div>
      </div>

      {/* Scroll Reel Lecturer Comments Section */}
      <FacultyCommentsSection />

      {/* Premium 3D Glowing Cyber Watermark Plate */}
      <motion.div 
        id="academic_footer_banner"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ 
          scale: 1.015,
          borderColor: "rgba(34, 211, 238, 0.4)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.95), 0 0 40px rgba(6, 182, 212, 0.25), inset 0 1px 1px rgba(255,255,255,0.1)"
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#03050b] via-[#070b1a] to-[#03050b] border border-white/[0.06] p-7 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_20px_40px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.03)] select-none text-center md:text-left cursor-default group"
      >
        {/* Sleek moving light sweep effect at the top */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/40 to-indigo-500/40 to-transparent pointer-events-none" />
        <div className="absolute -inset-y-12 w-1/3 bg-white/[0.01] blur-3xl transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out pointer-events-none" />
        
        {/* Left Segment: Course Title */}
        <div className="flex-1 flex justify-center md:justify-start items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping absolute" />
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mr-2" />
          <span className="font-mono font-black text-[10px] md:text-xs tracking-widest bg-gradient-to-r from-indigo-200 via-white to-cyan-300 bg-clip-text text-transparent drop-shadow-md">
            {t("footer.course", "BASICS OF ARTIFICIAL INTELLIGENCE")}
          </span>
        </div>

        {/* Dynamic Glowing 3D Laser Separation Beam */}
        <span className="text-cyan-400/80 font-mono text-[11px] font-black hidden md:block select-none animate-pulse drop-shadow-[0_0_6px_rgba(34,211,238,0.7)] px-2">
          ||
        </span>

        {/* Middle Segment: Institution */}
        <div className="flex-1 flex justify-center items-center">
          <span className="font-mono font-extrabold text-[10px] md:text-xs tracking-wider text-slate-100 hover:text-cyan-300 transition-colors duration-300 drop-shadow-sm uppercase">
            {t("footer.institution", "UNIVERSITAS MUHAMMADIYAH YOGYAKARTA")}
          </span>
        </div>

        {/* Dynamic Glowing 3D Laser Separation Beam */}
        <span className="text-indigo-400/85 font-mono text-[11px] font-black hidden md:block select-none animate-pulse drop-shadow-[0_0_6px_rgba(99,102,241,0.7)] px-2">
          ||
        </span>

        {/* Right Segment: Creator Signature */}
        <div className="flex-1 flex justify-center md:justify-end items-center">
          <span className="font-mono font-black text-[11px] md:text-sm tracking-widest bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.4)] relative">
            {t("footer.creator", "ZAINPROJECT")}
            <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-gradient-to-r from-cyan-400/10 via-cyan-400 to-indigo-400/10 scale-x-50 group-hover:scale-x-100 transition-transform duration-500" />
          </span>
        </div>
      </motion.div>

    </div>
  );
}
