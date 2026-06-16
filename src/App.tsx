import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ActiveTab, PredictionHistoryItem, MLTrainingState } from "./types";
import { ParsedDataset, analyzeDataset } from "./utils/fileParser";
import { ModelPerformance, PreprocessedData, preprocessDataset, runModelTraining } from "./utils/mlEngine";
import { loadAppState, saveAppState } from "./utils/indexedDB";
import { sampleDatasets } from "./utils/sampleDatasets";

// Import modular screens
import LandingPage from "./components/LandingPage";
import DatasetUpload from "./components/DatasetUpload";
import FeatureSelection from "./components/FeatureSelection";
import ModelTraining from "./components/ModelTraining";
import ModelPerformanceDashboard from "./components/ModelPerformanceDashboard";
import VisualAnalytics from "./components/VisualAnalytics";
import WorkflowSection from "./components/WorkflowSection";
import EthicsSection from "./components/EthicsSection";
import AboutProject from "./components/AboutProject";
import SimulationTwin from "./components/SimulationTwin";
import AIAssistant from "./components/AIAssistant";
import Navigation from "./components/Navigation";

// Import luxury UI assets
import InteractiveBlueprintBackground from "./components/InteractiveBlueprintBackground";
import { CinematicFooter } from "@/components/ui/motion-footer";
import StartupLoader from "./components/StartupLoader";
import { audio } from "./utils/audioService";
// Import decorative icons
import { 
  Cpu, Moon, Sun, Printer, Loader2, Menu, X, Home, Upload, 
  CheckCircle2, BookOpen, GraduationCap, ArrowRight,
  FileSpreadsheet, Sliders, Brain, Trophy, BarChart3, History, Workflow, Scale, Info,
  ChevronLeft, ChevronRight, Sparkles, Compass
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [navigationResetTick, setNavigationResetTick] = useState<number>(0);

  const handleNavigateToTab = (tab: ActiveTab) => {
    audio.playTabSwitch();
    setActiveTab(tab);
    setNavigationResetTick(prev => prev + 1);
    // Move window viewport back to top of the page on menu transition
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const [theme, setTheme] = useState<"navy" | "contrast">("navy");
  const [profileOpen, setProfileOpen] = useState(false);
  const [datasetRegistry, setDatasetRegistry] = useState<ParsedDataset[]>([]);

  const updateDatasetRegistry = (newRegistry: ParsedDataset[] | ((prev: ParsedDataset[]) => ParsedDataset[])) => {
    setDatasetRegistry(prev => {
      const raw = typeof newRegistry === "function" ? (newRegistry as any)(prev) : newRegistry;
      const seen = new Set<string>();
      return (raw || []).filter((item: ParsedDataset) => {
        if (!item || !item.fileName) return false;
        if (seen.has(item.fileName)) return false;
        seen.add(item.fileName);
        return true;
      });
    });
  };
  const [isDbLoading, setIsDbLoading] = useState(true);
  const [isStartingUp, setIsStartingUp] = useState(true);
  // Core ML preprocessed training state
  const [mlState, setMlState] = useState<MLTrainingState>({
    dataset: null,
    selectedFeatures: [],
    selectedTarget: "",
    preprocessingResult: null,
    selectedModels: [],
    isTraining: false,
    trainingStep: "",
    performances: [],
    bestModelName: "",
    featureImportances: [],
    testActualValues: [],
    testPredictedValues: [],
    bestModelInstance: null
  });

  // Local storage prediction history state
  const [historyList, setHistoryList] = useState<PredictionHistoryItem[]>([]);

  // Load state from IndexedDB & local history cache on mount
  useEffect(() => {
    const initDbState = async () => {
      try {
        const stored = await loadAppState();
        if (stored) {
          if (stored.activeTab) {
            setActiveTab(stored.activeTab as ActiveTab);
          }
          if (stored.theme) {
            setTheme(stored.theme);
          }
          if (stored.datasetRegistry) {
            updateDatasetRegistry(stored.datasetRegistry);
          }
          if (stored.mlState && stored.dataset) {
            setMlState({
              dataset: stored.dataset,
              selectedFeatures: stored.mlState.selectedFeatures || [],
              selectedTarget: stored.mlState.selectedTarget || "",
              preprocessingResult: stored.mlState.preprocessingResult || null,
              selectedModels: stored.mlState.selectedModels || [],
              isTraining: false,
              trainingStep: "",
              performances: stored.mlState.performances || [],
              bestModelName: stored.mlState.bestModelName || "",
              featureImportances: stored.mlState.featureImportances || [],
              testActualValues: stored.mlState.testActualValues || [],
              testPredictedValues: stored.mlState.testPredictedValues || [],
              bestModelInstance: null // Will be re-computed or lazy loaded
            });
          }
        }
      } catch (err) {
        console.error("IndexedDB session retrieval failed:", err);
      } finally {
        setIsDbLoading(false);
      }
    };
    initDbState();

    try {
      const cached = localStorage.getItem("mechautoml_history_registry");
      if (cached) {
        setHistoryList(JSON.parse(cached));
      }
    } catch (e) {
      console.error("Local history cache read failure:", e);
    }
  }, []);

  // Lazy auto-retraining model instances when session is restored/refreshed
  useEffect(() => {
    if (isDbLoading) return;
    if (
      mlState.dataset &&
      mlState.selectedFeatures.length > 0 &&
      mlState.selectedTarget &&
      mlState.selectedModels.length > 0 &&
      !mlState.bestModelInstance
    ) {
      try {
        const preprocessed = preprocessDataset(
          mlState.dataset.rows,
          mlState.selectedFeatures,
          mlState.selectedTarget
        );
        const results = runModelTraining(preprocessed, mlState.selectedModels);
        setMlState(prev => ({
          ...prev,
          bestModelInstance: results.bestModelInstance,
          ensembleModelInstance: results.ensembleModelInstance
        }));
      } catch (err) {
        console.error("Auto-restoration model fitting failure:", err);
      }
    }
  }, [
    isDbLoading,
    mlState.dataset,
    mlState.selectedFeatures,
    mlState.selectedTarget,
    mlState.selectedModels,
    mlState.bestModelInstance
  ]);

  // Helper hook to sync features list upon loading dataset with Auto-detection Intelligence
  const handleDatasetLoaded = (newDataset: ParsedDataset) => {
    if (newDataset && newDataset.fileName) {
      updateDatasetRegistry(prev => {
        if (prev.some(d => d.fileName === newDataset.fileName)) {
          return prev;
        }
        return [...prev, newDataset];
      });
    }

    // Do not pre-fill variables automatically; let the user do manual selection from scratch
    const initialFeatures: string[] = [];
    const initialTarget = "";

    setMlState({
      dataset: newDataset,
      selectedFeatures: initialFeatures,
      selectedTarget: initialTarget,
      preprocessingResult: null,
      selectedModels: [],
      isTraining: false,
      trainingStep: "",
      performances: [],
      bestModelName: "",
      featureImportances: [],
      testActualValues: [],
      testPredictedValues: [],
      bestModelInstance: null
    });
    // Let user stay on "upload" page to manually preview complete rows & define inputs/outputs
  };

  const handleSetFeatures = (cols: string[]) => {
    setMlState(prev => ({ ...prev, selectedFeatures: cols }));
  };

  const handleSetTarget = (col: string) => {
    setMlState(prev => ({ ...prev, selectedTarget: col }));
  };

  const handleConfirmSelection = () => {
    setActiveTab("train");
  };

  const autoFitSampleModel = (idx: number = 0) => {
    const sample = sampleDatasets[idx];
    if (!sample) return;

    const newDataset = analyzeDataset(sample.name, sample.rows);

    const preprocessed = preprocessDataset(
      sample.rows,
      sample.inputCols,
      sample.targetCol
    );

    const selectedAlgorithms = [
      "LinearRegression", "RidgeRegression", "RandomForest", "ExtraTrees", "GradientBoosting"
    ];

    const trainingResults = runModelTraining(preprocessed, selectedAlgorithms);

    setMlState({
      dataset: newDataset,
      selectedFeatures: sample.inputCols,
      selectedTarget: sample.targetCol,
      preprocessingResult: preprocessed,
      selectedModels: selectedAlgorithms,
      isTraining: false,
      trainingStep: "",
      performances: trainingResults.performances,
      bestModelName: trainingResults.bestModelName,
      featureImportances: trainingResults.featureImportances,
      testActualValues: trainingResults.predictions.testActual,
      testPredictedValues: trainingResults.predictions.testPredicted,
      bestModelInstance: trainingResults.bestModelInstance,
      ensembleModelInstance: trainingResults.ensembleModelInstance || null
    });

    updateDatasetRegistry(prev => {
      if (prev.some(d => d.fileName === newDataset.fileName)) {
        return prev;
      }
      return [...prev, newDataset];
    });

    // We let the active tab remain unchanged so the user maintains complete navigation control
  };

  const handleTrainingComplete = (args: {
    preprocessingResult: PreprocessedData;
    performances: ModelPerformance[];
    bestModelName: string;
    featureImportances: { name: string; value: number }[];
    testActualValues: number[];
    testPredictedValues: number[];
    bestModelInstance: any;
    ensembleModelInstance?: any;
    selectedModels: string[];
  }) => {
    setMlState(prev => ({
      ...prev,
      preprocessingResult: args.preprocessingResult,
      performances: args.performances,
      bestModelName: args.bestModelName,
      featureImportances: args.featureImportances,
      testActualValues: args.testActualValues,
      testPredictedValues: args.testPredictedValues,
      bestModelInstance: args.bestModelInstance,
      ensembleModelInstance: args.ensembleModelInstance || null,
      selectedModels: args.selectedModels
    }));
    // Automatically switch to the model performance evaluation dashboard
    setActiveTab("performance");
  };

  // Render tab component content
  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return <LandingPage setActiveTab={handleNavigateToTab} datasetLoaded={!!mlState.dataset} />;
      case "upload":
      case "features":
      case "train":
        return (
          <DatasetUpload 
            activeTab={activeTab}
            navigationResetTick={navigationResetTick}
            onDatasetLoaded={handleDatasetLoaded} 
            currentDataset={mlState.dataset} 
            datasetRegistry={datasetRegistry}
            onRegistryUpdated={updateDatasetRegistry}
            selectedFeatures={mlState.selectedFeatures}
            selectedTarget={mlState.selectedTarget}
            onSetFeatures={handleSetFeatures}
            onSetTarget={handleSetTarget}
            onConfirmSelection={handleConfirmSelection}
            onNavigateToFeatures={() => handleNavigateToTab("upload")}
            onTrainingComplete={handleTrainingComplete}
          />
        );
      case "performance":
        return (
          <ModelPerformanceDashboard
            dataset={mlState.dataset}
            selectedFeatures={mlState.selectedFeatures}
            selectedTarget={mlState.selectedTarget}
            preprocessingResult={mlState.preprocessingResult}
            performances={mlState.performances}
            bestModelName={mlState.bestModelName}
          />
        );
      case "analytics":
        if (mlState.performances.length === 0 || !mlState.preprocessingResult) {
          setActiveTab("train");
          return null;
        }
        return (
          <VisualAnalytics
            preprocessingResult={mlState.preprocessingResult}
            performances={mlState.performances}
            bestModelName={mlState.bestModelName}
            featureImportances={mlState.featureImportances}
            testActualValues={mlState.testActualValues}
            testPredictedValues={mlState.testPredictedValues}
          />
        );

      case "workflow":
        return <WorkflowSection />;
      case "ethics":
        return <EthicsSection />;
      case "about":
        return <AboutProject />;
      case "twin":
        return <SimulationTwin />;
      case "assistant":
        return <AIAssistant />;
      default:
        return <LandingPage setActiveTab={setActiveTab} datasetLoaded={!!mlState.dataset} />;
    }
  };

  // If loading Database sessions OR showing the premium loading screen, render StartupLoader
  if (isStartingUp || isDbLoading) {
    return <StartupLoader onComplete={() => setIsStartingUp(false)} />;
  }

  return (
    <div className={`min-h-screen min-w-[320px] flex flex-col relative overflow-x-hidden font-sans transition-colors duration-300 ${
      theme === "contrast" 
        ? "theme-contrast bg-[#f9fafc] text-slate-800" 
        : "theme-navy bg-[#000000] text-slate-100"
    }`} id="mechautoml_app">
      
      {/* Interactive premium ambient background glow wrapper */}
      {theme === "navy" && <InteractiveBlueprintBackground />}

      {/* MODULAR RADI-X PREMIUM NAVIGATION HEADER DOCK */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={handleNavigateToTab} 
        datasetLoaded={!!mlState.dataset} 
        modelTrained={mlState.performances.length > 0} 
      />

      {/* MASTER SCREEN MAIN CONTENT VIEWPORT - WIDE LUXURY HUD GLASS SHELL */}
      <main className="relative z-10 flex-grow w-full max-w-[97%] mx-auto px-2 sm:px-6 lg:px-8 mt-6 shrink-0 transition-all duration-300" id="app_main_viewport_shell">
        
        {/* Shimmering glossy obsidian panel with full-screen width ergonomics */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#0a0a0d]/95 via-[#030305]/98 to-[#000001]/100 border border-white/[0.08] shadow-[0_40px_100px_rgba(0,0,0,0.95)] shadow-indigo-500/[0.02]">
          
          {/* Animated glass reflection effect overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.01] to-white/[0.03] z-0" />

          {/* Running light across the top of the HUD for a glossy carbon effect */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent animate-pulse z-10" />

          {/* Inner App Container with adaptive full screen layout */}
          <div className="relative flex-grow p-4 sm:p-8 lg:p-10 min-h-[520px] transition-all duration-300 rounded-3xl z-10">
            
            {/* Embedded Sub-Navigation Context Controller Layout */}
            {(() => {
              let group: { id: ActiveTab; label: string; icon: any; disabled?: boolean }[] = [];
              if (activeTab === "upload" || activeTab === "features" || activeTab === "train") {
                return null;
              } else if (
                activeTab === "performance" || 
                activeTab === "analytics"
              ) {
                group = [
                  { id: "performance", label: "Performance Dashboard", icon: Trophy, disabled: mlState.performances.length === 0 },
                  { id: "analytics", label: "High-Rigor Visual Analytics", icon: BarChart3, disabled: mlState.performances.length === 0 },
                ];
              }

              if (group.length === 0) return null;

              return (
                <div className="flex flex-wrap items-center gap-1.5 mb-8 p-1.5 nm-inset w-fit print-hidden animate-in d-fade-in" id="academic_sub_nav">
                  {group.map((item) => {
                    const isActive = activeTab === item.id;
                    const SubIcon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (!item.disabled) handleNavigateToTab(item.id);
                        }}
                        disabled={item.disabled}
                        className={`px-4 py-2 rounded-xl text-[10.5px] font-mono font-bold tracking-wide uppercase transition-all duration-300 flex items-center space-x-1.5 ${
                          item.disabled
                            ? "opacity-20 cursor-not-allowed text-slate-500 font-normal"
                            : isActive
                              ? "nm-btn bg-indigo-500/10 text-indigo-400 font-extrabold scale-102"
                              : "text-slate-400 hover:text-indigo-400 cursor-pointer"
                        }`}
                      >
                        <SubIcon className="w-3.5 h-3.5 opacity-80" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })()}

            {/* Custom transition wrapper around tab sheets */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full h-full"
            >
              {renderTabContent()}
            </motion.div>

          </div>
        </div>

      </main>

      {/* Premium GSAP Cinema Parallax Footer */}
      <div className="mt-16 print-hidden" id="cinematic_footer_workspace">
        <CinematicFooter />
      </div>

    </div>
  );
}
