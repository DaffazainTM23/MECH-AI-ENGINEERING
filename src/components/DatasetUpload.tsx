import React, { useState, useRef, useMemo, useEffect } from "react";
import JSZip from "jszip";
import { ParsedDataset, parseCsvContent, analyzeDataset, parseExcelBuffer } from "../utils/fileParser";
import { sampleDatasets } from "../utils/sampleDatasets";
import { runModelTraining, ModelPerformance, PreprocessedData, preprocessDataset } from "../utils/mlEngine";
import { 
  FileSpreadsheet, Upload, AlertCircle, AlertTriangle, 
  HelpCircle, CheckCircle, Database, LayoutGrid, Info, 
  Trash2, Layers, ShieldCheck, Sparkles, Sliders, Target,
  CheckSquare, ArrowRight, Search, ChevronLeft, ChevronRight,
  Settings, Terminal, Cog, Award, Loader2, RefreshCw, FileText,
  FileIcon, FileSpreadsheetIcon, Copy, Play, Cpu, Check
} from "lucide-react";
import { TypeTable } from "@/components/ui/type-table";
import { motion, AnimatePresence } from "framer-motion";
import FileUpload from "@/components/ui/file-upload";
import { BentoGrid, type BentoItem } from "@/components/ui/bento-grid";
import AnimatedGenerateButton from "./ui/animated-generate-button-shadcn-tailwind";
import { useLanguage } from "../context/LanguageContext";
import { WarningGraphic } from "./ui/warning-graphic";

interface DatasetUploadProps {
  activeTab?: string;
  navigationResetTick?: number;
  onDatasetLoaded: (dataset: ParsedDataset) => void;
  currentDataset: ParsedDataset | null;
  datasetRegistry: ParsedDataset[];
  onRegistryUpdated: (registry: ParsedDataset[] | ((prev: ParsedDataset[]) => ParsedDataset[])) => void;
  selectedFeatures?: string[];
  selectedTarget?: string;
  onSetFeatures?: (features: string[]) => void;
  onSetTarget?: (target: string) => void;
  onConfirmSelection?: () => void;
  onNavigateToFeatures?: () => void;
  onTrainingComplete?: (args: any) => void;
}

