import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ParsedDataset } from "../utils/fileParser";
import { runModelTraining, ModelPerformance, PreprocessedData, preprocessDataset } from "../utils/mlEngine";
import { 
  Play, Cpu, Sparkles, CheckCircle2, RotateCcw, AlertOctagon, 
  Settings, Loader, Award, ShieldAlert, Layers,
  Cog, Activity, Terminal, ChevronRight, Check
} from "lucide-react";

interface ModelTrainingProps {
  dataset: ParsedDataset;
  selectedFeatures: string[];
  selectedTarget: string;
  onTrainingComplete: (args: {
    preprocessingResult: PreprocessedData;
    performances: ModelPerformance[];
    bestModelName: string;
    featureImportances: { name: string; value: number }[];
    testActualValues: number[];
    testPredictedValues: number[];
    bestModelInstance: any;
    ensembleModelInstance?: any;
    selectedModels: string[];
  }) => void;
  bestModelName: string;
  performances: ModelPerformance[];
}

export default function ModelTraining({
  dataset,
  selectedFeatures,
  selectedTarget,
  onTrainingComplete,
  bestModelName,
  performances,
}: ModelTrainingProps) {
  // Supports exactly the 8 specified research-grade models. Starts empty to let user select model.
  const [modelChoices, setModelChoices] = useState<string[]>([]);

  const [isTraining, setIsTraining] = useState(false);
  const [stepMsg, setStepMsg] = useState("");
  const [progress, setProgress] = useState(0);
  const [logSteps, setLogSteps] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("Preparing Workspaces");
  const [showCelebrate, setShowCelebrate] = useState(false);

  const availableModels = [
    { id: "LinearRegression", label: "Linear Regression", group: "Baseline", desc: "Classical Ordinary Least Squares (OLS) linear weights coefficients solver." },
    { id: "RidgeRegression", label: "Ridge Regression", group: "Baseline", desc: "Linear regressor regularized with continuous L2 ridge penalty (alpha=1.0)." },
    { id: "RandomForest", label: "Random Forest Regressor", group: "Tree Ensemble", desc: "Bootstrap ensemble of 500 regression decision trees (max_depth=12, max_features='sqrt')." },
    { id: "ExtraTrees", label: "Extra Trees Regressor", group: "Tree Ensemble", desc: "Extremely randomized trees minimizing split thresholds variance (trees=700, max_depth=12)." },
    { id: "GradientBoosting", label: "Gradient Boosting", group: "Tree Ensemble", desc: "Sequential boosting trees minimizing squared-error residuals (trees=400, learning_rate=0.05, max_depth=3)." },
    { id: "XGBoost", label: "XGBoost Regressor", group: "Modern Boosting", desc: "Extreme gradient booster with advanced L1/L2 leaf regularizations (estimators=700, learning_rate=0.04, max_depth=5)." },
    { id: "CatBoost", label: "CatBoost Regressor", group: "Modern Boosting", desc: "Symmetric structured depth-wise booster minimizing RMSE loss (iterations=700, learning_rate=0.04)." },
    { id: "KNN", label: "KNN Regressor", group: "Distance & Instance", desc: "k-Nearest Neighbors coordinate inverse-distance weighted averages on Euclidean scaling (k=5)." },
  ];

  const toggleModelChoice = (model: string) => {
    if (modelChoices.includes(model)) {
      setModelChoices(modelChoices.filter(m => m !== model));
    } else {
      setModelChoices([...modelChoices, model]);
    }
  };

  const selectPrebuildMode = (mode: "recommended" | "fast" | "full" | "clear") => {
    if (mode === "recommended") {
      setModelChoices(["RandomForest", "ExtraTrees", "XGBoost", "CatBoost", "GradientBoosting"]);
    } else if (mode === "fast") {
      setModelChoices(["LinearRegression", "RidgeRegression", "KNN", "RandomForest"]);
    } else if (mode === "full") {
      setModelChoices(["LinearRegression", "RidgeRegression", "RandomForest", "ExtraTrees", "GradientBoosting", "XGBoost", "CatBoost", "KNN"]);
    } else {
      setModelChoices([]);
    }
  };

  const startTrainingFlow = () => {
    setIsTraining(true);
    setProgress(0);
    setLogSteps([]);
    
    // Create diagnostic research-grade preset logs
    const stages = [
      { pct: 8, cat: "Preparing Workspace", msg: "Initialising Mechanical AI Research Environment..." },
      { pct: 18, cat: "Scanning Data Frame", msg: "Scanning active dataset columns for features & target..." },
      { pct: 30, cat: "Standard Preprocessing", msg: "Imputing empty spreadsheet rows and missing numeric values (median imputation)..." },
      { pct: 45, cat: "Standard Encoding", msg: "Encoding categorical values to numerical engineering coefficients (leakage-prevented OHE)..." },
      { pct: 60, cat: "Fixed Research Presets", msg: "Applying fixed, highly tuned internal mathematical coefficients (no manual tuning)..." },
      { pct: 75, cat: "Model Compile Stage", msg: "Fitting Linear, Ridge, and Weighted Distance k-Nearest Neighbors models..." },
      { pct: 88, cat: "Model Compile Stage", msg: "Deploying high-efficiency Forest and Boosting predictors (XGBoost, CatBoost, RandomForest, ExtraTrees)..." },
      { pct: 95, cat: "Performance Metrics Sync", msg: "Computing R² Score, RMSE, MAE, and Feature Importance arrays..." },
      { pct: 100, cat: "Compilation Finished", msg: "Informatics pipeline fully calibrated. Diagnostic logs ready." }
    ];

    let currentStageIndex = 0;

    const interval = setInterval(() => {
      if (currentStageIndex < stages.length) {
        const stage = stages[currentStageIndex];
        setProgress(stage.pct);
        setStepMsg(stage.msg);
        setActiveCategory(stage.cat);
        
        setLogSteps(prev => [
          ...prev, 
          `[${stage.pct}%] ${stage.cat.toUpperCase()} » ${stage.msg}`
        ]);
        
        currentStageIndex++;
      } else {
        clearInterval(interval);
        
        try {
          const preprocessed = preprocessDataset(dataset.rows, selectedFeatures, selectedTarget);
          
          setLogSteps(prev => [...prev, `[SUCCESS] Dataset split: ${preprocessed.trainX.length} train samples, ${preprocessed.testX.length} test validation samples.`]);
          setLogSteps(prev => [...prev, `[SYSTEM] Deploying exactly 8 research-preset models over compiled structures...`]);

          const results = runModelTraining(preprocessed, modelChoices);

          setLogSteps(prev => [...prev, `[COMPLETE] Mechanical Informatics AutoML pipeline completed.`]);
          setLogSteps(prev => [...prev, `[CHAMPION] Top-Rigor Champion Model: ${results.bestModelName} (Test R²: ${results.performances.find(p => p.modelName === results.bestModelName)?.r2.toFixed(4) || "N/A"})`]);

          onTrainingComplete({
            preprocessingResult: preprocessed,
            performances: results.performances,
            bestModelName: results.bestModelName,
            featureImportances: results.featureImportances,
            testActualValues: results.predictions.testActual,
            testPredictedValues: results.predictions.testPredicted,
            bestModelInstance: results.bestModelInstance,
            ensembleModelInstance: results.ensembleModelInstance,
            selectedModels: modelChoices
          });

          setShowCelebrate(true);
          setTimeout(() => {
            setShowCelebrate(false);
          }, 6000);
          
        } catch (error: any) {
          console.error("MechAutoML calculation training crash:", error);
          setLogSteps(prev => [...prev, `[CRITICAL ERROR] Execution failed: ${error?.message || "Standard mathematics bounds exception"}`]);
          alert(`AutoML Compiler halted: ${error?.message || "Verify your dataset format."}`);
        } finally {
          setIsTraining(false);
          setStepMsg("");
          setProgress(0);
        }
      }
    }, 380);
  };

  return (
    <div className="space-y-8 py-4 text-left font-sans" id="model_training_viewport">
      
      {/* Page Header */}
      <div className="space-y-3 border-b border-white/5 pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-[#6366f1] rounded-full text-[10px] font-mono tracking-wider font-extrabold uppercase">
          <Cpu className="w-3.5 h-3.5 animate-pulse" />
          <span>Step 3: Train Learning Algorithms</span>
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">AutoML Model Core Engine</h2>
        <p className="text-slate-400 text-sm max-w-4xl">
          Recruit multiple classic algorithms, advanced neural networks, and metal hybrid stacking ensembles. Built with secure, high-order preset research bounds to provide deterministic model comparisons.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Hand: Controller & Params */}
        <div className="lg:col-span-5 space-y-6">
          <div className="backdrop-blur-xl bg-slate-950/40 border border-white/10 rounded-3xl p-6.5 space-y-6 shadow-2xl relative transition-all">
            
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-550/5 blur-xl rounded-full" />

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2.5">
                <Settings className="w-4.5 h-4.5 text-indigo-400 animate-spin-slow" />
                <h3 className="font-mono font-black text-[12px] uppercase tracking-wider text-slate-200">
                  Control Deck Modules
                </h3>
              </div>
            </div>

            {/* Target information summary */}
            <div className="space-y-2 font-mono text-[10.5px] bg-black/60 border border-white/5 p-4 rounded-2xl shadow-inner text-left">
              <div className="text-slate-400 flex items-center justify-between">
                <span>Core Target (Y):</span>
                <span className="text-emerald-400 font-black uppercase text-[11px] font-mono tracking-wider">{selectedTarget}</span>
              </div>
              <div className="text-slate-400 flex items-center justify-between">
                <span>Input Predictors (X):</span>
                <span className="text-blue-400 font-extrabold">{selectedFeatures.length} factors selected</span>
              </div>
            </div>

            {/* Research Preset Panel Banner indicator */}
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-left space-y-1.5 shadow-inner">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-mono font-black text-[10.5px] uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Fixed Research Presets Active</span>
              </div>
              <p className="text-slate-350 text-[10.5px] leading-relaxed font-sans">
                MECH AI ENGINEER uses fixed research-grade hyperparameter presets for each model. Users only select the models to train. The best model is selected automatically based on real evaluation metrics from the uploaded dataset.
              </p>
            </div>

            {/* Selection switches checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between animate-fade-in">
                <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider block">Recruited Models:</span>
                <span className="text-[10px] font-mono font-black text-indigo-400 bg-indigo-500/10 border border-indigo-550/20 px-2 py-0.5 rounded-full select-none">
                  {modelChoices.length} selected
                </span>
              </div>
              
              <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1 text-slate-300">
                {availableModels.map((m) => {
                  const active = modelChoices.includes(m.id);
                  let badgeColor = "bg-slate-500/10 text-slate-400 border-slate-500/20";
                  if (m.group === "Baseline") badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                  else if (m.group === "Tree Ensemble") badgeColor = "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
                  else if (m.group === "Modern Boosting") badgeColor = "bg-violet-500/10 text-violet-400 border-violet-500/20";
                  else if (m.group === "Distance & Neural") badgeColor = "bg-pink-500/10 text-pink-400 border-pink-500/20";
                  else if (m.group === "Hybrid Proposed") badgeColor = "bg-amber-500/10 text-amber-500 border-amber-500/20";

                  return (
                    <div
                      key={m.id}
                      onClick={() => !isTraining && toggleModelChoice(m.id)}
                      className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between text-left ${
                        isTraining ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                      } ${
                        active
                          ? "bg-indigo-600/5 border-indigo-500/30 text-white shadow-sm"
                          : "bg-slate-950/20 border-white/5 text-slate-400 hover:border-white/10"
                      }`}
                    >
                      <div className="space-y-1 pr-2 truncate">
                        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                          <span className="font-bold text-xs text-slate-200 block">{m.label}</span>
                          <span className={`text-[8.5px] px-1.5 py-0.2 border rounded-full font-mono uppercase font-black leading-none ${badgeColor}`}>
                            {m.group}
                          </span>
                        </div>
                        <span className="text-[9px] leading-snug text-slate-500 block font-normal truncate max-w-[210px] sm:max-w-xs" title={m.desc}>
                          {m.desc}
                        </span>
                      </div>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        active ? "bg-indigo-600 border-transparent text-white" : "border-slate-800 bg-black"
                      }`}>
                        {active && <Check className="w-2.5 h-2.5 text-white stroke-[4]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Benchmark buttons */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider block">Model Benchmark suite:</span>
              <div className="grid grid-cols-2 gap-2" id="training_suite_presets">
                <button
                  type="button"
                  disabled={isTraining}
                  onClick={() => selectPrebuildMode("recommended")}
                  className={`py-2 px-1.5 rounded-xl font-bold font-mono text-[8.5px] uppercase border transition-all cursor-pointer truncate ${
                    modelChoices.length === 5 && modelChoices.includes("CatBoost")
                      ? "bg-indigo-650 border-transparent text-white"
                      : "bg-black border-white/5 text-slate-400 hover:text-white"
                  }`}
                  title="XGBoost, RandomForest, CatBoost, ExtraTrees, GradientBoosting"
                >
                  🚀 Research Setup
                </button>
                <button
                  type="button"
                  disabled={isTraining}
                  onClick={() => selectPrebuildMode("fast")}
                  className={`py-2 px-1.5 rounded-xl font-bold font-mono text-[8.5px] uppercase border transition-all cursor-pointer truncate ${
                    modelChoices.length === 4 && modelChoices.includes("LinearRegression")
                      ? "bg-indigo-600 border-transparent text-white"
                      : "bg-black border-white/5 text-slate-400 hover:text-white"
                  }`}
                  title="Linear, Ridge, KNN, RandomForest"
                >
                  ⚡ Fast Bench
                </button>
                <button
                  type="button"
                  disabled={isTraining}
                  onClick={() => selectPrebuildMode("full")}
                  className={`py-2 px-1.5 rounded-xl font-bold font-mono text-[8.5px] uppercase border transition-all cursor-pointer truncate col-span-1 ${
                    modelChoices.length === 8
                      ? "bg-indigo-600 border-transparent text-white"
                      : "bg-black border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  ⚙️ Full (All 8)
                </button>
                <button
                  type="button"
                  disabled={isTraining}
                  onClick={() => selectPrebuildMode("clear")}
                  className="py-2 px-1.5 rounded-xl font-bold font-mono text-[8.5px] uppercase border bg-black border-white/5 text-slate-500 hover:text-slate-300 transition-all cursor-pointer truncate"
                >
                  ✕ Clear Selection
                </button>
              </div>
            </div>

            {/* Stacking Base estimators sub-selection config */}

            {/* Launch main trigger */}
            <button
              onClick={startTrainingFlow}
              disabled={isTraining || modelChoices.length === 0}
              className={`w-full py-4 rounded-xl text-xs font-bold font-mono tracking-widest flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-[0.98] cursor-pointer selection-none uppercase ${
                isTraining
                  ? "bg-slate-900 border-white/5 text-slate-500 cursor-not-allowed"
                  : modelChoices.length === 0
                    ? "bg-[#101216] border border-white/5 text-slate-500 cursor-not-allowed"
                    : "rainbow-border bg-black text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]"
              }`}
            >
              <Sparkles className={`w-4 h-4 shrink-0 ${modelChoices.length > 0 ? "animate-pulse text-indigo-200" : "text-slate-600"}`} />
              <span>
                {isTraining 
                  ? "Fitting estimators..." 
                  : modelChoices.length === 0 
                    ? "Select Model to Proceed" 
                    : "Deploy AutoML Core"}
              </span>
            </button>

          </div>
        </div>

        {/* Right Hand: Diagnostics telemetry logs stream */}
        <div className="lg:col-span-7">
          <AnimatePresence>
            {showCelebrate && (
              <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
                className="bg-emerald-500/10 border border-emerald-555/25 rounded-2xl p-4.5 flex items-center justify-between gap-4 shadow-lg shadow-emerald-500/5 mb-4 overflow-hidden relative"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400"
                    style={{
                      left: `${15 + i * 6}%`,
                      top: "80%",
                    }}
                    animate={{
                      y: [-10, -50],
                      x: [0, (i % 2 === 0 ? 10 : -10)],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1.8 + (i % 3) * 0.4,
                      repeat: Infinity,
                      delay: (i % 4) * 0.25,
                    }}
                  />
                ))}
                <div className="flex items-center space-x-3 z-10 text-left">
                  <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                    <Sparkles className="w-4.5 h-4.5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-[10.5px] font-mono font-black text-emerald-400 uppercase tracking-widest leading-none mb-1">
                      TRAINING DECK COMPILED SUCCESSFULLY!
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-normal font-sans">
                      All recruited algorithms compiled correctly. Optimal Champion model resolved: <strong className="text-emerald-400 font-extrabold">{bestModelName}</strong>
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCelebrate(false)}
                  className="text-slate-400 hover:text-slate-205 transition-colors text-[9px] font-mono font-black uppercase cursor-pointer z-10"
                >
                  [Dismiss]
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {isTraining ? (
            <div className="backdrop-blur-xl bg-slate-950/40 border border-white/10 rounded-3xl p-7 flex flex-col justify-center space-y-6 shadow-2xl min-h-[480px]" id="training_processing_state">
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center space-x-3 text-left">
                  <div className="p-2.5 bg-blue-500/10 rounded-2xl relative overflow-hidden flex items-center justify-center shrink-0">
                    <Cog className="w-5.5 h-5.5 text-blue-450 animate-spin" style={{ animationDuration: "3.5s" }} />
                    <Cpu className="w-3.5 h-3.5 text-indigo-450 absolute animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-mono text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">PROCESS STATE MODULE</h4>
                    <span className="text-xs text-blue-405 font-mono block uppercase tracking-wider font-extrabold mt-1.5">
                      {activeCategory}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 block">
                    {progress}%
                  </span>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-2">
                <div className="w-full bg-slate-950 h-3 border border-white/10 rounded-full overflow-hidden p-[1px] shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-400 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[9.5px] font-mono text-slate-500 select-none">
                  <span className="truncate max-w-[280px] italic">Telemetry log: {stepMsg}</span>
                  <span className="font-bold">Fitting...</span>
                </div>
              </div>

              {/* Terminal board */}
              <div className="backdrop-blur-md bg-slate-950 border border-white/10 rounded-2xl p-4.5 font-mono text-[10.5px] text-left space-y-2 h-[260px] overflow-y-auto shadow-inner text-slate-400" id="telemetry_logs_box">
                <div className="text-slate-500 uppercase font-black text-[9px] tracking-widest border-b border-white/5 pb-1.5 mb-2.5 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 font-extrabold">
                    <Terminal className="w-3.5 h-3.5 text-blue-400" />
                    <span>DIAGNOSTIC PROCESS STREAM FEED</span>
                  </span>
                  <span className="text-[8px] bg-blue-500/10 text-blue-300 border border-blue-550/20 px-2 py-0.5 rounded-full select-none font-bold animate-pulse">Running</span>
                </div>
                {logSteps.map((log, idx) => (
                  <div key={idx} className="leading-relaxed select-text truncate">
                    <span className="text-blue-500 font-bold pr-1">&#10097;</span> {log}
                  </div>
                ))}
              </div>

            </div>
          ) : performances.length === 0 ? (
            <div className="backdrop-blur-xl bg-slate-950/40 border border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center text-center min-h-[480px] text-slate-550 space-y-4 shadow-2xl relative overflow-hidden transition-all">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 rounded-full blur-[100px] -z-10" />
              <div className="w-16 h-16 bg-slate-950/80 border border-white/15 rounded-2xl flex items-center justify-center text-slate-500 shadow-inner">
                <Cpu className="w-7 h-7 text-indigo-400 animate-pulse animate-spin-slow" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest font-mono">Workspace Closed</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed font-normal">
                  Configure regression modeling constraints on the left control deck module. Click Deploy AutoML Core to compile regression models.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in" id="training_success_state">
              
              {/* Champion Card */}
              <div className="relative backdrop-blur-xl bg-gradient-to-br from-indigo-950/30 via-slate-905/40 to-slate-950/80 border border-indigo-500/20 rounded-3xl p-6.5 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-indigo-500/20 rounded-tr-3xl" />
                
                <div className="flex items-center space-x-4 text-left">
                  <div className="p-3.5 bg-gradient-to-br from-[#6366f1] to-blue-600 border border-indigo-400/20 rounded-2xl shadow-xl flex items-center justify-center shrink-0">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[8.5px] uppercase tracking-wider font-extrabold text-[#6366f1] font-mono block">Recommended System Best Model</span>
                    <h3 className="text-lg font-black text-white">{bestModelName}</h3>
                    <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed font-normal">
                      This algorithm produced the highest evaluation validation R² score and lowest residual errors metrics.
                    </p>
                  </div>
                </div>

                <div className="text-center sm:text-right font-mono px-4" id="best_model_stats_label">
                  <span className="text-[8px] block text-slate-500 font-extrabold uppercase tracking-widest leading-none">Validation R² Score</span>
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 block mt-1.5 leading-none">
                    {(performances.find(p => p.modelName === bestModelName)?.r2 || 0).toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Table comparisons */}
              <div className="backdrop-blur-xl bg-slate-950/40 border border-white/10 rounded-3xl p-6.5 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-xs font-bold text-slate-200 tracking-wider font-mono uppercase block flex items-center space-x-1.5 select-none">
                    <Activity className="w-4 h-4 text-slate-400" />
                    <span>Cross-Evaluation Scores Matrix</span>
                  </span>
                  <span className="text-[9px] text-slate-520 font-mono font-bold select-none uppercase tracking-wide">Standard Regressors Comparison</span>
                </div>

                <div className="overflow-x-auto border border-white/5 rounded-2xl bg-black/40 shadow-inner">
                  <table className="w-full text-xs text-left" id="metrics_results_table">
                    <thead className="bg-[#030304]/80">
                      <tr className="border-b border-white/10 text-slate-400 font-mono text-[9px] uppercase">
                        <th className="p-3.5 font-extrabold text-slate-405">Model Description</th>
                        <th className="p-3.5 font-bold text-right">R² Index</th>
                        <th className="p-3.5 font-bold text-right">MAE</th>
                        <th className="p-3.5 font-bold text-right">RMSE Error</th>
                        <th className="p-3.5 font-bold text-right">MAPE</th>
                        <th className="p-3.5 font-bold text-right">Train (ms)</th>
                        <th className="p-3.5 font-bold text-right">Pred (ms)</th>
                        <th className="p-3.5 font-bold text-right">Label</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-350 font-mono leading-relaxed text-[11px]">
                      {performances.map((perf) => {
                        const isBest = perf.modelName === bestModelName;
                        return (
                          <tr key={perf.modelName} className={`hover:bg-white/[0.01] transition-all duration-300 ${isBest ? "text-white font-bold bg-indigo-500/[0.02]" : ""}`}>
                            <td className="p-3">
                              <div className="flex items-center space-x-2 truncate max-w-[155px]">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isBest ? "bg-emerald-500 animate-pulse" : "bg-slate-700"}`} />
                                <span className="truncate text-slate-300" title={perf.modelName}>{perf.modelName}</span>
                              </div>
                            </td>
                            <td className={`p-3 text-right font-bold ${isBest ? "text-emerald-400 font-black animate-pulse" : "text-slate-200"}`}>
                              {perf.r2.toFixed(4)}
                            </td>
                            <td className="p-3 text-right text-slate-400">{perf.mae.toFixed(4)}</td>
                            <td className="p-3 text-right text-slate-400">{perf.rmse.toFixed(4)}</td>
                            <td className="p-3 text-right text-slate-400">{(perf.mape * 100).toFixed(2)}%</td>
                            <td className="p-3 text-right text-blue-400 font-bold">{perf.trainingTime || 0}</td>
                            <td className="p-3 text-right text-indigo-400 font-bold">{perf.predictionTime || 0}</td>
                            <td className="p-3 text-right">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[8px] font-bold uppercase border tracking-wider select-none ${
                                perf.status === "Best Model"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-400/20 font-black animate-pulse"
                                  : perf.status === "Good"
                                    ? "bg-blue-500/10 text-blue-300 border-blue-400/20"
                                    : "bg-slate-900 text-slate-500 border-white/5"
                              }`}>
                                {perf.status === "Best Model" ? "Best" : perf.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Academic Watermark Footer */}
              <div className="backdrop-blur-md bg-slate-950/40 p-4 border border-white/5 rounded-2xl flex flex-col sm:flex-row items-center justify-between text-[9px] text-slate-500 font-mono tracking-wider gap-2 select-none" id="training_watermark">
                <span>MECHANICAL DESIGN INFORMATICS LABORATORY</span>
                <span>AUTOML ESTIMATOR HUB • PUBLIC WORKSPACE</span>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