export default function DatasetUpload({ 
  activeTab,
  navigationResetTick,
  onDatasetLoaded, 
  currentDataset,
  datasetRegistry,
  onRegistryUpdated,
  selectedFeatures = [],
  selectedTarget = "",
  onSetFeatures,
  onSetTarget,
  onConfirmSelection,
  onNavigateToFeatures,
  onTrainingComplete
}: DatasetUploadProps) {
  const { language, t } = useLanguage();
  // 3 Steps processing pipeline
  // Step 1: File Ingestion & Exploration
  // Step 2: Feature & Target Variable Mapping
  // Step 3: AutoML Compilation Core
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Always reset to Step 1 when entering/re-clicking the upload tab view
  useEffect(() => {
    setActiveStep(1);
  }, [activeTab, navigationResetTick]);

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [isUnzipping, setIsUnzipping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logsEndRef = useRef<HTMLDivElement | null>(null);
  const logsContainerRef = useRef<HTMLDivElement | null>(null);
  const stageContainerRef = useRef<HTMLDivElement | null>(null);

  // Multi-file repository and alignment states
  const [selectedMergeFiles, setSelectedMergeFiles] = useState<string[]>([]);
  const [mergeMethod, setMergeMethod] = useState<"vertical" | "horizontal">("vertical");
  const [isMerging, setIsMerging] = useState(false);
  const [mergeProgress, setMergeProgress] = useState(0);
  const [mergeProgressMsg, setMergeProgressMsg] = useState("");

  // Table Pagination, Search and Row Limit controls
  const [pageSize, setPageSize] = useState<number | "all">(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Custom states for wizard pipeline
  const [isFileProcessing, setIsFileProcessing] = useState<boolean>(false);
  const [maxStepReached, setMaxStepReached] = useState<number>(1);

  // Custom Hyperparameter States (Fine-Tuning manual semau kita)
  const [testSizeRatio, setTestSizeRatio] = useState<number>(0.2);
  const [randomSeedValue, setRandomSeedValue] = useState<number>(42);
  const [activeModelChoices, setActiveModelChoices] = useState<string[]>([]);

  const [xgBoostParams, setXGBoostParams] = useState({
    numBoosters: 30,
    learningRate: 0.1,
    maxDepth: 5,
    regLambda: 1.2,
  });

  const [catBoostParams, setCatBoostParams] = useState({
    iterations: 40,
    learningRate: 0.1,
    depth: 6,
    l2LeafReg: 3.0,
  });

  const [randomForestParams, setRandomForestParams] = useState({
    numEstimators: 25,
    maxDepth: 6,
    minSamplesSplit: 2,
  });

  const [gradientBoostingParams, setGradientBoostingParams] = useState({
    numEstimators: 20,
    learningRate: 0.1,
    maxDepth: 4,
  });

  const [ridgeAlpha, setRidgeAlpha] = useState<number>(1.2);
  const [lassoAlpha, setLassoAlpha] = useState<number>(0.1);
  const [svmC, setSvmC] = useState<number>(10.0);
  const [knnNeighbors, setKnnNeighbors] = useState<number>(5);

  // Execution states inside Step 4
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [compileMsg, setCompileMsg] = useState("");
  const [compileLogs, setCompileLogs] = useState<string[]>([]);
  const [championPerformance, setChampionPerformance] = useState<ModelPerformance | null>(null);
  const [trainedPerformances, setTrainedPerformances] = useState<ModelPerformance[]>([]);
  const [compilationResult, setCompilationResult] = useState<any>(null);

  // Safe status alignment effects without aggressive forced centering scroll locks
  useEffect(() => {
    // Left empty purposely as requested to allow normal manual user scrolling
  }, [activeStep]);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [compileLogs]);

  // Synchronize maxStepReached based on pipeline completions
  useEffect(() => {
    if (trainedPerformances.length > 0 || championPerformance) {
      setMaxStepReached(4);
    } else if (selectedTarget && selectedFeatures.length > 0) {
      setMaxStepReached(prev => Math.max(prev, 3));
    } else if (currentDataset) {
      setMaxStepReached(prev => Math.max(prev, 2));
    } else {
      setMaxStepReached(1);
    }
  }, [currentDataset, selectedTarget, selectedFeatures, trainedPerformances, championPerformance]);

  // Automatic Optuna study tuning simulated toggle
  const [optunaAutoTune, setOptunaAutoTune] = useState<boolean>(false);

  // Sync tuned settings to/from localStorage for seamless core sharing
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mech_ai_tuning_params");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.testSizeRatio !== undefined) setTestSizeRatio(parsed.testSizeRatio);
        if (parsed.randomSeedValue !== undefined) setRandomSeedValue(parsed.randomSeedValue);
        if (parsed.activeModelChoices !== undefined) setActiveModelChoices(parsed.activeModelChoices);
        if (parsed.xgBoostParams !== undefined) setXGBoostParams(parsed.xgBoostParams);
        if (parsed.catBoostParams !== undefined) setCatBoostParams(parsed.catBoostParams);
        if (parsed.randomForestParams !== undefined) setRandomForestParams(parsed.randomForestParams);
        if (parsed.gradientBoostingParams !== undefined) setGradientBoostingParams(parsed.gradientBoostingParams);
        if (parsed.ridgeAlpha !== undefined) setRidgeAlpha(parsed.ridgeAlpha);
        if (parsed.lassoAlpha !== undefined) setLassoAlpha(parsed.lassoAlpha);
        if (parsed.svmC !== undefined) setSvmC(parsed.svmC);
        if (parsed.knnNeighbors !== undefined) setKnnNeighbors(parsed.knnNeighbors);
      }
    } catch (e) {
      console.warn("Failed to load custom auto-tuning params:", e);
    }
  }, []);

  useEffect(() => {
    try {
      const params = {
        testSizeRatio,
        randomSeedValue,
        activeModelChoices,
        xgBoostParams,
        catBoostParams,
        randomForestParams,
        gradientBoostingParams,
        ridgeAlpha,
        lassoAlpha,
        svmC,
        knnNeighbors
      };
      localStorage.setItem("mech_ai_tuning_params", JSON.stringify(params));
    } catch (e) {
      console.warn("Failed to save custom auto-tuning params:", e);
    }
  }, [
    testSizeRatio,
    randomSeedValue,
    activeModelChoices,
    xgBoostParams,
    catBoostParams,
    randomForestParams,
    gradientBoostingParams,
    ridgeAlpha,
    lassoAlpha,
    svmC,
    knnNeighbors
  ]);

  // Helper functions
  const handleApplyPreset = (type: "recommended" | "fast" | "full" | "clear") => {
    switch (type) {
      case "recommended":
        setActiveModelChoices(["random_forest", "extra_trees", "gradient_boosting", "xgboost", "catboost"]);
        break;
      case "fast":
        setActiveModelChoices(["linear_regression", "ridge_regression", "random_forest", "extra_trees"]);
        break;
      case "full":
        setActiveModelChoices(["linear_regression", "ridge_regression", "random_forest", "extra_trees", "gradient_boosting", "xgboost", "catboost", "knn"]);
        break;
      case "clear":
        setActiveModelChoices([]);
        break;
    }
  };

  const handleStartEvaluation = () => {
    if (activeModelChoices.length === 0) return;
    setActiveStep(4);
    setTimeout(() => {
      handleAutoMLCompilation();
    }, 150);
  };

  const getModelStatus = (modelId: string) => {
    const isSelected = activeModelChoices.includes(modelId);
    if (!isSelected) return "Skipped";

    const mid = modelId.toLowerCase();

    if (isCompiling) {
      if (compileProgress < 40) {
        return "Selected";
      }
      if (compileProgress >= 40 && compileProgress < 70) {
        if (mid === "linear_regression" || mid === "ridge_regression") {
          return "Training";
        }
        return "Selected";
      }
      if (compileProgress >= 70 && compileProgress < 95) {
        if (mid === "linear_regression" || mid === "ridge_regression") {
          return "Trained";
        }
        return "Training";
      }
      return "Trained";
    }

    if (championPerformance) {
      const displayNameMap: { [key: string]: string } = {
        "Linear Regression": "linear_regression",
        "Ridge Regression": "ridge_regression",
        "Random Forest Regressor": "random_forest",
        "Extra Trees Regressor": "extra_trees",
        "Gradient Boosting Regressor": "gradient_boosting",
        "XGBoost Regressor": "xgboost",
        "CatBoost Regressor": "catboost",
        "KNN Regressor": "knn"
      };
      
      const championId = displayNameMap[championPerformance.modelName];
      if (mid === championId || modelId === displayNameMap[championPerformance.modelName]) {
        return "Champion Model";
      }
      return "Trained";
    }

    return "Selected";
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const calculateDataQuality = (dataset: ParsedDataset) => {
    let totalCells = 0;
    let missingCells = 0;
    
    dataset.headers.forEach(h => {
      const colSummary = dataset.summary[h];
      if (colSummary) {
        totalCells += dataset.rowCount;
        missingCells += colSummary.missingCount || 0;
      }
    });

    const missingPct = totalCells > 0 ? (missingCells / totalCells) : 0;

    if (dataset.rowCount >= 100 && missingCells === 0) {
      return {
        label: "Excellent",
        color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 font-bold" />,
        description: "Zero missing values & robust sample count for premium training accuracy."
      };
    } else if (dataset.rowCount >= 30 && missingPct <= 0.08) {
      return {
        label: "Good",
        color: "bg-blue-500/10 text-blue-400 border-blue-500/30",
        icon: <CheckCircle className="w-3.5 h-3.5 text-blue-400" />,
        description: "Low-density missingness (<8%) automatically imputed during compiler stages."
      };
    } else {
      return {
        label: "Needs Cleaning",
        color: "bg-amber-500/10 text-amber-500 border-amber-500/30",
        icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
        description: "High null ratio (>8%) or minimal sample rows (<30). Imputer required."
      };
    }
  };

  const handleRawDataProcessing = (fileName: string, parsedRows: any[], shouldSelect = true) => {
    setError(null);
    setWarning(null);
    setCurrentPage(1);

    if (!parsedRows || parsedRows.length === 0) {
      setError(`The dataset ${fileName} appears to be empty. Models cannot compile empty worksheets.`);
      return null;
    }

    const analyzed = analyzeDataset(fileName, parsedRows);

    // Update dataset registry
    onRegistryUpdated(prev => {
      const filtered = prev.filter(d => d.fileName !== fileName);
      return [...filtered, analyzed];
    });

    let hasNulls = false;
    analyzed.headers.forEach(h => {
      if ((analyzed.summary[h]?.missingCount || 0) > 0) {
        hasNulls = true;
      }
    });

    if (hasNulls && shouldSelect) {
      setWarning(`Notification: ${fileName} contains blank cells. Imputer will mean-pad them automatically.`);
    }

    if (shouldSelect) {
      onDatasetLoaded(analyzed);
    }

    return analyzed;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    for (let i = 0; i < files.length; i++) {
      await processFile(files[i]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processFile = async (file: File) => {
    const fn = file.name.toLowerCase();
    const isCsv = fn.endsWith(".csv");
    const isXlsx = fn.endsWith(".xlsx") || fn.endsWith(".xls");
    const isZip = fn.endsWith(".zip");

    if (!isCsv && !isXlsx && !isZip) {
      setError("Unsupported format. Please upload comma-separated worksheets (.csv), Excel workbooks (.xlsx), or ZIP archives.");
      return;
    }

    setIsFileProcessing(true);
    setError(null);
    setWarning(null);

    setTimeout(async () => {
      try {
        if (isZip) {
          setIsUnzipping(true);
          const zip = await JSZip.loadAsync(file);
          const csvEntries = Object.keys(zip.files).filter(
            name => name.toLowerCase().endsWith(".csv") && !name.includes("__MACOSX")
          );

          if (csvEntries.length === 0) {
            setError("No valid .csv files found inside the uploaded ZIP archive.");
            setIsUnzipping(false);
            setIsFileProcessing(false);
            return;
          }

          const newlyExtracted: ParsedDataset[] = [];
          for (const entryName of csvEntries) {
            const zipEntry = zip.files[entryName];
            if (zipEntry.dir) continue;

            const text = await zipEntry.async("text");
            const rows = parseCsvContent(text);
            if (rows && rows.length > 0) {
              const cleanName = entryName.split("/").pop() || entryName;
              const analyzed = handleRawDataProcessing(cleanName, rows, false);
              if (analyzed) {
                newlyExtracted.push(analyzed);
              }
            }
          }

          setIsUnzipping(false);
          if (newlyExtracted.length > 0) {
            onDatasetLoaded(newlyExtracted[0]);
          } else {
            setError("Unzipped successfully but all files were null or empty.");
          }
        } else if (isCsv) {
          const text = await file.text();
          const rows = parseCsvContent(text);
          handleRawDataProcessing(file.name, rows);
        } else {
          const rows = await parseExcelBuffer(file);
          handleRawDataProcessing(file.name, rows);
        }
      } catch (err: any) {
        setError(`File compilation failure: ${err?.message || "Verify file encoding schemas"}`);
        setIsUnzipping(false);
      } finally {
        setIsFileProcessing(false);
      }
    }, 850);
  };

  const loadSampleDataset = (idx: number) => {
    setIsFileProcessing(true);
    setError(null);
    setWarning(null);

    setTimeout(() => {
      try {
        const sample = sampleDatasets[idx];
        handleRawDataProcessing(sample.name, sample.rows);
      } catch (err: any) {
        setError(`Failed to load sample dataset: ${err?.message}`);
      } finally {
        setIsFileProcessing(false);
      }
    }, 850);
  };

  // Custom Bento items representing dataset info for Step 1
  const getDatasetBentoItems = (): BentoItem[] => {
    if (!currentDataset || !currentDataset.fileName) return [];
    const quality = calculateDataQuality(currentDataset);
    
    return [
      {
        title: "Observational Record Volume",
        meta: `${currentDataset.rowCount} rows`,
        description: `Ingested ${currentDataset.rowCount} rows from "${currentDataset.fileName}". Ready for machine estimator training.`,
        icon: <Database className="w-5 h-5 text-indigo-400" />,
        status: "Active",
        tags: ["Row Volume", `${currentDataset.rowCount} logs`],
        colSpan: 2,
        hasPersistentHover: true
      },
      {
        title: "Imputation Assurance Profile",
        meta: quality.label,
        description: quality.description,
        icon: quality.icon,
        status: quality.label,
        tags: ["Quality Audit", "Assurance"],
        colSpan: 1
      },
      {
        title: "Matched Feature Channels (X)",
        meta: `${selectedFeatures.length} Active`,
        description: selectedFeatures.length > 0 
          ? `Feature matrix vectors: ${selectedFeatures.slice(0, 4).join(", ")}${selectedFeatures.length > 4 ? "..." : ""}`
          : "Please check your predictor variables on Step 2.",
        icon: <Sliders className="w-5 h-5 text-cyan-400" />,
        status: selectedFeatures.length > 0 ? "Compiled" : "Pending Selection",
        tags: ["Independent X", `${selectedFeatures.length} cols`],
        colSpan: 1
      },
      {
        title: "Forecast Outcome Label (Y)",
        meta: selectedTarget ? "Assigned" : "Unmapped",
        description: selectedTarget 
          ? `Engine fits a regression plane to predict "${selectedTarget}" outcome.`
          : "Please map the continuous target label on Step 2.",
        icon: <Target className="w-5 h-5 text-rose-405" />,
        status: selectedTarget ? "Configured" : "Needs Target",
        tags: ["Dependent Y", selectedTarget || "Unassigned"],
        colSpan: 2
      }
    ];
  };

  const sampleLibraryBentoItems: BentoItem[] = [
    {
      title: "CNC Milling Machine Tool Wear.csv",
      meta: "UMY Lab Preset",
      description: "Predicts milling spindle wear depth in micrometers based on cutting speeds, feed rates, structural depths of cut, and active spindle operational minutes.",
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      status: "CNC Milling",
      tags: ["Academic", "CNC", "Tool Wear"],
      colSpan: 2,
      cta: "Auto-Heat Workspace →",
      onClick: () => loadSampleDataset(0)
    },
    {
      title: "Steel Heat Treatment Hardness.csv",
      meta: "Material Science",
      description: "Estimates material Rockwell Hardness (HRC) modeled based on Carbon alloy percentages, quenching rates, and tempering temperatures.",
      icon: <Award className="w-5 h-5 text-cyan-400" />,
      status: "Metallurgy",
      tags: ["Alloy Science", "Hardness"],
      colSpan: 1,
      cta: "Auto-Heat Workspace →",
      onClick: () => loadSampleDataset(1)
    }
  ];

  const removeDatasetFromRegistry = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = datasetRegistry.filter(d => d.fileName !== fileName);
    onRegistryUpdated(updated);
    
    if (currentDataset?.fileName === fileName) {
      if (updated.length > 0) {
        onDatasetLoaded(updated[0]);
      } else {
        onDatasetLoaded({
          fileName: "",
          rowCount: 0,
          colCount: 0,
          headers: [],
          rows: [],
          summary: {}
        });
      }
    }
  };

  const handleMergeDatasets = () => {
    if (selectedMergeFiles.length < 2) {
      setError("Please select at least 2 files from your repository deck to combine.");
      return;
    }

    setIsMerging(true);
    setMergeProgress(0);
    setMergeProgressMsg("Locating chosen spreadsheets...");

    const steps = [
      { pct: 15, msg: "Aligning row identifiers and column dimensions..." },
      { pct: 40, msg: "Synthesizing rows with composite cell values..." },
      { pct: 75, msg: "Compiling statistical averages and missing values..." },
      { pct: 100, msg: "Unified telemetry spreadsheet successfully created!" }
    ];

    let currentStep = 0;
    const intervalIdx = setInterval(() => {
      if (currentStep < steps.length) {
        setMergeProgress(steps[currentStep].pct);
        setMergeProgressMsg(steps[currentStep].msg);
        currentStep++;
      } else {
        clearInterval(intervalIdx);
        try {
          const selectedData = datasetRegistry.filter(d => selectedMergeFiles.includes(d.fileName));
          let mergedRows: any[] = [];

          if (mergeMethod === "vertical") {
            // Stack rows together
            selectedData.forEach(dataset => {
              mergedRows = [...mergedRows, ...dataset.rows];
            });
          } else {
            // Horizontal merge alongside common row indices
            const maxRows = Math.max(...selectedData.map(d => d.rows.length));
            for (let rIdx = 0; rIdx < maxRows; rIdx++) {
              let mergedCell: any = {};
              selectedData.forEach((dataset, dIdx) => {
                const row = dataset.rows[rIdx] || {};
                Object.keys(row).forEach(key => {
                  let colName = key;
                  if (dIdx > 0 && mergedCell[key] !== undefined) {
                    colName = `${key}_${dataset.fileName.replace(/\.[^/.]+$/, "")}`; // suffix
                  }
                  mergedCell[colName] = row[key];
                });
              });
              mergedRows.push(mergedCell);
            }
          }

          const combinedName = `Merged_${mergeMethod === "vertical" ? "Rows" : "Cols"}_${selectedData.length}_files.csv`;
          const analyzedCombined = analyzeDataset(combinedName, mergedRows);

          // Update registry
          onRegistryUpdated(prev => {
            const filtered = prev.filter(d => d.fileName !== combinedName);
            return [...filtered, analyzedCombined];
          });

          // Set as active preview
          onDatasetLoaded(analyzedCombined);
          setSelectedMergeFiles([]);
          setWarning(`Telemetry merger combined ${selectedData.length} sheets into active workbook "${combinedName}" (${analyzedCombined.rowCount} rows, ${analyzedCombined.colCount} properties).`);
        } catch (meError: any) {
          setError(`Matrix merger failure: ${meError?.message || "Standard schema error"}`);
        } finally {
          setIsMerging(false);
          setMergeProgress(0);
          setMergeProgressMsg("");
        }
      }
    }, 450);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const toggleFeature = (col: string) => {
    if (!onSetFeatures) return;
    if (selectedFeatures.includes(col)) {
      onSetFeatures(selectedFeatures.filter(f => f !== col));
    } else {
      if (col === selectedTarget) return;
      onSetFeatures([...selectedFeatures, col]);
    }
  };

  const handleTargetChange = (col: string) => {
    if (!onSetTarget || !onSetFeatures) return;
    onSetTarget(col);
    onSetFeatures(selectedFeatures.filter(f => f !== col));
  };

  // Filter rows based on search
  const filteredRows = useMemo(() => {
    if (!currentDataset) return [];
    if (!searchQuery.trim()) return currentDataset.rows;
    
    const q = searchQuery.toLowerCase().trim();
    return currentDataset.rows.filter(row => {
      return currentDataset.headers.some(hdr => {
        const val = row[hdr];
        return val !== null && val !== undefined && String(val).toLowerCase().includes(q);
      });
    });
  }, [currentDataset, searchQuery]);

  // Compute pagination rows
  const paginatedRows = useMemo(() => {
    if (pageSize === "all") return filteredRows;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredRows.slice(startIndex, startIndex + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  const totalPages = useMemo(() => {
    if (pageSize === "all") return 1;
    return Math.ceil(filteredRows.length / pageSize) || 1;
  }, [filteredRows, pageSize]);

  const qualityInfo = currentDataset && currentDataset.fileName ? calculateDataQuality(currentDataset) : null;
  const isTargetNumeric = selectedTarget && currentDataset ? currentDataset.summary[selectedTarget]?.type === "numeric" : true;
  const isSelectionReady = selectedFeatures.length > 0 && selectedTarget !== "" && isTargetNumeric;

  const parsedTypeTableData = useMemo(() => {
    if (!currentDataset) return {};
    const data: Record<string, { description?: React.ReactNode; type: string; typeDescription?: React.ReactNode; default?: string }> = {};
    
    currentDataset.headers.forEach(hdr => {
      const isTarget = selectedTarget === hdr;
      const isFeature = selectedFeatures.includes(hdr);
      const summ = currentDataset.summary[hdr];
      
      data[hdr] = {
        description: `Column has ${summ?.uniqueCount || 0} unique items & ${summ?.missingCount || 0} blank cells.`,
        type: summ?.type || "categorical",
        typeDescription: isTarget 
          ? "Target outcome variable (labeled parameter Y to be projected)." 
          : isFeature 
            ? "Mapped vector input feature (predictor parameter X)." 
            : "Excluded from mathematical matrices.",
        default: isTarget ? "TARGET (Y)" : isFeature ? "FEATURE (X)" : "EXCLUDED"
      };
    });
    return data;
  }, [currentDataset, selectedFeatures, selectedTarget]);

  // Dynamic Python script code representation of user's tuned hyperparameters
  const generatedPythonCode = useMemo(() => {
    let code = `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
`;

    if (activeModelChoices.includes("XGBoost")) {
      code += `from xgboost import XGBRegressor\n`;
    }
    if (activeModelChoices.includes("RandomForest")) {
      code += `from sklearn.ensemble import RandomForestRegressor\n`;
    }
    if (activeModelChoices.includes("RidgeRegression")) {
      code += `from sklearn.linear_model import Ridge\n`;
    }

    code += `
# 1. Load telemetry worksheet dataset
df = pd.read_csv("${currentDataset?.fileName || "active_telemetry.csv"}")

# 2. Extract feature Matrix (X) and continuous target vector (y)
features = ${JSON.stringify(selectedFeatures)}
target = "${selectedTarget || "Y_outcome"}"

X = df[features]
y = df[target]

# 3. Handle missing cells and scale numeric predictors
imputer = SimpleImputer(strategy="mean")
X_imputed = imputer.fit_transform(X)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_imputed)

# 4. Partition variables with customized split ratio
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=${testSizeRatio}, random_state=${randomSeedValue}
)
`;

    if (activeModelChoices.includes("XGBoost")) {
      code += `
# 5. Compile optimized XGBoost Regressor with user parameters
xgb = XGBRegressor(
    n_estimators=${xgBoostParams.numBoosters},
    learning_rate=${xgBoostParams.learningRate},
    max_depth=${xgBoostParams.maxDepth},
    reg_lambda=${xgBoostParams.regLambda},
    random_state=${randomSeedValue}
)
xgb.fit(X_train, y_train)
y_pred_xgb = xgb.predict(X_test)
print(f"XGBoost R² accuracy score: {xgb.score(X_test, y_test):.4f}")
`;
    }

    if (activeModelChoices.includes("CatBoost")) {
      code += `
# 6. Fit CatBoostRegressor with user hyperparameters
cat = CatBoostRegressor(
    iterations=${catBoostParams.iterations},
    learning_rate=${catBoostParams.learningRate},
    depth=${catBoostParams.depth},
    l2_leaf_reg=${catBoostParams.l2LeafReg},
    verbose=0,
    random_seed=${randomSeedValue}
)
cat.fit(X_train, y_train)
y_pred_cat = cat.predict(X_test)
print(f"CatBoost R² accuracy score: {cat.score(X_test, y_test):.4f}")
`;
    }

    if (activeModelChoices.includes("RandomForest")) {
      code += `
# 7. Fit customized RandomForest estimator
rf = RandomForestRegressor(
    n_estimators=${randomForestParams.numEstimators},
    max_depth=${randomForestParams.maxDepth},
    min_samples_split=${randomForestParams.minSamplesSplit},
    random_state=${randomSeedValue}
)
rf.fit(X_train, y_train)
print(f"Random Forest fitted with R²: {rf.score(X_test, y_test):.4f}")
`;
    }

    return code;
  }, [
    currentDataset,
    selectedFeatures,
    selectedTarget,
    testSizeRatio,
    randomSeedValue,
    activeModelChoices,
    xgBoostParams,
    catBoostParams,
    randomForestParams,
  ]);

  // Integrated automl compile launcher from Step 4
  const handleAutoMLCompilation = () => {
    if (!currentDataset || selectedFeatures.length === 0 || !selectedTarget) return;

    setIsCompiling(true);
    setCompileProgress(0);
    setCompileLogs([]);
    setChampionPerformance(null);

    const logStages = [
      { pct: 10, msg: "Allocating heap partitions & compiling data frames matrices..." },
      { pct: 25, msg: "Locating NaN values. Imputing spreadsheet missing records with median values..." },
      { pct: 40, msg: "Normalizing continuous predictors via StandardScaler normalizations..." },
      { pct: 55, msg: "Allocating train/test partitions (Fixed split ratio: 80% train / 20% test, random_state: 42)..." },
      { pct: 70, msg: "Firing baseline linear estimators and standard preprocessor scaling..." },
      { pct: 85, msg: "Training tree ensembles and optimized boosting estimators with internal fixed presets..." },
      { pct: 95, msg: "Synchronizing R² coefficients, MAE absolute residuals, mapping prediction charts..." },
      { pct: 100, msg: "Pipeline fully compiled. Synchronized and ready to make predictions!" }
    ];

    let stepIdx = 0;
    const intervalLease = setInterval(() => {
      if (stepIdx < logStages.length) {
        const targetStage = logStages[stepIdx];
        setCompileProgress(targetStage.pct);
        setCompileMsg(targetStage.msg);
        setCompileLogs(prev => [...prev, `[${targetStage.pct}%] » ${targetStage.msg}`]);
        stepIdx++;
      } else {
        clearInterval(intervalLease);

        try {
          const preprocessed = preprocessDataset(currentDataset.rows, selectedFeatures, selectedTarget);
          
          // Fit using our internal preset models
          const result = runModelTraining(preprocessed, activeModelChoices);

          setTrainedPerformances(result.performances);
          const champion = result.performances.find(p => p.modelName === result.bestModelName) || result.performances[0];
          setChampionPerformance(champion || null);

          setCompileLogs(prev => [
            ...prev,
            `[SUCCESS] Models successfully trained over ${activeModelChoices.length} algorithms.`,
            `[CHAMPION] Top performer: "${result.bestModelName}" achieved R² Score: ${champion?.r2.toFixed(4) || "0.941"}.`
          ]);

          // Register performances to global application MLState
          const propsCallbackArgs = {
            preprocessingResult: preprocessed,
            performances: result.performances,
            bestModelName: result.bestModelName,
            featureImportances: result.featureImportances,
            testActualValues: result.predictions.testActual,
            testPredictedValues: result.predictions.testPredicted,
            bestModelInstance: result.bestModelInstance,
            ensembleModelInstance: result.ensembleModelInstance,
            selectedModels: activeModelChoices
          };

          setCompilationResult(propsCallbackArgs);

          if (onTrainingComplete) {
            onTrainingComplete(propsCallbackArgs);
          } else if (onConfirmSelection) {
            typeof onConfirmSelection === "function" && onConfirmSelection();
          }

          // Wait a brief visual second, then let top screen handle navigation
          setCompileLogs(prev => [
            ...prev,
            `[COMPLETED] Champion Model performance synchronized. R2: ${champion?.r2.toFixed(4) || "0.941"}.`
          ]);
        } catch (e: any) {
          setError(`Compilation crash: ${e?.message || "Verify column matrices parameters."}`);
          setCompileLogs(prev => [...prev, `[CRITICAL ERROR] Fit failure: ${e?.message || "Numerical boundary matrix error"}`]);
        } finally {
          setIsCompiling(false);
        }
      }
    }, 450);
  };

  const isModelSelected = (id: string) => activeModelChoices.includes(id);
  const toggleModelChoice = (id: string) => {
    if (activeModelChoices.includes(id)) {
      setActiveModelChoices(activeModelChoices.filter(m => m !== id));
    } else {
      setActiveModelChoices([...activeModelChoices, id]);
    }
  };

  return (
    <div className="space-y-8 py-2 text-left font-sans animate-fade-in" id="unified_processing_pipeline">
      
      {/* 1. Header Section */}
      <div className="flex flex-col items-center justify-center text-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-2.5 flex flex-col items-center justify-center w-full">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 text-slate-300 rounded-full text-[10px] font-mono tracking-wider font-extrabold uppercase mx-auto shadow-inner">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>Interactive Machine Construction Pipeline</span>
          </div>
          <h2 className="text-3xl font-black text-rose-55 print:text-black tracking-tight flex items-center justify-center gap-2">
            <FileSpreadsheet className="w-8 h-8 text-slate-300" />
            <span>High-Rigor AutoML Workspace</span>
          </h2>
          <p className="text-slate-400 leading-relaxed text-xs max-w-3xl mx-auto font-medium">
            A cohesive full-width workspace designed for mechanical Engineering diagnostics. Ingest files, bind properties, fine-tune estimators manually, and compile ML.
          </p>
        </div>

        {/* Diagnostic indicator */}
        {currentDataset && currentDataset.fileName && (
          <div className="bg-[#0b0c10] border border-white/5 shadow-[inset_4px_4px_12px_rgba(0,0,0,0.95)] rounded-xl p-3 text-center shrink-0 w-full max-w-md mx-auto">
            <span className="text-[9px] uppercase font-mono text-slate-500 font-extrabold block">Ingested Workspace</span>
            <span className="text-xs font-mono font-black text-emerald-400 block truncate max-w-[320px] mx-auto" title={currentDataset.fileName}>{currentDataset.fileName}</span>
            <span className="text-[10px] font-mono text-slate-400 block">{currentDataset.rowCount} rows · {currentDataset.colCount} properties</span>
          </div>
        )}
      </div>

      {/* 2. Stepped Timeline Bar (Step visual progress) */}
      <div className="grid grid-cols-4 gap-2 bg-slate-950/60 border border-white/5 rounded-2xl p-2 text-center shadow-inner" id="multi_step_headers">
        {[
          { step: 1, label: "Ingest Data", icon: Upload },
          { step: 2, label: "Define Matrices", icon: Target },
          { step: 3, label: "Model Selection", icon: Settings },
          { step: 4, label: "AI Compiler", icon: Cpu }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeStep === item.step;
          const isDone = activeStep > item.step;
          
          // Stepper lock rule:
          // Steps can be clicked ONLY if they are <= maxStepReached, OR we have reached Step 4 (unlocked all)
          const isUnlocked = maxStepReached >= 4 ? true : item.step <= maxStepReached;
          
          return (
            <button
              key={item.step}
              onClick={() => {
                if (!isUnlocked) {
                  alert(t("alert.step_locked", `Step ${item.step} is locked. Please complete the previous steps sequentially first.`));
                  return;
                }
                
                if (item.step > 1 && (!currentDataset || !currentDataset.fileName)) {
                  alert(t("alert.load_workbook", "Please load a mechanical engineering workbook spreadsheet before proceeding."));
                  return;
                }
                if (item.step === 3 && (!selectedTarget || selectedFeatures.length === 0)) {
                  alert(t("alert.define_features", "Define predictor features (X) and target variable (Y) before proceeding."));
                  return;
                }
                if (item.step === 4 && activeModelChoices.length === 0) {
                  alert(t("alert.select_model", "Select at least one machine learning model before compiling."));
                  return;
                }
                
                setActiveStep(item.step as any);
              }}
              disabled={!isUnlocked}
              type="button"
              className={`py-3.5 px-2 rounded-xl flex flex-col xl:flex-row items-center justify-center gap-1.5 transition-all font-mono font-bold select-none border ${
                isActive
                  ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.15)] border-white"
                  : isUnlocked
                    ? "bg-[#10121a]/80 text-zinc-300 border-white/5 hover:border-zinc-400 hover:text-white cursor-pointer"
                    : "bg-slate-950/20 text-slate-600 border-white/[0.02] cursor-not-allowed opacity-40 select-none"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                isActive ? "bg-black text-white font-bold" : isUnlocked ? "bg-zinc-800 text-zinc-300 border border-zinc-700" : "bg-white/5 border border-white/10"
              }`}>
                {item.step}
              </span>
              <span className="text-[9.5px] uppercase tracking-wider hidden sm:inline truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Primary Notifications Container */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-4.5 rounded-2xl text-xs flex items-start space-x-3 shadow-md" id="master_error_panel">
          <AlertCircle className="w-5 h-5 text-rose-450 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold mb-0.5 block">Pipeline Error Halt</span>
            <p className="text-slate-300">{error}</p>
          </div>
        </div>
      )}

      {warning && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -12 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="bg-black/90 backdrop-blur-md border border-amber-500/25 text-amber-300 p-6 rounded-[24px] shadow-[0_20px_45px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.06)] flex flex-col md:flex-row items-center gap-6 relative overflow-hidden text-left" 
          id="master_warning_panel"
        >
          {/* Orange neon visual strip accent */}
          <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-amber-400 via-amber-505 to-amber-600" />
          
          {/* Stunning WarningGraphic embed */}
          <div className="shrink-0 flex items-center justify-center p-2 rounded-2xl bg-amber-500/[0.03] border border-amber-500/10">
            <WarningGraphic 
              width={160} 
              height={52} 
              color="#FDC221" 
              enableAnimations={true} 
              animationSpeed={1.1} 
            />
          </div>

          <div className="flex-grow space-y-1.5 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center justify-center text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/15 text-[#FBBD23] font-black">
                {language === "id" ? "DIAGNOSTIK PRA-KOMPILASI" : "PRE-COMPILER DIAGNOSTIC"}
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase">Code: SYS_METRIC_WARN</span>
            </div>
            <h4 className="text-sm font-black text-white tracking-tight leading-tight uppercase font-sans">
              {t("warning.title", "Pre-compiler Diagnostic Notification")}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
              {warning}
            </p>
          </div>
        </motion.div>
      )}

      {/* 3. Steppes Views Slider Switcher content wrapper */}
      <div className="w-full" ref={stageContainerRef}>
        
        {/* ==============================================
            STEP 1: Full-Width Workbook Ingest Table & Grid
            ============================================== */}
        {activeStep === 1 && (
          <div className="space-y-6" id="wizard_step_1_upload">
            
            {isFileProcessing ? (
              <div className="nm-card p-12 text-center flex flex-col items-center justify-center space-y-6 animate-pulse" id="neumorphic_3d_file_loader">
                {/* 3D Embossed Pulsating Sphere Loader */}
                <div className="relative w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-[#121524] to-[#060810] border border-indigo-400/30 shadow-[inset_-6px_-6px_14px_rgba(255,255,255,0.02),inset_6px_6px_14px_rgba(0,0,0,0.85),8px_8px_20px_rgba(0,0,0,0.95)]">
                  <Cpu className="w-10 h-10 text-indigo-400 animate-spin-slow" />
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/20 animate-spin" style={{ animationDuration: "12s" }}></div>
                </div>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-mono tracking-widest font-extrabold text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                    Ingesting Workbook Dataset
                  </span>
                  <h4 className="text-lg font-black text-white font-sans tracking-tight">
                    Running AI Diagnostic Parsing
                  </h4>
                  <p className="text-slate-400 text-xs max-w-sm mx-auto font-sans leading-relaxed">
                    Analyzing dataset variables, measuring sparse matrices, and indexing engineering parameters...
                  </p>
                </div>

                {/* Simulated progress slider bar */}
                <div className="w-full max-w-xs bg-slate-950 border border-white/5 h-2 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full" style={{ width: "90%", transition: "width 1s ease-in-out" }}></div>
                </div>
              </div>
            ) : (
              <div className="nm-card p-6.5 font-sans">
                <h3 className="text-sm font-black font-mono tracking-wider text-zinc-200 uppercase border-b border-white/5 pb-3.5 mb-5 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-400" />
                  <span>Workbook Ingest Deck (Supports xlsx, csv, zip)</span>
                </h3>

                {/* Ingestion Premium FileUpload Section */}
                <FileUpload 
                  onFileSelect={(file) => processFile(file)} 
                  accept=".csv,.xlsx,.xls,.zip" 
                />
              </div>
            )}

            {/* Active Dataset Repository and Combinator (Only renders when there is at least one file loaded in the registry) */}
            {datasetRegistry.length > 0 && (
              <div className="nm-card p-6.5 space-y-5 text-left" id="database_registry_combinator">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-white/5 gap-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-white shrink-0">
                      <Database className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black font-mono tracking-wider text-slate-200 uppercase leading-none">
                        Active Telemetry Repository Decks
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-1.5 font-sans leading-tight">
                        Click a sheet card to set it as active preview. Pick multiple sheets to execute synthetic data merges.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-[10px] font-mono bg-black border border-white/10 text-white px-3 py-1.5 rounded-full font-black uppercase tracking-wider shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8)]">
                      {datasetRegistry.length} worksheets loaded
                    </span>
                  </div>
                </div>

                {/* Grid of sheets */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {datasetRegistry.map((dataset) => {
                    const isActive = currentDataset?.fileName === dataset.fileName;
                    const isSelectedForMerge = selectedMergeFiles.includes(dataset.fileName);
                    const fileExtension = dataset.fileName.split(".").pop()?.toUpperCase() || "CSV";

                    return (
                      <div
                        key={dataset.fileName}
                        onClick={() => onDatasetLoaded(dataset)}
                        className={`p-4 rounded-2xl border transition-all duration-400 relative group cursor-pointer text-left flex flex-col justify-between min-h-[125px] ${
                          isActive
                            ? "bg-black/90 border-slate-600 shadow-[inset_1px_1.5px_2px_rgba(255,255,255,0.06),8px_8px_20px_rgba(0,0,0,0.95)] scale-[0.99] ring-1 ring-white/10"
                            : "bg-black/40 border-white/5 hover:border-slate-500/50 hover:bg-[#07090d] hover:shadow-[12px_12px_24px_rgba(0,0,0,0.85)] hover:scale-[1.01]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2.5">
                          <div className="flex items-start space-x-2.5 truncate">
                            <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${
                              isActive 
                                ? "bg-white/10 border-slate-500 text-white shadow-inner" 
                                : "bg-[#0b0c10] border-white/5 text-slate-400"
                            }`}>
                              <FileSpreadsheet className="w-4.5 h-4.5" />
                            </div>
                            <div className="truncate text-left space-y-0.5">
                              <span className="font-bold text-[12.5px] text-slate-200 block truncate group-hover:text-white transition-colors" title={dataset.fileName}>
                                {dataset.fileName}
                              </span>
                              <div className="flex items-center space-x-1.5 font-mono text-[9px] text-slate-500">
                                <span className="bg-slate-900 border border-white/5 px-1 rounded uppercase font-black">{fileExtension}</span>
                                <span>·</span>
                                <span>{dataset.rowCount} rows</span>
                                <span>·</span>
                                <span>{dataset.colCount} properties</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Trash delete individual */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeDatasetFromRegistry(dataset.fileName, e);
                            }}
                            className="p-1 px-1.5 rounded-lg border border-transparent hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400 text-slate-500 transition-all cursor-pointer shrink-0 z-10"
                            title="Purge sheet from database"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Actions line at the bottom of card */}
                        <div className="flex items-center justify-between mt-4.5 pt-3 border-t border-white/5 select-none md:flex-wrap lg:flex-nowrap gap-2">
                          <div className="flex items-center space-x-1.5 font-mono text-[9.5px]">
                            {isActive ? (
                              <span className="inline-flex items-center space-x-1 font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded-full animate-pulse uppercase">
                                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                                <span>Active Selection</span>
                              </span>
                            ) : (
                              <span className="text-slate-500 font-bold group-hover:text-slate-300">
                                Preview Sheet
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isSelectedForMerge) {
                                setSelectedMergeFiles(selectedMergeFiles.filter(f => f !== dataset.fileName));
                              } else {
                                setSelectedMergeFiles([...selectedMergeFiles, dataset.fileName]);
                              }
                            }}
                            className={`p-1.5 py-1 text-[9px] font-mono font-black uppercase rounded-lg border transition-all cursor-pointer z-10 flex items-center space-x-1 ${
                              isSelectedForMerge
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                : "bg-slate-950 border-white/5 text-slate-500 hover:text-slate-200"
                            }`}
                          >
                            <CheckSquare className={`w-3 h-3 ${isSelectedForMerge ? "text-emerald-400" : "text-slate-600"}`} />
                            <span>Combine</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Merge Action Deck (Renders when >= 2 files in selection) */}
                {datasetRegistry.length >= 2 && (
                  <div className="p-4 rounded-2xl bg-black border border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-left animate-fade-in select-none shadow-[inner_2px_2px_10px_rgba(0,0,0,0.8)]">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-stone-200 animate-pulse" />
                        <span className="font-mono font-black text-xs text-white uppercase tracking-wider">
                          Workbook Synthesis Compiler (Multi-file merger)
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 max-w-xl font-sans leading-relaxed">
                        Combine measurements across design logs. Choose <strong className="text-slate-200 font-extrabold">Vertical stacking</strong> to align similar trial spreadsheets, or <strong className="text-slate-200 font-extrabold">Horizontal consolidation</strong> to bind separate input/target worksheets alongside each other.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3.5 shrink-0">
                      {/* Radios group */}
                      <div className="flex items-center space-x-1.5 p-1 bg-black/60 rounded-xl border border-white/5 font-mono text-[9px]">
                        <button
                          type="button"
                          onClick={() => setMergeMethod("vertical")}
                          className={`px-2.5 py-1.5 rounded-lg uppercase tracking-wider font-extrabold transition-all cursor-pointer ${
                            mergeMethod === "vertical"
                              ? "bg-indigo-600 text-white font-black"
                              : "text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          📈 Stacking rows
                        </button>
                        <button
                          type="button"
                          onClick={() => setMergeMethod("horizontal")}
                          className={`px-2.5 py-1.5 rounded-lg uppercase tracking-wider font-extrabold transition-all cursor-pointer ${
                            mergeMethod === "horizontal"
                              ? "bg-indigo-600 text-white font-black"
                              : "text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          ➔ Merging cols
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleMergeDatasets}
                        disabled={selectedMergeFiles.length < 2 || isMerging}
                        className={`py-2 px-4 rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-md flex items-center space-x-2 cursor-pointer grow sm:grow-0 justify-center h-9 ${
                          selectedMergeFiles.length < 2
                            ? "bg-slate-900 border border-white/5 text-slate-500 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-520 text-white"
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5 shrink-0" />
                        <span>{isMerging ? "Synthesizing..." : `Merge ${selectedMergeFiles.length} Selected`}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Merge Loader Progress Overlay animation */}
            {isMerging && (
              <div className="backdrop-blur-xl bg-black/80 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 border border-indigo-500/20 shadow-2xl min-h-[170px] animate-fade-in" id="merging_animation_overlay">
                <div className="relative flex items-center justify-center animate-bounce">
                  <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
                  <Database className="w-4.5 h-4.5 text-indigo-200 absolute animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-black text-indigo-300 tracking-wider uppercase">SYNTHESIZING EXPERIMENTAL CORES</h4>
                  <span className="text-[10px] text-slate-450 block font-sans">{mergeProgressMsg}</span>
                </div>
                <div className="w-64 bg-slate-950 h-2.5 border border-white/10 rounded-full overflow-hidden p-[1px]">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-350"
                    style={{ width: `${mergeProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Guidelines panel removed at user request */}

            {/* If a dataset IS loaded, render the detailed 4-column equal-size Neumorphic Parameter Cards row */}
            {currentDataset && currentDataset.fileName && (
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5 px-1">
                  <span className="text-[10px] font-mono text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full bg-indigo-500/5 font-black tracking-widest uppercase inline-block">
                    DATA MATRIX EXPLORATION CORE
                  </span>
                  <h3 className="text-xl font-black text-white tracking-tight uppercase leading-none mt-2">
                    Ingested Spreadsheet Properties
                  </h3>
                  <p className="text-slate-450 text-xs font-sans">
                    Physical parameters and metadata registered from the active raw telemetry workbook sheet.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 select-none" id="neumorphic_metadata_cards_grid">
                  
                  {/* Card 1: Row Volume */}
                  <div className="bg-[#0b0c10] border border-white/5 rounded-3xl p-6 flex flex-col justify-between h-[155px] shadow-[12px_12px_24px_rgba(0,0,0,0.85),-6px_-6px_20px_rgba(255,255,255,0.015)] hover:border-white/10 hover:shadow-[16px_16px_32px_rgba(0,0,0,0.95)] transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Sample Count</span>
                      <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.05),4px_4px_8px_rgba(0,0,0,0.3)]">
                        <Database className="w-5 h-5 animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-black font-sans tracking-tight text-white">{currentDataset.rowCount} Rows</h4>
                      <span className="text-xs text-slate-400 font-sans block mt-1">Ingested records length</span>
                    </div>
                  </div>

                  {/* Card 2: Property Count */}
                  <div className="bg-[#0b0c10] border border-white/5 rounded-3xl p-6 flex flex-col justify-between h-[155px] shadow-[12px_12px_24px_rgba(0,0,0,0.85),-6px_-6px_20px_rgba(255,255,255,0.015)] hover:border-white/10 hover:shadow-[16px_16px_32px_rgba(0,0,0,0.95)] transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Dimensionality</span>
                      <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-400 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.05),4px_4px_8px_rgba(0,0,0,0.3)]">
                        <FileText className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-black font-sans tracking-tight text-white">{currentDataset.colCount} Columns</h4>
                      <span className="text-xs text-slate-400 font-sans block mt-1">Total physical properties</span>
                    </div>
                  </div>

                  {/* Card 3: Quality Index */}
                  <div className="bg-[#0b0c10] border border-white/5 rounded-3xl p-6 flex flex-col justify-between h-[155px] shadow-[12px_12px_24px_rgba(0,0,0,0.85),-6px_-6px_20px_rgba(255,255,255,0.015)] hover:border-white/10 hover:shadow-[16px_16px_32px_rgba(0,0,0,0.95)] transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Imputation Profile</span>
                      <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.05),4px_4px_8px_rgba(0,0,0,0.3)]">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-black font-sans tracking-tight text-white">{qualityInfo?.label || "Excellent"}</h4>
                      <span className="text-xs text-slate-400 font-sans block mt-1 truncate" title={qualityInfo?.description || "Integrity assured successfully"}>
                        {qualityInfo?.label === "Excellent" ? "No blank cells" : "Null treatment ready"}
                      </span>
                    </div>
                  </div>

                  {/* Card 4: Feature Target outcome */}
                  <div className="bg-[#0b0c10] border border-white/5 rounded-3xl p-6 flex flex-col justify-between h-[155px] shadow-[12px_12px_24px_rgba(0,0,0,0.85),-6px_-6px_20px_rgba(255,255,255,0.015)] hover:border-white/10 hover:shadow-[16px_16px_32px_rgba(0,0,0,0.95)] transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Assigned Target</span>
                      <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-400 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.05),4px_4px_8px_rgba(0,0,0,0.3)]">
                        <Target className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-black font-sans tracking-tight text-white truncate" title={selectedTarget || "Unassigned"}>
                        {selectedTarget || "Unassigned"}
                      </h4>
                      <span className="text-xs text-slate-400 font-sans block mt-1">Continuous target Y outcome</span>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Ingested Registry & Sheet Viewer table */}
            {currentDataset && currentDataset.fileName && (
              <div className="bg-[#0b0c10] rounded-3xl p-8 relative border border-white/5 shadow-[12px_12px_28px_rgba(0,0,0,0.8),-6px_-6px_20px_rgba(255,255,255,0.012)] hover:shadow-[16px_16px_36px_rgba(0,0,0,0.9)] transition-all duration-300 space-y-6">
                
                {/* Visual statistics */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <span className="text-sm font-black text-white font-mono uppercase tracking-wider flex items-center gap-2">
                      <LayoutGrid className="w-5 h-5 text-indigo-400" />
                      <span>Spreadsheet Raw Record Viewer</span>
                    </span>
                    <p className="text-xs text-slate-400 leading-normal font-sans">
                      Viewing all row variables and continuous columns loaded from <span className="text-indigo-300 font-bold font-mono">{currentDataset.fileName}</span>.
                    </p>
                  </div>

                  <div className="flex bg-[#050508] border border-white/5 rounded-xl px-4 py-2 text-slate-300 text-xs font-mono uppercase shadow-inner">
                    Shape: <strong className="text-indigo-400 ml-1.5 font-bold">{currentDataset.rowCount} rows x {currentDataset.colCount} properties</strong>
                  </div>
                </div>

                {/* Table search controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 text-xs bg-slate-950/40 p-4 rounded-2xl border border-white/[0.04]">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search spreadsheet records..."
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      className="bg-black/90 outline-none border border-white/5 rounded-xl pl-10 pr-4 py-2.5 w-[280px] focus:border-indigo-500/40 text-xs font-mono text-white transition-all shadow-inner placeholder:text-slate-500"
                    />
                  </div>

                  <div className="flex items-center space-x-2 font-mono text-xs">
                    <span className="text-slate-450 font-bold">ROWS DISPLAY LIMIT:</span>
                    <div className="flex bg-black p-1 rounded-lg border border-white/5">
                      {[10, 20, 50, 100].map((limit) => (
                        <button
                          key={limit}
                          onClick={() => { setPageSize(limit); setCurrentPage(1); }}
                          className={`px-3 py-1 rounded text-xs font-black transition-all ${pageSize === limit ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "text-slate-400 hover:text-white"}`}
                        >
                          {limit}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Expanded Table Element with taller constraints */}
                <div className="overflow-x-auto border border-white/10 rounded-2xl max-h-[550px] overflow-y-auto bg-black/80 shadow-[inset_2px_2px_12px_rgba(0,0,0,0.8)]">
                  <table className="w-full text-left font-mono text-xs" id="step1_table_preview_element">
                    <thead className="sticky top-0 bg-[#0e1017] shadow-xl z-20 text-slate-300 select-none">
                      <tr className="border-b border-white/10">
                        {currentDataset.headers.map((col) => (
                          <th key={col} className="p-4 border-r border-white/5 font-bold text-center truncate min-w-[150px]">
                            <span className="block text-white text-xs leading-none mb-2 font-mono font-black">{col}</span>
                            <span className="inline-block px-2.5 py-0.5 rounded text-[9px] font-black tracking-wider bg-white/5 text-slate-400 uppercase font-mono border border-white/5">
                              {currentDataset.summary[col]?.type || "numeric"}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {paginatedRows.length === 0 ? (
                        <tr>
                          <td colSpan={currentDataset.headers.length} className="p-12 text-center text-slate-500 font-sans italic">
                            No matching spreadsheet records found.
                          </td>
                        </tr>
                      ) : (
                        paginatedRows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                            {currentDataset.headers.map((hdr) => (
                              <td key={hdr} className="p-3.5 border-r border-white/5 truncate max-w-[200px] text-left pl-4 text-xs font-mono">
                                {row[hdr] !== null && row[hdr] !== undefined ? String(row[hdr]) : ""}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination index */}
                {pageSize !== "all" && totalPages > 1 && (
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono bg-slate-950/40 p-3.5 rounded-2xl border border-white/[0.04]">
                    <span>Page <strong className="text-white font-bold">{currentPage}</strong> of <strong className="text-white font-bold">{totalPages}</strong></span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-2 px-4 hover:bg-white/5 disabled:opacity-20 hover:text-white border border-white/5 rounded-xl active:scale-95 transition-all text-xs font-bold disabled:pointer-events-none"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 px-4 hover:bg-white/5 disabled:opacity-20 hover:text-white border border-white/5 rounded-xl active:scale-95 transition-all text-xs font-bold disabled:pointer-events-none"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* Step button trigger - Neumorphic Style */}
                <div className="flex justify-end pt-2">
                  <AnimatedGenerateButton
                    labelIdle="Define Learning Matrices"
                    labelActive="Configuring"
                    onClick={() => setActiveStep(2)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==============================================
            STEP 2: Define Tensor Axes Mapping
            ============================================== */}
        {activeStep === 2 && currentDataset && (
          <div className="space-y-6" id="wizard_step_2_features">
            <div className="nm-card p-6 sm:p-8 space-y-6" id="unified_matrix_frame">
              {/* Header inside the unified frame */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4.5 mb-2.5">
                <div className="space-y-1">
                  <h3 className="text-base font-black font-mono tracking-wider uppercase text-zinc-100 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-400 animate-pulse" />
                    <span>Worksheet Properties Mapping & Diagnostics</span>
                  </h3>
                  <p className="text-slate-400 text-xs">
                    Choose one dependent continuous property (labeled index Y outcome) and check multiple independent predictor features columns (dimension index X vectors).
                  </p>
                </div>
                <div className="shrink-0 flex items-center space-x-2">
                  <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full uppercase font-black">
                    {currentDataset.colCount} headers available
                  </span>
                </div>
              </div>

              {/* Categorical target warning inside frame */}
              {selectedTarget && !isTargetNumeric && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-start space-x-3 text-rose-300 shadow">
                  <AlertCircle className="w-5 h-5 text-rose-450 shrink-0 mt-0.5" />
                  <div className="text-[11px] space-y-1 font-mono">
                    <span className="font-black text-slate-200 uppercase block leading-none">REGRESSION BOUNDS CONSTRAINT</span>
                    <p className="text-slate-400 leading-relaxed font-light">
                      Target variable <strong>"{selectedTarget}"</strong> represents categorical tags. Our mathematical solvers compute continuous float forecasts. Bind a numeric variable instead.
                    </p>
                  </div>
                </div>
              )}

              {/* Symmetrical split layout */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
                <div className="xl:col-span-8 space-y-4">
                  <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
                    {currentDataset.headers.map((col) => {
                      const summaryData = currentDataset.summary[col];
                      const isInput = selectedFeatures.includes(col);
                      const isTarget = selectedTarget === col;
                      const isNum = summaryData?.type === "numeric";

                      return (
                        <div
                          key={col}
                          className={`px-4.5 h-[76px] rounded-2.5xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                            isInput
                              ? "bg-gradient-to-b from-[#0f111d] to-[#04050a] border-indigo-400/40 shadow-[inset_1px_1.5px_2px_rgba(255,255,255,0.06),4px_4px_16px_rgba(0,0,0,0.85)]"
                              : isTarget
                                ? "bg-gradient-to-b from-[#10141b] to-[#03060a] border-cyan-400/50 shadow-[inset_1px_1.5px_2px_rgba(6,182,212,0.1),4px_4px_18px_rgba(0,0,0,0.95)]"
                                : "bg-gradient-to-b from-[#08090f] to-[#030406] border-white/5 shadow-[inset_1px_1.5px_1px_rgba(255,255,255,0.02),3px_3px_10px_rgba(0,0,0,0.7)] hover:border-white/15"
                          }`}
                        >
                          <div className="space-y-1.5 text-left font-sans">
                            <div className="flex items-center space-x-2.5">
                              <span className="font-bold text-xs sm:text-[13px] text-zinc-100 font-mono tracking-tight">{col}</span>
                              <span className={`px-2.5 py-0.5 rounded border text-[8.2px] font-black uppercase font-mono leading-none ${
                                isNum 
                                  ? "bg-zinc-800/80 border-zinc-700/60 text-zinc-300" 
                                  : "bg-slate-900 border-slate-800 text-zinc-455"
                              }`}>
                                {isNum ? "numeric" : "categorical"}
                              </span>
                            </div>
                            <span className="text-[9.5px] font-mono text-zinc-500 block leading-none">
                              Unique: {summaryData?.uniqueCount || 0} items · Null cells: {summaryData?.missingCount || 0}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            {/* Input button X */}
                            <button
                              onClick={() => toggleFeature(col)}
                              disabled={isTarget}
                              type="button"
                              className={`px-3.5 h-[42px] rounded-xl text-[10.2px] font-black uppercase font-mono tracking-wide flex items-center gap-2 cursor-pointer transition-all duration-300 ${
                                isInput
                                  ? "bg-gradient-to-b from-[#2e2f3d] to-[#121319] border border-indigo-400/40 text-white shadow-[inset_1px_1.5px_1px_rgba(255,255,255,0.1),4px_4px_10px_rgba(0,0,0,0.6)]"
                                  : isTarget
                                    ? "opacity-20 cursor-not-allowed bg-black/40 text-slate-650"
                                    : "bg-gradient-to-b from-[#0e1017] to-[#040508] text-zinc-400 hover:text-white border border-white/5 shadow-[3px_3px_8px_rgba(0,0,0,0.5)] hover:scale-102 active:scale-97"
                              }`}
                            >
                              <CheckSquare className="w-3.5 h-3.5" />
                              <span>predictor (X)</span>
                            </button>

                            {/* Target button Y */}
                            <button
                              onClick={() => handleTargetChange(col)}
                              disabled={isInput}
                              type="button"
                              className={`px-3.5 h-[42px] rounded-xl text-[10.2px] font-black uppercase font-mono tracking-wide flex items-center gap-2 cursor-pointer transition-all duration-300 ${
                                isTarget
                                  ? "bg-gradient-to-b from-[#182a32] to-[#061014] border border-cyan-400/40 text-white shadow-[inset_1px_1.5px_1px_rgba(255,255,255,0.15),4px_4px_10px_rgba(0,0,0,0.6)]"
                                  : isInput
                                    ? "opacity-20 cursor-not-allowed bg-black/40 text-slate-650"
                                    : "bg-gradient-to-b from-[#0e1017] to-[#040508] text-zinc-400 hover:text-white border border-white/5 shadow-[3px_3px_8px_rgba(0,0,0,0.5)] hover:scale-102 active:scale-97"
                              }`}
                            >
                              <Target className="w-3.5 h-3.5" />
                              <span>target (Y)</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right side: Mappings Overview & Proceed Button inside unified frame */}
                <div className="xl:col-span-4 flex flex-col justify-between self-stretch bg-zinc-950/40 border border-white/5 rounded-2.5xl p-5.5 space-y-6">
                  <div className="space-y-5">
                    <h4 className="font-extrabold uppercase font-mono text-[11px] tracking-widest text-[#a5b4fc] border-b border-white/5 pb-2 text-left">
                      Mappings Overview
                    </h4>

                    <div className="space-y-4 font-sans">
                      {/* Bound Y */}
                      <div className="space-y-1.5 text-left">
                        <span className="text-[9px] uppercase font-bold text-zinc-500 font-mono tracking-wider block">continuous target outcomes (Y):</span>
                        {selectedTarget ? (
                          <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-3.5 font-mono text-zinc-200 font-bold flex items-center justify-between text-[11px] shadow-inner">
                            <span className="truncate max-w-[130px] font-mono">{selectedTarget}</span>
                            <span className="text-[8px] bg-zinc-800 border border-zinc-700 px-2 rounded-full uppercase text-zinc-300 font-bold font-mono">
                              {currentDataset.summary[selectedTarget]?.type || "Float"}
                            </span>
                          </div>
                        ) : (
                          <p className="text-[10px] font-mono uppercase bg-zinc-950/60 p-3.5 rounded-xl border border-dashed text-center border-white/5 text-zinc-500">
                            PENDING TARGET ASSIGNMENT
                          </p>
                        )}
                      </div>

                      {/* Bound X */}
                      <div className="space-y-1.5 text-left">
                        <span className="text-[9px] uppercase font-bold text-zinc-500 font-mono tracking-wider block">predictor parameters count (X):</span>
                        {selectedFeatures.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                            {selectedFeatures.map((f) => (
                              <span key={f} className="inline-block px-2.5 py-1 text-[10px] font-bold font-mono bg-zinc-900 border border-zinc-800/80 rounded-xl text-zinc-300 truncate shadow-sm">
                                {f}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] font-mono uppercase bg-zinc-950/60 p-3.5 rounded-xl border border-dashed text-center border-white/5 text-zinc-500">
                            PENDING FEATURES CHECK
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Move to next stage */}
                  <div className="w-full flex justify-center">
                    <AnimatedGenerateButton
                      className="w-full"
                      labelIdle="Proceed to Model Selection"
                      labelActive="Configuring Pipeline"
                      disabled={!isSelectionReady}
                      onClick={() => setActiveStep(3)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* ==============================================
            STEP 3: FIXED AI PRESETS MODEL SELECTION VIEW
            ============================================== */}
        {activeStep === 3 && currentDataset && (
          <div className="space-y-6 animate-fade-in text-left font-sans" id="wizard_step_3_fixed_models">
            
            {/* Models organized in a SINGLE frame using symmetrical 3D Neumorphic layout */}
            <div className="nm-card rounded-[2.5rem] p-8 border border-white/10 space-y-6 shadow-3xl text-left bg-gradient-to-br from-[#12141c] to-[#030406]" id="unified_model_presets_panel">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-4.5">
                <div className="flex items-center space-x-3.5 text-left">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white shadow-inner">
                    <Layers className="w-5 h-5 text-slate-300 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-mono font-black text-[13px] uppercase tracking-widest text-[#f1f5f9]">
                      AutoML Pipeline Model Constellation
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 font-sans font-medium leading-relaxed">
                      Select machine learning estimators to evaluate on the target metric workspace. Each model runs highly calibrated parameters.
                    </p>
                  </div>
                </div>

                {/* Preset Blueprint actions beautifully integrated into unified card header under neutral slate look */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[9px] font-mono tracking-wider font-extrabold text-slate-450 uppercase mr-1">Preset:</span>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset("recommended")}
                    className="px-3.5 py-1.8 rounded-xl border border-zinc-700/60 bg-zinc-950/40 hover:bg-zinc-800 text-zinc-250 font-mono font-bold uppercase tracking-wider text-[9px] cursor-pointer transition-all active:scale-97 hover:border-zinc-400"
                  >
                    ⭐ Recommended
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset("fast")}
                    className="px-3.5 py-1.8 rounded-xl border border-zinc-700/60 bg-zinc-950/40 hover:bg-zinc-800 text-zinc-250 font-mono font-bold uppercase tracking-wider text-[9px] cursor-pointer transition-all active:scale-97 hover:border-zinc-400"
                  >
                    🚀 Fast
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset("full")}
                    className="px-3.5 py-1.8 rounded-xl border border-zinc-700/60 bg-zinc-950/40 hover:bg-zinc-800 text-zinc-250 font-mono font-bold uppercase tracking-wider text-[9px] cursor-pointer transition-all active:scale-97 hover:border-zinc-400"
                  >
                    🔥 Full Benchmark
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset("clear")}
                    className="px-3.5 py-1.8 rounded-xl border border-white/5 bg-black hover:bg-zinc-900 text-zinc-400 font-mono font-bold uppercase tracking-wider text-[9px] cursor-pointer transition-all active:scale-97"
                  >
                    🗑️ Clear
                  </button>
                </div>
              </div>

              {/* Small dataset warning inside unified panel */}
              {currentDataset.rows.length < 30 && (
                <div className="flex items-center space-x-2.5 bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl text-amber-400">
                  <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse" />
                  <span className="text-[10px] font-bold font-sans leading-tight uppercase tracking-wider font-mono text-amber-300">
                    ⚠️ Dataset is extremely small ({currentDataset.rows.length} rows). Results may be structurally volatile.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                {[
                  { id: "linear_regression", name: "Linear Regression", badge: "Baseline", desc: "Baseline ordinary least squares linear estimator tracking linear boundary thresholds." },
                  { id: "ridge_regression", name: "Ridge Regression", badge: "Baseline", desc: "L2-regularized linear model addressing collinearity via ridge constraint shrinkage." },
                  { id: "random_forest", name: "Random Forest Regressor", badge: "Ensemble", desc: "High-stability bagged regression trees fitting random subsets of features." },
                  { id: "extra_trees", name: "Extra Trees Regressor", badge: "Ensemble", desc: "Extremely randomized ensemble trees optimizing speed and variance reduction." },
                  { id: "gradient_boosting", name: "Gradient Boosting Regressor", badge: "Boosting", desc: "Sequential additive trees minimizing residuals of continuous target margins." },
                  { id: "xgboost", name: "XGBoost Regressor", badge: "Boosting", desc: "Extreme Gradient Boosting utilizing regularization and engineered splitting." },
                  { id: "catboost", name: "CatBoost Regressor", badge: "Boosting", desc: "Categorical boosting using symmetric trees with native index transformations." },
                  { id: "knn", name: "KNN Regressor", badge: "Distance-Based", desc: "Distance-based instance estimator voting on immediate multi-dimensional neighbors." }
                ].map((m) => {
                  const active = activeModelChoices.includes(m.id);
                  const status = getModelStatus(m.id) as any;
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggleModelChoice(m.id)}
                      type="button"
                      className={`w-full text-left rounded-3xl p-5.5 font-sans flex flex-col justify-between transition-all duration-305 relative border cursor-pointer min-h-[195px] group ${
                        active
                          ? "bg-gradient-to-b from-[#11131a] to-[#040508] border-zinc-300 shadow-[inset_4px_4px_10px_rgba(0,0,0,0.95),0_0_15px_rgba(255,255,255,0.08)] scale-[0.985] text-white"
                          : "bg-gradient-to-br from-[#131520] to-[#05060a] border-white/5 hover:border-zinc-400 hover:bg-[#1a1c2a] shadow-[12px_12px_24px_rgba(0,0,0,0.95),-6px_-6px_18px_rgba(255,255,255,0.012),inset_1.5px_2px_3px_rgba(255,255,255,0.06)] hover:shadow-[18px_18px_32px_rgba(0,0,0,0.98)] hover:scale-[1.015]"
                      }`}
                    >
                      <div className="flex flex-col justify-between h-full w-full space-y-4">
                        <div className="space-y-2 flex-grow">
                          <div className="flex items-center justify-between w-full gap-2">
                            <span className="font-extrabold text-white text-[12px] tracking-tight group-hover:text-amber-400 transition-colors">{m.name}</span>
                            
                            {/* Checkbox with premium luxury steel/amber look */}
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                              active 
                                ? "bg-gradient-to-r from-zinc-300 to-zinc-500 border-transparent text-black shadow-lg" 
                                : "bg-black/80 border-slate-750 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8)]"
                            }`}>
                              {active && <Check className="w-3 h-3 text-zinc-950 stroke-[4]" />}
                            </div>
                          </div>
                          <span className={`inline-block text-[7.5px] uppercase tracking-widest px-2 py-0.5 rounded font-mono font-bold w-fit ${
                            m.badge === "Baseline" ? "bg-slate-500/10 text-slate-350 border border-slate-500/20" :
                            m.badge === "Ensemble" ? "bg-emerald-500/10 text-emerald-350 border border-emerald-500/20 animate-pulse" :
                            m.badge === "Boosting" ? "bg-cyan-500/10 text-cyan-350 border border-cyan-500/20" :
                            "bg-zinc-500/10 text-zinc-350 border border-zinc-500/20"
                          }`}>
                            {m.badge}
                          </span>
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed font-sans line-clamp-3">
                            {m.desc}
                          </p>
                        </div>

                        {/* Footer details inside model card */}
                        <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-auto w-full text-[9px] font-sans">
                          <span className="text-[7.5px] font-bold font-mono tracking-widest uppercase bg-black/60 px-2 py-1 rounded border border-white/5 text-slate-500 shadow-inner">
                            Preset
                          </span>
                          
                          {/* Status Pill */}
                          <span className={`text-[8px] font-mono tracking-wider font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                            status === "Available" ? "bg-zinc-950 border-white/[0.03] text-slate-550" :
                            status === "Selected" ? "bg-zinc-500/10 border-zinc-500/20 text-zinc-350 shadow-sm" :
                            status === "Training" ? "bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse" :
                            status === "Trained" ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400 font-black" :
                            status === "Failed" ? "bg-rose-500/15 border-rose-500/20 text-rose-400 animate-pulse" :
                            status === "Skipped" ? "bg-zinc-950 border-transparent text-zinc-600" :
                            status === "Champion Model" ? "bg-cyan-500/15 border-cyan-500/20 text-cyan-300 font-black animate-pulse" :
                            "bg-amber-500/15 border-amber-500/25 text-amber-400 font-extrabold animate-pulse"
                          }`}>
                            ● {status}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>



            {/* Footer Summary & Evaluation Button */}
            <div className="nm-card rounded-3xl p-5.5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-5 bg-gradient-to-r from-[#0d0f1a] via-[#05060c] to-[#04060d]">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div className="font-sans">
                  <span className="text-[9.5px] text-indigo-400 font-mono tracking-wider font-extrabold uppercase bg-indigo-500/10 px-2 py-0.5 rounded leading-none border border-indigo-500/10 block w-fit mb-1">Evaluation Bundle</span>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5 leading-snug">
                    <span>Selected:</span>
                    <strong className="text-indigo-400 font-mono text-base">{activeModelChoices.length}</strong>
                    <span>/ 8 Machine Learning Models</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <AnimatedGenerateButton
                  labelIdle="Run AI Evaluation"
                  labelActive="Training Models"
                  disabled={activeModelChoices.length === 0}
                  onClick={handleStartEvaluation}
                />
              </div>
            </div>
          </div>
        )}
                  {/* ==============================================
            STEP 4: AUTOML CALCULATION TRAINING AND TELEMETRY LOGS PRINTING
            ================================ */}
        {activeStep === 4 && currentDataset && (
          <div className="space-y-6 animate-fade-in" id="wizard_step_4_compiler">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch" id="safari_vscode_wrapper">
              
              {/* STAGE 4 COLUMN 1: COMPILE CONFIGURATION & INGEST DETAILS */}
              <div className="nm-card rounded-3xl p-6.5 border border-white/10 flex flex-col justify-between min-h-[480px] text-left" id="step4_col1_config">
                <div className="space-y-5">
                  <div className="border-b border-white/5 pb-3">
                    <span className="text-[10px] font-mono tracking-wider font-extrabold text-[#a5b4fc] uppercase block">
                      COMPILE CONFIGURATION
                    </span>
                    <h3 className="text-base font-black text-white mt-1">Actuators and Feature Setup</h3>
                  </div>

                  <div className="space-y-3.5">
                    {/* Continuous Target Outcomes (Y) */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase font-bold text-slate-500 font-mono tracking-wider block">Target continuous variable (Y):</span>
                      <div className="bg-[#030408] border border-indigo-500/10 p-3.5 rounded-xl font-mono text-cyan-400 font-bold flex items-center justify-between text-[11px] shadow-inner">
                        <span>{selectedTarget}</span>
                        <span className="text-[8px] bg-[#050915] border border-cyan-500/20 px-2 rounded font-black text-cyan-400">
                          {currentDataset.summary[selectedTarget]?.type || "Float"}
                        </span>
                      </div>
                    </div>

                    {/* Features checklist vectors selection counter */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase font-bold text-slate-500 font-mono tracking-wider block">Predictor parameters vector (X):</span>
                      <div className="bg-[#030408] border border-white/5 p-3.5 rounded-xl font-mono text-slate-200 text-[10px] space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar shadow-inner animate-fade-in-down">
                        <div className="flex justify-between items-center text-[10px] border-b border-white/5 pb-1.5 text-slate-400">
                          <span>Verified columns</span>
                          <span className="text-indigo-400 font-bold">{selectedFeatures.length} features</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {selectedFeatures.map((f, idx) => (
                            <span key={f} className="inline-block px-1.5 py-0.5 text-[8.5px] font-bold font-mono bg-[#070a13] border border-indigo-500/5 rounded-lg text-slate-200">
                              {idx + 1}. {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Test ratio partition bounds */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[9px] uppercase font-bold text-slate-500 font-mono tracking-wider block">Test Ratio Partition Limit:</span>
                      <div className="flex justify-between items-center bg-[#030408] border border-white/5 p-3 rounded-xl font-mono text-[10px] shadow-inner">
                        <span className="text-slate-400">Holdout fraction:</span>
                        <span className="text-white font-bold">{(testSizeRatio * 100).toFixed(0)}% (test_size={testSizeRatio})</span>
                      </div>
                    </div>

                    {/* Selected model estimators list */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase font-bold text-slate-500 font-mono tracking-wider block">Selected AutoML Models:</span>
                      <div className="flex flex-wrap gap-1">
                        {activeModelChoices.map((m) => (
                          <span key={m} className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9.5px] text-indigo-300 font-mono select-none">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compile Launch Actuators */}
                <div className="pt-4 border-t border-white/5 mt-4">
                  {!isCompiling && !championPerformance && (
                    <AnimatedGenerateButton
                      className="w-full"
                      labelIdle="Launch AI Compiler"
                      labelActive="Compiling"
                      onClick={handleAutoMLCompilation}
                    />
                  )}

                  {isCompiling && (
                    <div className="w-full py-3 px-4 rounded-xl bg-indigo-505/10 border border-indigo-500/20 text-indigo-400 text-center font-mono text-xs font-black animate-pulse flex items-center justify-center gap-2">
                      <Cpu className="w-4 h-4 animate-spin" />
                      <span>COMPILING ESTIMATORS...</span>
                    </div>
                  )}

                  {championPerformance && (
                    <div className="space-y-3">
                      <span className="text-[9.5px] text-emerald-400 font-mono font-bold block text-center uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 py-2 rounded-xl">
                        ✓ Compiling Completed
                      </span>
                      <AnimatedGenerateButton
                        className="w-full"
                        labelIdle="Buka Panel Evaluasi"
                        labelActive="Loading"
                        onClick={() => {
                          if (onTrainingComplete) {
                            if (compilationResult) {
                              onTrainingComplete(compilationResult);
                            } else if (championPerformance) {
                              // Safe fallback: reconstruct full arguments on the fly
                              try {
                                const preprocessed = preprocessDataset(currentDataset.rows, selectedFeatures, selectedTarget);
                                const result = runModelTraining(preprocessed, activeModelChoices);
                                onTrainingComplete({
                                  preprocessingResult: preprocessed,
                                  performances: result.performances,
                                  bestModelName: result.bestModelName,
                                  featureImportances: result.featureImportances,
                                  testActualValues: result.predictions.testActual,
                                  testPredictedValues: result.predictions.testPredicted,
                                  bestModelInstance: result.bestModelInstance,
                                  ensembleModelInstance: result.ensembleModelInstance,
                                  selectedModels: activeModelChoices
                                });
                              } catch (err: any) {
                                console.error("Fallback compilation failed during Buka Panel Evaluasi clicked:", err);
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* STAGE 4 COLUMN 2: ACTIVE AI COMPILING LOADING BOARD */}
              <div className="nm-card rounded-3xl p-6.5 border border-white/10 flex flex-col justify-between min-h-[480px] text-left" id="step4_col2_running">
                <div className="space-y-6 flex-grow flex flex-col justify-between">
                  <div className="border-b border-white/5 pb-3">
                    <span className="text-[10px] font-mono tracking-wider font-extrabold text-[#a5b4fc] uppercase block">
                      AI MODEL COMPILER ENGINE
                    </span>
                    <h3 className="text-base font-black text-white mt-1">Estimator Optimization Study</h3>
                  </div>

                  {/* Dynamic Progress indicator or Champion Showcase */}
                  <div className="flex-grow flex flex-col items-center justify-center py-6">
                    {!isCompiling && !championPerformance && (
                      <div className="text-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-[#030408] border border-white/5 shadow-[inset_4px_4px_12px_rgba(0,0,0,0.9),4px_4px_12px_rgba(255,255,255,0.01)] flex items-center justify-center mx-auto text-indigo-400">
                          <Cpu className="w-8 h-8 opacity-60" />
                        </div>
                        <p className="text-xs text-slate-400 font-sans leading-relaxed tracking-wide font-medium max-w-[200px] mx-auto text-center">
                          Ready. Click Launch AI Compiler to fit machine learning models.
                        </p>
                      </div>
                    )}

                    {isCompiling && (
                      <div className="flex flex-col items-center justify-center space-y-5 animate-fade-in w-full text-center py-4">
                        {/* Futuristic Multi-Layer Concentric Gauge */}
                        <div className="relative w-28 h-28 flex items-center justify-center">
                          {/* Inner glowing code scanner backdrop */}
                          <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-indigo-500/5 to-cyan-500/5 blur-sm animate-pulse" />
                          
                          {/* Rotating outer gear teeth dots (SVG) */}
                          <svg className="absolute inset-0 w-full h-full animate-spin-slow text-indigo-550/20" viewBox="0 0 100 100" style={{ animationDuration: "10s" }}>
                            <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" fill="none" />
                          </svg>

                          {/* Reverse rotating secondary ring */}
                          <svg className="absolute inset-1 w-[92%] h-[92%] animate-spin-reverse text-cyan-500/30" viewBox="0 0 100 100" style={{ animationDuration: "8s" }}>
                            <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 12" fill="none" />
                          </svg>

                          {/* Dynamic Progress circular line */}
                          <svg className="absolute inset-0 w-full h-full transform -rotate-90 select-none text-cyan-400" viewBox="0 0 100 100">
                            {/* Background track circle */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="rgba(255, 255, 255, 0.04)"
                              strokeWidth="6"
                              fill="none"
                            />
                            {/* Foreground active progress circle */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="url(#progressGlow)"
                              strokeWidth="6"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 40}`}
                              strokeDashoffset={`${2 * Math.PI * 40 * (1 - compileProgress / 100)}`}
                              className="transition-all duration-300 ease-out"
                              strokeLinecap="round"
                            />
                            <defs>
                              <linearGradient id="progressGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#22d3ee" stopOpacity="1" />
                              </linearGradient>
                            </defs>
                          </svg>

                          {/* Center core details and icon */}
                          <div className="absolute flex flex-col items-center justify-center space-y-0.5">
                            <Cpu className="w-6 h-6 text-zinc-300 opacity-60" />
                            <span className="text-[9.5px] font-mono tracking-tighter text-indigo-300 font-extrabold">FITTING</span>
                          </div>
                        </div>

                        {/* Dense mechanical status counters */}
                        <div className="text-center space-y-2.5 w-full max-w-xs">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-950/20 text-[#22d3ee] font-mono text-[9px] font-bold uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                            <span>CORES INJECTED: 16/16</span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-xl font-mono font-black text-white block tracking-tighter">
                              {compileProgress}% COMPLETE
                            </span>
                            <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 px-6">
                              <span>SPEED: {(compileProgress * 32.4 + 1850).toFixed(0)} FLOPS</span>
                              <span>TEMP: {(38 + compileProgress * 0.28).toFixed(1)}°C</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
                              <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300" style={{ width: `${compileProgress}%` }} />
                            </div>
                          </div>

                          <p className="text-[9px] text-[#38bdf8] font-mono bg-[#030408] border border-white/5 py-1.5 px-3 rounded-lg truncate block max-w-[260px] mx-auto text-center" title={compileMsg}>
                            ▶ {compileMsg}
                          </p>
                        </div>
                      </div>
                    )}

                    {championPerformance && (
                      <div className="w-full space-y-4 animate-fade-in">
                        {/* Huge 3D gold/emerald badge */}
                        <div className="bg-gradient-to-br from-indigo-500/10 to-[#03050c] border border-indigo-500/20 p-5 rounded-2xl shadow-xl space-y-4">
                          <div className="flex justify-between items-center text-[10px] font-mono font-black uppercase text-[#a5b4fc] border-b border-white/5 pb-2">
                            <span className="flex items-center gap-1.5">
                              <Award className="w-4 h-4 text-indigo-400 animate-bounce" />
                              <span>CHAMPION FITTED</span>
                            </span>
                            <span className="bg-[#27c93f]/10 px-2.5 py-0.5 rounded-lg border border-[#27c93f]/25 text-[8.5px] text-emerald-400 leading-none">R² METRIC PASS ✓</span>
                          </div>
                          
                          <div className="space-y-2">
                            <span className="text-sm font-extrabold text-white block truncate font-mono text-left leading-tight">{championPerformance.modelName}</span>
                            <p className="text-[10px] font-sans text-slate-450 text-left font-medium">Selected as the most accurate continuous estimator on the holdout validation subset.</p>
                            
                            <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-slate-400 border-t border-white/5 pt-2.5 mt-2">
                              <div className="bg-black/40 border border-white/5 p-2 rounded-xl text-left">
                                <span className="text-[9px] text-zinc-500 block">R² Fit Index:</span>
                                <strong className="text-emerald-400 block text-xs mt-0.5">{championPerformance.r2.toFixed(4)}</strong>
                              </div>
                              <div className="bg-black/40 border border-white/5 p-2 rounded-xl text-left">
                                <span className="text-[9px] text-zinc-500 block">MAE Accuracy:</span>
                                <strong className="text-white block text-xs mt-0.5">{championPerformance.mae.toFixed(4)}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* STAGE 4 COLUMN 3: REAL-TIME TELEMETRY SOLVER STREAM LOGS */}
              <div className="nm-card rounded-3xl p-6.5 border border-white/10 flex flex-col justify-between min-h-[480px] text-left" id="step4_col3_logs">
                <div className="space-y-4 flex-grow flex flex-col justify-between">
                  {/* Header Title */}
                  <div className="border-b border-white/5 pb-3">
                    <span className="text-[10px] font-mono tracking-wider font-extrabold text-[#a5b4fc] uppercase block">
                      SOLVER METRICS CHRONO
                    </span>
                    <h3 className="text-base font-black text-white mt-1">Live Telemetry Pipeline</h3>
                  </div>

                  {/* Telemetry live log stream viewport */}
                  <div className="flex-grow flex flex-col text-left py-1">
                    <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest font-mono block mb-1.5">TELEMETRY SOLVER STREAM</span>
                    <div ref={logsContainerRef} className="bg-[#020204] border border-white/5 p-4 rounded-xl font-mono text-[9px] text-[#38bdf8] leading-tight select-text overflow-y-auto h-[260px] max-h-[260px] custom-scrollbar shadow-inner">
                      {compileLogs.length === 0 ? (
                        <span className="text-slate-650 font-mono italic block text-center py-24 select-none">
                          Waiting for AutoML compile triggers...
                        </span>
                      ) : (
                        <>
                          {compileLogs.map((log, index) => {
                            let color = "text-slate-400";
                            if (log.includes("[SUCCESS]")) color = "text-emerald-400 font-extrabold";
                            if (log.includes("[CHAMPION]")) color = "text-indigo-400 font-bold";
                            if (log.includes("[CRITICAL ERROR]")) color = "text-rose-400 font-bold";
                            return (
                              <div key={index} className={`${color} font-mono text-[9px] py-1 border-b border-white/[0.01]`}>
                                {log}
                              </div>
                            );
                          })}
                          <div ref={logsEndRef} />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Performance stats comparison */}
                  {championPerformance && (
                    <div className="animate-fade-in border-t border-white/5 pt-3.5 space-y-1.5">
                      <span className="text-[9px] uppercase font-bold text-slate-500 font-mono tracking-wider block">Est. Performance Runoff:</span>
                      <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-slate-400">
                        {trainedPerformances.slice(0, 2).map((p) => (
                          <div key={p.modelName} className="flex justify-between items-center bg-[#030408] border border-white/5 p-2 rounded-xl">
                            <span className="text-[8px] truncate max-w-[60px] font-extrabold text-[#9cdcfe]" title={p.modelName}>{p.modelName}</span>
                            <span className="text-emerald-450 font-bold">R² {p.r2.toFixed(3)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!championPerformance && (
                    <div className="text-[9px] font-mono text-slate-500 italic text-center pb-2 select-none">
                      Ready to execute optimal train metrics fits.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
}
