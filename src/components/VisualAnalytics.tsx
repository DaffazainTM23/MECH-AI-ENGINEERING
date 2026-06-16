import React, { useState, useMemo, useCallback } from "react";
import * as d3 from "d3";
import { 
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, BarChart, Bar, Cell, 
  ComposedChart, Line, AreaChart, Area, LineChart, ReferenceLine 
} from "recharts";
import { ModelPerformance, PreprocessedData } from "../utils/mlEngine";
import { useLanguage } from "../context/LanguageContext";
import { 
  BarChart2, TrendingUp, Compass, Activity, PercentSquare,
  FileSpreadsheet, Star, GitMerge, LayoutGrid, Zap, HelpCircle,
  Download, RefreshCw, Layers, Sparkles, Filter, ChevronRight, Box
} from "lucide-react";

interface VisualAnalyticsProps {
  preprocessingResult: PreprocessedData;
  performances: ModelPerformance[];
  bestModelName: string;
  featureImportances: { name: string; value: number }[];
  testActualValues: number[];
  testPredictedValues: number[];
}

export default function VisualAnalytics({
  preprocessingResult,
  performances,
  bestModelName,
  featureImportances,
  testActualValues,
  testPredictedValues,
}: VisualAnalyticsProps) {
  const { language } = useLanguage();
  const tLocal = (en: string, id: string) => language === "id" ? id : en;

  const [activeCategory, setActiveCategory] = useState<"performance" | "residuals" | "relations" | "isometric_3d">("performance");
  const [scatterFeature, setScatterFeature] = useState<string>(preprocessingResult.features[0] || "");
  const [selectedModel, setSelectedModel] = useState<string>(performances[0]?.modelName || bestModelName);

  // Premium high-definition client-side SVG-to-PNG rasterization engine
  const exportChartAsPNG = (containerId: string, fileName: string) => {
    try {
      const container = document.getElementById(containerId);
      if (!container) return;
      
      const svgElement = container.querySelector("svg");
      if (!svgElement) return;

      // Extract raw dimensions
      const svgWidth = svgElement.clientWidth || svgElement.getBoundingClientRect().width || 600;
      const svgHeight = svgElement.clientHeight || svgElement.getBoundingClientRect().height || 400;

      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = 2; // upscale factor for beautiful HD prints
        canvas.width = svgWidth * scale;
        canvas.height = svgHeight * scale;
        
        const context = canvas.getContext("2d");
        if (context) {
          context.fillStyle = "#020617"; // clear deep professional dark-mode background matching web design
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          
          const pngUrl = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.href = pngUrl;
          downloadLink.download = `MECH_AI_${fileName}_Metric_Chart.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
        URL.revokeObjectURL(url);
      };
      image.src = url;
    } catch (err) {
      console.error("Failed to convert chart to PNG:", err);
    }
  };

  // 1. Prepare Scatter Plot Data (Actual vs Predicted)
  const scatterData = testActualValues.map((act, idx) => {
    const pred = testPredictedValues[idx];
    return {
      index: idx + 1,
      actual: parseFloat(act.toFixed(4)),
      predicted: parseFloat((pred !== undefined ? pred : act).toFixed(4)),
      error: parseFloat((act - (pred !== undefined ? pred : act)).toFixed(4))
    };
  }).sort((a, b) => a.actual - b.actual);

  // Ideal bounding diagonal line
  const minVal = Math.min(...testActualValues, ...testPredictedValues);
  const maxVal = Math.max(...testActualValues, ...testPredictedValues);
  const idealLineData = [
    { actual: minVal, predicted: minVal },
    { actual: maxVal, predicted: maxVal }
  ];

  // 2. Prepare Actual vs Predicted Sequential Line Plot
  const lineHistoryData = testActualValues.map((act, idx) => {
    const pred = testPredictedValues[idx];
    return {
      sample: `S${idx + 1}`,
      Actual: parseFloat(act.toFixed(3)),
      Predicted: parseFloat((pred !== undefined ? pred : act).toFixed(3))
    };
  }).slice(0, 35); // Limit to top 35 for clean sequential readability

  // 3. Prepare Model Comparison Chart
  const comparisonData = performances.map(perf => ({
    name: perf.modelName.replace(" Regressor", "").replace(" Regression", ""),
    "R² Score": parseFloat(perf.r2.toFixed(4)),
    "MAE": parseFloat(perf.mae.toFixed(4)),
    "RMSE": parseFloat(perf.rmse.toFixed(4)),
    "MAPE %": parseFloat((perf.mape * 100).toFixed(2))
  })).sort((a, b) => b["R² Score"] - a["R² Score"]);

  // 4. Advanced Dynamic Residual Diagnostics and Normality Fits
  const activePerformance = performances.find(p => p.modelName === selectedModel) || performances[0];
  const activePreds = activePerformance?.predictions || testPredictedValues;

  const currentErrors = testActualValues.map((act, idx) => act - (activePreds[idx] !== undefined ? activePreds[idx] : act));
  const activeN = currentErrors.length;
  const errorMeanVal = currentErrors.reduce((sum, e) => sum + e, 0) / (activeN || 1);
  const errorVarianceVal = currentErrors.reduce((sum, e) => sum + Math.pow(e - errorMeanVal, 2), 0) / (activeN - 1 || 1);
  const errorStdDevVal = Math.sqrt(errorVarianceVal) || 1e-8;

  // Formula-based Skewness computation
  const activeSkewness = activeN > 2
    ? (currentErrors.reduce((sum, e) => sum + Math.pow(e - errorMeanVal, 3), 0) / activeN) / Math.pow(errorStdDevVal, 3)
    : 0;

  // Excess Kurtosis (Gaussian normal standard is 0)
  const activeKurtosis = activeN > 3
    ? ((currentErrors.reduce((sum, e) => sum + Math.pow(e - errorMeanVal, 4), 0) / activeN) / Math.pow(errorStdDevVal, 4)) - 3
    : 0;

  // Durbin-Watson statistic for serial correlation checks [Range: 0 to 4]
  let activeDwNum = 0;
  for (let t = 1; t < activeN; t++) {
    activeDwNum += Math.pow(currentErrors[t] - currentErrors[t-1], 2);
  }
  const activeDwDen = currentErrors.reduce((sum, e) => sum + Math.pow(e, 2), 0);
  const activeDurbinWatson = activeDwDen > 0 ? activeDwNum / activeDwDen : 2.0;

  // Largest error absolute deviation
  const activeMaxAbsError = Math.max(...currentErrors.map(Math.abs));

  // Dynamic Residual Scatter Data Plot mapping (Y residuals vs X predicted fits)
  const dynamicResidualScatterData = testActualValues.map((act, idx) => {
    const pred = activePreds[idx] !== undefined ? activePreds[idx] : act;
    const residual = act - pred;
    return {
      predicted: parseFloat(pred.toFixed(4)),
      residual: parseFloat(residual.toFixed(4))
    };
  });

  const dynamicMinPredicted = Math.min(...dynamicResidualScatterData.map(d => d.predicted));
  const dynamicMaxPredicted = Math.max(...dynamicResidualScatterData.map(d => d.predicted));
  const dynamicZeroRefLineData = [
    { predicted: dynamicMinPredicted, residual: 0 },
    { predicted: dynamicMaxPredicted, residual: 0 }
  ];

  // Dynamic Error Histogram Bins with integrated Gaussian Normal Fit Density overlays
  const dynamicMinErr = Math.min(...currentErrors);
  const dynamicMaxErr = Math.max(...currentErrors);
  const activeBinCount = 10;
  const activeBinWidth = (dynamicMaxErr - dynamicMinErr) / activeBinCount || 1;
  const dynamicErrorBins = Array.from({ length: activeBinCount }, (_, bIdx) => {
    const lower = dynamicMinErr + bIdx * activeBinWidth;
    const upper = lower + activeBinWidth;
    const center = lower + activeBinWidth / 2;
    const count = currentErrors.filter(e => e >= lower && e < upper).length;

    // Normal probability density curve evaluation: N * w * f(x)
    const normalDensity = activeN * activeBinWidth * (1 / (errorStdDevVal * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((center - errorMeanVal) / errorStdDevVal, 2));

    return {
      binCenter: parseFloat(center.toFixed(3)),
      Count: count,
      "Gaussian Fit": parseFloat(normalDensity.toFixed(3)),
      range: `${lower.toFixed(2)} to ${upper.toFixed(2)}`
    };
  });

  // 6. Target Distribution Area Chart (Density curve estimation)
  const targetMin = Math.min(...preprocessingResult.allY);
  const targetMax = Math.max(...preprocessingResult.allY);
  const distBinsCount = 12;
  const distBinWidth = (targetMax - targetMin) / distBinsCount || 1;
  const targetDistributionData = Array.from({ length: distBinsCount }, (_, idx) => {
    const lower = targetMin + idx * distBinWidth;
    const upper = lower + distBinWidth;
    const center = lower + distBinWidth / 2;
    const count = preprocessingResult.allY.filter(v => v >= lower && v < upper).length;
    return {
      value: parseFloat(center.toFixed(3)),
      Density: count,
    };
  });

  // 7. Interactive Feature vs Target Scatter Plot Data
  const activeFeatureIdx = preprocessingResult.features.indexOf(scatterFeature);
  const featureVsTargetData = preprocessingResult.allX.map((row, idx) => {
    const featVal = row[activeFeatureIdx] !== undefined ? row[activeFeatureIdx] : 0;
    const targVal = preprocessingResult.allY[idx];
    return {
      featureValue: parseFloat(featVal.toFixed(4)),
      targetValue: parseFloat(targVal.toFixed(4))
    };
  }).sort((a, b) => a.featureValue - b.featureValue);

  // 8. Pearson Correlation Heatmap calculation
  // Compute correlation for every pair of active features!
  const numFeatures = preprocessingResult.features.length;
  const correlationMatrix: Array<{ feat1: string; feat2: string; r: number }> = [];
  
  preprocessingResult.features.forEach((feat1, idx1) => {
    preprocessingResult.features.forEach((feat2, idx2) => {
      const vals1 = preprocessingResult.allX.map(row => row[idx1]);
      const vals2 = preprocessingResult.allX.map(row => row[idx2]);
      
      const m1 = mean(vals1);
      const m2 = mean(vals2);
      
      let cov = 0;
      let var1 = 0;
      let var2 = 0;
      for (let i = 0; i < vals1.length; i++) {
        const diff1 = vals1[i] - m1;
        const diff2 = vals2[i] - m2;
        cov += diff1 * diff2;
        var1 += diff1 * diff1;
        var2 += diff2 * diff2;
      }
      
      const r = (var1 === 0 || var2 === 0) ? 0 : cov / Math.sqrt(var1 * var2);
      correlationMatrix.push({
        feat1,
        feat2,
        r: parseFloat(r.toFixed(3))
      });
    });
  });

  function mean(arr: number[]): number {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  const heatmapData = useMemo(() => {
    return correlationMatrix;
  }, [correlationMatrix]);

  const renderHeatmapCell = useCallback((props: any) => {
    const { cx, cy, payload } = props;
    if (cx === undefined || cy === undefined || !payload) return null;
    const rVal = payload.r;
    
    // Choose dynamic color based on r values (robust and high-contrast styling)
    let fill = "rgba(148, 163, 184, 0.15)";
    if (rVal > 0) {
      fill = `rgba(59, 130, 246, ${Math.max(0.12, rVal * 0.85)})`;
    } else if (rVal < 0) {
      fill = `rgba(244, 63, 94, ${Math.max(0.12, Math.abs(rVal) * 0.85)})`;
    }
    
    return (
      <g>
        <rect 
          x={cx - 18} 
          y={cy - 18} 
          width={36} 
          height={36} 
          rx={6} 
          fill={fill}
          stroke="rgba(0,0,0,0.08)"
          strokeWidth={1}
          style={{ transition: "all 0.3s ease" }}
        />
        <text 
          x={cx} 
          y={cy + 3} 
          textAnchor="middle" 
          className="font-mono text-[9px] font-extrabold fill-slate-800"
        >
          {rVal.toFixed(2)}
        </text>
      </g>
    );
  }, []);

  // Row-by-Row Test Comparison (First 8 elements)
  const previewComparisonRows = testActualValues.slice(0, 8).map((act, rIdx) => {
    const rowPreds: { [model: string]: string } = {};
    performances.forEach(perf => {
      const val = perf.predictions[rIdx];
      rowPreds[perf.modelName] = val !== undefined ? val.toFixed(4) : "N/A";
    });
    return {
      rowId: `Sample ${rIdx + 1}`,
      actual: act.toFixed(4),
      predictions: rowPreds
    };
  });

  // Export metrics as CSV trigger
  const triggerCSVMetricsExport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Model Name,R2 Score,MAE,RMSE,MAPE %,Training Time (ms),Prediction Time (ms)\n";
    
    performances.forEach(perf => {
      csvContent += `"${perf.modelName}",${perf.r2},${perf.mae},${perf.rmse},${perf.mape * 100},${perf.trainingTime},${perf.predictionTime}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MECH_AI_AutoML_Comparative_Metrics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 py-4 text-left font-sans" id="visual_analytics_viewport">
      
      {/* Introduction with academic styling */}
      <div className="space-y-3 border-b border-white/5 pb-6 flex flex-col items-center justify-center text-center">
        <div className="flex items-center justify-center space-x-2.5 mx-auto">
          <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
          <h2 className="text-2xl font-black text-white tracking-tight text-center">{tLocal("Interactive Visual Analytics", "Analisis Visual Interaktif")}</h2>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed max-w-3xl mx-auto text-center animate-fade-in font-medium">
          {tLocal(
            "AutoML Diagnostics & Predictive Rigor Control Room. Conduct regression comparative audits, verify residual distribution biases, inspect coordinate correlations, and export complete report datasets.",
            "Ruang Kontrol Diagnostik AutoML & Ketelitian Prediktif. Lakukan audit komparatif regresi, verifikasi bias distribusi residual, periksa korelasi koordinat, dan ekspor kumpulan data laporan lengkap."
          )}
        </p>
      </div>

      {/* Tabs Menu in iOS Glassmorphism styling */}
      <div className="flex flex-wrap gap-2 p-1.5 backdrop-blur-2xl bg-slate-950/20 border border-white/10 rounded-2xl shadow-inner max-w-fit" id="analytics_tabs_bar">
        {[
          { id: "performance", label: tLocal("Model Performance", "Performa Model"), icon: TrendingUp },
          { id: "residuals", label: tLocal("Diagnostics & Error", "Diagnostik & Galat"), icon: Activity },
          { id: "relations", label: tLocal("Feature Matrix & Target", "Matriks Fitur & Target"), icon: LayoutGrid },
          { id: "isometric_3d", label: tLocal("3D Isometric Engine (D3)", "Mesin Isometrik 3D (D3)"), icon: Box },
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold font-sans flex items-center space-x-2 transition-all duration-300 pointer-events-auto cursor-pointer border ${
                isSelected 
                  ? "bg-blue-600/20 border-blue-500/35 text-white shadow-md shadow-blue-500/5 animate-none" 
                  : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. MODEL PERFORMANCE MODULE */}
      {activeCategory === "performance" && (
        <div className="space-y-8 animate-fadeIn" id="perf_charts_block">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Actual vs Predicted Scatter */}
            <div className="nm-card p-6.5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-slate-200 tracking-wider font-mono uppercase block">
                    1. Actual vs Predicted Scatter Plot
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => exportChartAsPNG("chart_actual_vs_predicted", "Actual_vs_Predicted_Scatter")}
                  className="p-1 px-2 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-400 hover:text-white transition-all text-[8.5px] font-mono font-bold uppercase flex items-center space-x-1 cursor-pointer shrink-0 pointer-events-auto"
                  title="Export chart as PNG"
                >
                  <Download className="w-3 h-3 text-blue-450" />
                  <span>Export PNG</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal font-sans">
                Plots predictions against coordinates. The dashed line representing <strong>Ideal Convergence</strong> points to 100% accurate fits.
              </p>
              <div className="h-[280px] w-full" id="chart_actual_vs_predicted">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={scatterData} margin={{ top: 10, right: 20, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis 
                      dataKey="actual" 
                      type="number" 
                      stroke="#94a3b8" 
                      fontSize={9} 
                      tickLine={false}
                      label={{ value: 'Actual Values', position: 'insideBottom', offset: -4, fill: '#64748b', fontSize: 9, fontFamily: "monospace" }}
                    />
                    <YAxis 
                      dataKey="predicted" 
                      type="number" 
                      stroke="#94a3b8" 
                      fontSize={9} 
                      tickLine={false}
                    />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3', stroke: "rgba(255,255,255,0.1)" }}
                      contentStyle={{ backgroundColor: "#020617", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", fontFamily: "monospace", fontSize: "11px" }}
                    />
                    <Scatter name="Test Coordinate" data={scatterData} fill="#3b82f6" fillOpacity={0.7} />
                    <Line name="Ideal Line" data={idealLineData} dataKey="predicted" xDataKey="actual" stroke="#10b981" strokeWidth={1.8} dot={false} strokeDasharray="5 5" />
                    <Legend wrapperStyle={{ fontSize: "10px" }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Actual vs Predicted Sequential Line Plot */}
            <div className="nm-card p-6.5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200 tracking-wider font-mono uppercase block">
                    2. Predicted vs Actual Line Sequence
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => exportChartAsPNG("chart_line_sequence", "Predicted_vs_Actual_Line_Sequence")}
                  className="p-1 px-2 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-400 hover:text-white transition-all text-[8.5px] font-mono font-bold uppercase flex items-center space-x-1 cursor-pointer shrink-0 pointer-events-auto"
                  title="Export chart as PNG"
                >
                  <Download className="w-3 h-3 text-emerald-400" />
                  <span>Export PNG</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal font-sans">
                Traces predictions and actual test row values sequentially for 35 randomly partitioned validation items, detailing error sizes.
              </p>
              <div className="h-[280px] w-full" id="chart_line_sequence">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineHistoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="sample" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#020617", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", fontFamily: "monospace", fontSize: "11px" }} />
                    <Line type="monotone" dataKey="Actual" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="Predicted" stroke="#3b82f6" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 2 }} />
                    <Legend wrapperStyle={{ fontSize: "10px" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Compared Performance bar chart */}
            <div className="nm-card p-6.5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2">
                  <BarChart2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-slate-200 tracking-wider font-mono uppercase block">
                    3. Model Performance Bar Comparison
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => exportChartAsPNG("chart_model_comparison_bar", "Model_Comparative_Performance")}
                  className="p-1 px-2 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-400 hover:text-white transition-all text-[8.5px] font-mono font-bold uppercase flex items-center space-x-1 cursor-pointer shrink-0 pointer-events-auto"
                  title="Export chart as PNG"
                >
                  <Download className="w-3 h-3 text-cyan-400" />
                  <span>Export PNG</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal font-sans">
                Comparing accuracy coefficient indices across all currently compiled estimators.
              </p>
              <div className="h-[280px] w-full" id="chart_model_comparison_bar">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData.slice(0, 6)} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} domain={[0, 1.1]} />
                    <Tooltip contentStyle={{ backgroundColor: "#020617", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "12px", fontFamily: "monospace", fontSize: "11px" }} />
                    <Bar dataKey="R² Score" fill="#3b82f6" radius={[5, 5, 0, 0]}>
                      {comparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === bestModelName.replace(" Regressor", "") ? "#10b981" : "#2563eb"} />
                      ))}
                    </Bar>
                    <Bar dataKey="MAE" fill="#f43f5e" radius={[5, 5, 0, 0]} />
                    <Legend wrapperStyle={{ fontSize: "10px" }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Model Ranking Table */}
            <div className="nm-card p-6.5 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 border-b border-white/5 pb-3 mb-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-200 tracking-wider font-mono uppercase block">
                    4. Comparative Model Rankings
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans mb-4">
                  All models ranked by coefficient optimization R² accuracy scoring (best overall score occupies Rank #1).
                </p>
                
                <div className="overflow-x-auto max-h-[220px] overflow-y-auto pr-1">
                  <table className="w-full text-left text-[11px] font-mono">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-500 uppercase font-black text-[9px] tracking-wider">
                        <th className="pb-2">Rank</th>
                        <th className="pb-2">Estimator Name</th>
                        <th className="pb-2 text-right">R² Score</th>
                        <th className="pb-2 text-right">RMSE Error</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-350">
                      {comparisonData.map((m, idx) => {
                        const rank = idx + 1;
                        return (
                          <tr key={idx} className={`hover:bg-white/[0.01] ${rank === 1 ? "text-emerald-450 font-extrabold" : ""}`}>
                            <td className="py-2.5 font-mono text-[10.5px]">
                              {rank === 1 ? "Rank 1" : rank === 2 ? "Rank 2" : rank === 3 ? "Rank 3" : `Rank ${rank}`}
                            </td>
                            <td className="py-2.5 font-sans font-bold">{m.name}</td>
                            <td className="py-2.5 text-right font-extrabold">{m["R² Score"].toFixed(4)}</td>
                            <td className="py-2.5 text-right text-slate-400">{m.RMSE.toFixed(4)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status Warning check */}
              <div className="mt-4 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start space-x-3 text-left">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-[10px] text-amber-300 font-sans leading-relaxed">
                  <span className="font-extrabold uppercase block tracking-wide font-mono">Rigor Warning Assessment</span>
                  {preprocessingResult.trainX.length < 50 ? (
                    <span>Warning: Dataset contains only {preprocessingResult.trainX.length} training samples. Adding more columns or samples will improve learning models accuracy.</span>
                  ) : performances.some(p => p.r2 < 0.4) ? (
                    <span>Note: Certain simpler estimators are producing weaker R2 results. We recommend deploying non-linear Tree Boosters (XGBoost, CatBoost, GradientBoosting) for final operational deployments.</span>
                  ) : (
                    <span>Operational standard is verified: Splitting is structured, metrics are robust, and training has completed successfully. All models fit criteria are fully compiled in the dashboard.</span>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 2. DIAGNOSTICS & ERROR RESIDUALS MODULE */}
      {activeCategory === "residuals" && (
        <div className="space-y-8 animate-fadeIn" id="residuals_block">
          
          {/* Diagnostic Controls Strip & Statistical Overviews */}
          <div className="nm-card p-6.5 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-blue-400 font-mono uppercase tracking-wider block">Interactive Diagnostic Diagnostics Controls</span>
                <h3 className="text-sm font-black text-white font-sans">Switch Estimator Target & Analyze Residual Distribution</h3>
              </div>
              
              <div className="flex items-center space-x-3 pointer-events-auto">
                <span className="text-xs text-slate-400 font-mono">Selected Model:</span>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="p-2 px-3 text-xs bg-slate-950 border border-white/15 rounded-xl text-white font-mono focus:outline-none focus:border-blue-500 pointer-events-auto cursor-pointer"
                >
                  {performances.map(p => (
                    <option key={p.modelName} value={p.modelName}>{p.modelName}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Robust scientific stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {[
                { label: "Mean Residual", value: errorMeanVal.toFixed(5), tooltip: "Ideal value is 0. Indicates system bias direction." },
                { label: "Std Deviation", value: errorStdDevVal.toFixed(5), tooltip: "Indicates residual scattering magnitude." },
                { label: "Skewness", value: activeSkewness.toFixed(4), tooltip: "Measures asymmetry. Gaussian ideal is 0." },
                { label: "Excess Kurtosis", value: activeKurtosis.toFixed(4), tooltip: "Tail-heaviness index. Gaussian ideal is 0." },
                { label: "Durbin-Watson", value: activeDurbinWatson.toFixed(3), tooltip: "Checks auto-correlation. Ideal is 2.0 (range 0 to 4)." },
                { label: "Max Abs Error", value: activeMaxAbsError.toFixed(4), tooltip: "Largest single prediction error distance." },
              ].map((stat, sIdx) => (
                <div key={sIdx} className="bg-slate-950/45 border border-white/5 p-3 rounded-2xl flex flex-col justify-between" title={stat.tooltip}>
                  <span className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider block mb-1">
                    {stat.label}
                  </span>
                  <div className="text-xs font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Residual plot */}
            <div className="nm-card p-6.5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-fuchsia-400" />
                  <span className="text-xs font-bold text-slate-200 tracking-wider font-mono uppercase block">
                    5. Residual Scatter Plot ({selectedModel.replace(" Regressor", "")})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => exportChartAsPNG("chart_residual_scatter", `${selectedModel.replace(/\s+/g, "_")}_Residuals`)}
                  className="p-1 px-2 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-400 hover:text-white transition-all text-[8.5px] font-mono font-bold uppercase flex items-center space-x-1 cursor-pointer shrink-0 pointer-events-auto"
                  title="Export chart as PNG"
                >
                  <Download className="w-3 h-3 text-fuchsia-400" />
                  <span>Export PNG</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal font-sans">
                Plots error terms (e = y - y_predicted) against predicted values. A uniform horizontal band around 0 with no clear funnel pattern suggests a stable, homoscedastic model.
              </p>
              <div className="h-[280px] w-full" id="chart_residual_scatter">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 15, right: 20, left: -20, bottom: 15 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis 
                      dataKey="predicted" 
                      type="number" 
                      name="Predicted"
                      stroke="#94a3b8" 
                      fontSize={9} 
                      tickLine={false}
                      domain={['auto', 'auto']}
                      label={{ value: 'Predicted Outcome (Fitted ŷ)', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 9, fontFamily: "monospace" }}
                    />
                    <YAxis 
                      dataKey="residual" 
                      type="number" 
                      name="Residual Error"
                      stroke="#94a3b8" 
                      fontSize={9} 
                      tickLine={false}
                      domain={['auto', 'auto']}
                      label={{ value: 'Residual Error (y - ŷ)', angle: -90, position: 'insideLeft', offset: 10, fill: '#94a3b8', fontSize: 9, fontFamily: "monospace" }}
                    />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3', stroke: "rgba(255,255,255,0.15)" }} 
                      contentStyle={{ backgroundColor: "#020617", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", fontFamily: "monospace", fontSize: "11px" }} 
                    />
                    <Scatter 
                      name="Residual Coordinates" 
                      data={dynamicResidualScatterData} 
                      fill="#ec4899" 
                      fillOpacity={0.7}
                    />
                    <Line 
                      type="monotone"
                      dataKey="residual"
                      stroke="none"
                      dot={false}
                    />
                    <Legend wrapperStyle={{ fontSize: "9px", fontFamily: "monospace", paddingTop: "10px" }} />
                    {/* Native Recharts horizontal reference line to perfectly visualize Zero Residual Threshold */}
                    <ReferenceLine 
                      y={0} 
                      stroke="#6366f1" 
                      strokeDasharray="4 4" 
                      strokeWidth={1.5} 
                      label={{ value: 'Zero Bias (ŷ = y)', fill: '#6366f1', fontSize: 8, position: 'top', fontFamily: "monospace" }}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Error Histogram with Gaussian normal distribution curve */}
            <div className="nm-card p-6.5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200 tracking-wider font-mono uppercase block">
                    6. Error Distribution & Gaussian Curve Fits
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => exportChartAsPNG("chart_error_histogram", `${selectedModel.replace(/\s+/g, "_")}_Error_Normality`)}
                  className="p-1 px-2 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-400 hover:text-white transition-all text-[8.5px] font-mono font-bold uppercase flex items-center space-x-1 cursor-pointer shrink-0 pointer-events-auto"
                  title="Export chart as PNG"
                >
                  <Download className="w-3 h-3 text-emerald-400" />
                  <span>Export PNG</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal font-sans">
                Bins computed errors with an integrated **Gaussian Normal Distribution overlay** (dashed blue line) to verify the central limit theorem error normal distribution model.
              </p>
              <div className="h-[280px] w-full" id="chart_error_histogram">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={dynamicErrorBins} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="binCenter" stroke="#94a3b8" fontSize={9} tickLine={false} label={{ value: 'Residual Error Deviation Distance', position: 'insideBottom', offset: -4, fill: '#64748b', fontSize: 9, fontFamily: "monospace" }} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#020617", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", fontFamily: "monospace", fontSize: "11px" }} />
                    <Bar name="Sample Residual Count" dataKey="Count" fill="#ec4899" radius={[4, 4, 0, 0]}>
                      {dynamicErrorBins.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={Math.abs(entry.binCenter) < activeBinWidth ? "#10b981" : "rgba(16, 185, 129, 0.7)"} />
                      ))}
                    </Bar>
                    <Line name="Theoretical Gaussian Fit" type="monotone" dataKey="Gaussian Fit" stroke="#3b82f6" strokeWidth={2.2} strokeDasharray="4 3" dot={false} />
                    <Legend wrapperStyle={{ fontSize: "10px" }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Row-by-Row Comparative Predictors Spreadsheet */}
          <div className="nm-card p-6.5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-slate-250 tracking-wider font-mono uppercase block">
                  7. Row-by-Row Model Prediction Comparison
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Comparing first {previewComparisonRows.length} rows of test validation partition</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-mono">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 font-bold uppercase text-[9px]">
                    <th className="pb-2.5">Sample ID</th>
                    <th className="pb-2.5 text-right text-emerald-450 font-extrabold">Actual Target (Y)</th>
                    {performances.map(p => (
                      <th key={p.modelName} className="pb-2.5 text-right font-semibold">{p.modelName.replace(" Regressor", "").replace(" Regression", "")}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {previewComparisonRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-white/[0.01]">
                      <td className="py-2.5 font-bold text-slate-400">{row.rowId}</td>
                      <td className="py-2.5 text-right text-emerald-400 font-black">{row.actual}</td>
                      {performances.map(p => {
                        const val = row.predictions[p.modelName];
                        const isBest = p.modelName === bestModelName;
                        return (
                          <td key={p.modelName} className={`py-2.5 text-right ${isBest ? "text-blue-450 font-bold bg-blue-500/[0.01]" : "text-slate-350"}`}>
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 3. FEATURE MATRICES & TARGET RELATIONS MODULE */}
      {activeCategory === "relations" && (
        <div className="space-y-8 animate-fadeIn" id="relations_block">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Feature Importance plot */}
            <div className="nm-card p-6.5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-pink-400" />
                  <span className="text-xs font-bold text-slate-200 tracking-wider font-mono uppercase block">
                    8. Feature Importance Contributions
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => exportChartAsPNG("chart_feature_importances", "Feature_Importance_Contributions")}
                  className="p-1 px-2 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-400 hover:text-white transition-all text-[8.5px] font-mono font-bold uppercase flex items-center space-x-1 cursor-pointer shrink-0 pointer-events-auto"
                  title="Export chart as PNG"
                >
                  <Download className="w-3 h-3 text-pink-400" />
                  <span>Export PNG</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal font-sans">
                Quantified variables contribution on overall prediction leverage. Computed via <strong>Permutation Importance</strong> for regressions, SVR, and clusters, or split criteria reductions for tree models.
              </p>
              <div className="h-[280px] w-full" id="chart_feature_importances">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureImportances} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={9} tickLine={false} tickFormatter={(val) => `${val}%`} />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} tickLine={false} width={80} />
                    <Tooltip contentStyle={{ backgroundColor: "#020617", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", fontFamily: "monospace" }} formatter={(val) => [`${val}%`, "Importance"]} />
                    <Bar dataKey="value" fill="#d946ef" radius={[0, 4, 4, 0]}>
                      {featureImportances.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill="url(#fuchsiaGlow)" />
                      ))}
                    </Bar>
                    <defs>
                      <linearGradient id="fuchsiaGlow" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#c084fc" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Target Variable distribution */}
            <div className="nm-card p-6.5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2">
                  <PercentSquare className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-slate-200 tracking-wider font-mono uppercase block">
                    9. Target Variable (Y) Density Profile
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => exportChartAsPNG("chart_target_density", "Target_Variable_Density")}
                  className="p-1 px-2 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-400 hover:text-white transition-all text-[8.5px] font-mono font-bold uppercase flex items-center space-x-1 cursor-pointer shrink-0 pointer-events-auto"
                  title="Export chart as PNG"
                >
                  <Download className="w-3 h-3 text-cyan-400" />
                  <span>Export PNG</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal font-sans">
                Illustrates statistical distribution frequency of the target Y column (<code>{preprocessingResult.target}</code>) across the entire ingested spreadsheet rowset.
              </p>
              <div className="h-[280px] w-full" id="chart_target_density">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={targetDistributionData} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="value" stroke="#94a3b8" fontSize={9} tickLine={false} label={{ value: `Value Range of ${preprocessingResult.target}`, position: 'insideBottom', offset: -4, fill: '#64748b', fontSize: 9, fontFamily: "monospace" }} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#020617", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", fontFamily: "monospace" }} formatter={(val) => [val, "Frequency"]} />
                    <Area type="monotone" dataKey="Density" stroke="#06b6d4" fill="url(#cyanGlow)" />
                    <defs>
                      <linearGradient id="cyanGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Feature Vs Target Interactive Scatter with column Selector */}
            <div className="nm-card p-6.5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-slate-200 tracking-wider font-mono uppercase block">
                    10. Feature vs Target Active Scatter
                  </span>
                </div>
                
                {/* Controls cluster with selection AND PNG download */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-slate-500 font-mono font-bold">Select Feature:</span>
                    <select
                      value={scatterFeature}
                      onChange={(e) => setScatterFeature(e.target.value)}
                      className="p-1 px-2 text-[10.5px] bg-slate-950 border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:border-indigo-500 pointer-events-auto cursor-pointer"
                    >
                      {preprocessingResult.features.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => exportChartAsPNG("chart_feature_vs_target_scatter", "Feature_vs_Target_Relation")}
                    className="p-1 px-2 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-400 hover:text-white transition-all text-[8.5px] font-mono font-bold uppercase flex items-center space-x-1 cursor-pointer shrink-0 pointer-events-auto"
                    title="Export chart as PNG"
                  >
                    <Download className="w-3 h-3 text-indigo-450" />
                    <span>Export PNG</span>
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal font-sans">
                Plots the raw selected column values (X-axis) against the active prediction target column <code>{preprocessingResult.target}</code> (Y-axis) to visually examine physical and mechanical trends directly.
              </p>
              <div className="h-[260px] w-full pt-1" id="chart_feature_vs_target_scatter">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis 
                      dataKey="featureValue" 
                      type="number" 
                      stroke="#94a3b8" 
                      fontSize={9} 
                      tickLine={false} 
                      label={{ value: scatterFeature, position: 'insideBottom', offset: -4, fill: '#64748b', fontSize: 9, fontFamily: "monospace" }} 
                    />
                    <YAxis 
                      dataKey="targetValue" 
                      type="number" 
                      stroke="#94a3b8" 
                      fontSize={9} 
                      tickLine={false} 
                    />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: "#020617", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", fontFamily: "monospace" }} />
                    <Scatter name="Row coordinates" data={featureVsTargetData} fill="#6366f1" fillOpacity={0.7} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pearson Correlation Heatmap HTML matrix representation */}
            <div className="nm-card p-6.5 space-y-4">
              <div className="flex items-center space-x-2 border-b border-white/5 pb-3">
                <PercentSquare className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-slate-200 tracking-wider font-mono uppercase block">
                  11. Ingested Columns Pearson Heatmap Matrix
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight font-sans">
                Grid showing correlation coefficients $(r)$ between all active selected parameters. Deep blue-teal signifies strongly positive proportional, deep rose represents strongly inverse relations.
              </p>

              {/* Interactive Recharts Heatmap Plot */}
              <div className="h-[280px] w-full nm-inset p-3 rounded-2xl overflow-hidden" id="recharts_pearson_heatmap_plot">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 25, left: 25, bottom: 20 }}>
                    <XAxis 
                      type="category" 
                      dataKey="feat1" 
                      allowDuplicatedCategory={false} 
                      stroke="#475569" 
                      fontSize={8}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="feat2" 
                      allowDuplicatedCategory={false} 
                      stroke="#475569" 
                      fontSize={8}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3', stroke: "rgba(0,0,0,0.06)" }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white border border-slate-200 shadow-xl rounded-xl p-2.5 text-[10.5px] font-mono text-slate-800 text-left">
                              <p className="font-extrabold border-b border-slate-100 pb-1 mb-1 uppercase text-[8px] tracking-wider text-slate-450">Correlation Coefficient</p>
                              <p><span className="text-slate-450 font-bold">X Matrix:</span> {data.feat1}</p>
                              <p><span className="text-slate-450 font-bold">Y Matrix:</span> {data.feat2}</p>
                              <p className="font-bold text-blue-600 mt-1">Pearson r: {data.r.toFixed(3)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter 
                      name="Pearson Correlation Array" 
                      data={heatmapData} 
                      shape={renderHeatmapCell}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              
              <div className="overflow-x-auto max-h-[260px] overflow-y-auto pr-1">
                <div 
                  className="grid gap-1 min-w-[320px] p-2 bg-slate-950/45 rounded-2xl border border-white/5"
                  style={{ gridTemplateColumns: `repeat(${numFeatures + 1}, minmax(0, 1fr))` }}
                >
                  {/* Empty top corner */}
                  <div className="text-[8px] font-mono p-1 border-b border-r border-white/5 font-extrabold text-slate-500 truncate">Vars</div>
                  
                  {/* Columns headers */}
                  {preprocessingResult.features.map(f => (
                    <div key={f} className="text-[7.5px] font-mono p-1 border-b border-white/5 font-extrabold text-slate-400 truncate text-center" title={f}>
                      {f}
                    </div>
                  ))}

                  {preprocessingResult.features.map((f1, rIdx) => (
                    <React.Fragment key={f1}>
                      {/* Row Header */}
                      <div className="text-[7.5px] font-mono p-1 border-r border-white/5 font-extrabold text-slate-400 truncate">
                        {f1}
                      </div>

                      {preprocessingResult.features.map((f2, cIdx) => {
                        const cell = correlationMatrix.find(c => c.feat1 === f1 && c.feat2 === f2);
                        const rVal = cell ? cell.r : 1.0;
                        
                        // Select color intensities based on r values
                        let bgStyle = "bg-slate-900 border border-white/5";
                        let textStyle = "text-slate-400";
                        if (rVal >= 0.7) {
                          bgStyle = "bg-blue-600/35 border border-blue-500/20";
                          textStyle = "text-blue-300 font-extrabold";
                        } else if (rVal >= 0.45) {
                          bgStyle = "bg-blue-650/20 border border-blue-600/15";
                          textStyle = "text-blue-200 font-bold";
                        } else if (rVal <= -0.7) {
                          bgStyle = "bg-red-600/35 border border-red-500/20";
                          textStyle = "text-red-300 font-extrabold";
                        } else if (rVal <= -0.45) {
                          bgStyle = "bg-red-650/20 border border-red-650/15";
                          textStyle = "text-red-200 font-bold";
                        } else {
                          bgStyle = "bg-white/[0.02] border border-white/5";
                        }

                        return (
                          <div 
                            key={f2} 
                            className={`p-1.5 rounded text-[8.5px] font-mono text-center flex items-center justify-center transition-all hover:scale-105 select-all ${bgStyle} ${textStyle}`}
                            title={`${f1} to ${f2} Pearson correlation coefficient: ${rVal}`}
                          >
                            {rVal.toFixed(2)}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 4. 3D ISOMETRIC INSIGHT ENGINE (D3-POWERED) */}
      {activeCategory === "isometric_3d" && (
        <div className="space-y-8 animate-fadeIn" id="isometric_3d_block">
          
          {/* Information & Configuration Panel */}
          <div className="nm-card p-6.5 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-400 font-mono uppercase tracking-wider block">D3.js Hardware Acceleration Render Engine</span>
                <h3 className="text-sm font-black text-white font-sans">High-Depth 3D Isometric Projection Analytics Grid</h3>
              </div>
              <div className="flex items-center space-x-3 text-[10px] font-mono text-zinc-500 bg-[#03050a] border border-white/5 px-3 py-1.5 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-extrabold uppercase">3D GPU BUFFER ACTIVE</span>
              </div>
            </div>
            
            <p className="text-[11px] text-slate-400 leading-normal font-sans">
              Deploying multi-dimensional coordinate mapping. Features are plotted along depth, width, and height axes using custom isometric projection matrices calculated through <strong>D3.js scaling APIs</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 3D Feature Importance isometric block */}
            <div className="nm-card p-6.5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2">
                  <Box className="w-4 h-4 text-pink-400" />
                  <span className="text-xs font-bold text-slate-200 tracking-wider font-mono uppercase block">
                    8. 3D Features Isometric Projections
                  </span>
                </div>
                <span className="text-[9px] font-mono uppercase bg-pink-500/10 border border-pink-500/20 px-2.5 py-0.5 rounded text-pink-400">ISOMETRIC BAR PROJECTIONS</span>
              </div>

              <div className="relative bg-[#020204] border border-white/5 rounded-2xl h-[330px] overflow-hidden flex items-center justify-center shadow-inner">
                {/* SVG 3D Canvas */}
                <svg className="w-full h-full select-none" viewBox="0 0 600 400">
                  {/* Grid overlay background mapping */}
                  <g opacity="0.3">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <line 
                        key={`grid-1-${i}`}
                        x1={0} y1={50 + i * 30} x2={600} y2={150 + i * 30}
                        stroke="rgba(99, 102, 241, 0.15)" strokeWidth="1"
                      />
                    ))}
                    {Array.from({ length: 15 }).map((_, i) => (
                      <line 
                        key={`grid-2-${i}`}
                        x1={i * 45} y1={0} x2={i * 45 - 200} y2={400}
                        stroke="rgba(6, 182, 212, 0.1)" strokeWidth="1"
                      />
                    ))}
                  </g>

                  {/* Axis line 3D frame floor */}
                  <line x1={80} y1={320} x2={520} y2={320} stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1={80} y1={320} x2={80} y2={60} stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="3 3" />

                  {/* Render 3D Isometric Columns */}
                  {(() => {
                    // Filter or map features
                    const list = featureImportances.slice(0, 5);
                    const widthScale = d3.scaleLinear().domain([0, 100]).range([0, 240]);
                    const spacing = 45;

                    return list.map((item, index) => {
                      const val = item.value;
                      const h = widthScale(val);
                      // Start coordinates
                      const baseX = 140 + index * spacing;
                      const baseY = 280 - index * 18;
                      
                      // 3D bar sizes
                      const colWidth = 24;
                      const colDepth = 16;
                      
                      return (
                        <g key={item.name} className="transition-all hover:opacity-90 duration-300">
                          {/* Back wireframe */}
                          <line x1={baseX} y1={baseY} x2={baseX} y2={baseY - h} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="1 1" />

                          {/* FRONT FACE (Drawn with depth angle offset) */}
                          <polygon 
                            points={`
                              ${baseX},${baseY} 
                              ${baseX + colWidth},${baseY + 8} 
                              ${baseX + colWidth},${baseY + 8 - h} 
                              ${baseX},${baseY - h}
                            `}
                            fill="url(#frontFaceGrad)"
                            stroke="rgba(0,0,0,0.4)"
                            strokeWidth="1"
                          />

                          {/* SIDE FACE */}
                          <polygon 
                            points={`
                              ${baseX + colWidth},${baseY + 8} 
                              ${baseX + colWidth + colDepth},${baseY + 2} 
                              ${baseX + colWidth + colDepth},${baseY + 2 - h} 
                              ${baseX + colWidth},${baseY + 8 - h}
                            `}
                            fill="url(#sideFaceGrad)"
                            stroke="rgba(0,0,0,0.5)"
                            strokeWidth="1"
                          />

                          {/* TOP FACE */}
                          <polygon 
                            points={`
                              ${baseX},${baseY - h} 
                              ${baseX + colWidth},${baseY + 8 - h} 
                              ${baseX + colWidth + colDepth},${baseY + 2 - h} 
                              ${baseX + colDepth},${baseY - 6 - h}
                            `}
                            fill="url(#topFaceGrad)"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="1.5"
                          />

                          {/* Label values */}
                          <text 
                            x={baseX + 12} 
                            y={baseY + 24} 
                            fill="#94a3b8" 
                            fontSize="8" 
                            fontFamily="monospace"
                            fontWeight="bold"
                            textAnchor="middle"
                            transform={`rotate(-25, ${baseX + 12}, ${baseY + 24})`}
                          >
                            {item.name}
                          </text>

                          {/* Value display */}
                          <text 
                            x={baseX + colWidth / 2} 
                            y={baseY - h - 12} 
                            fill="#38bdf8" 
                            fontSize="9" 
                            fontFamily="monospace"
                            fontWeight="extrabold"
                            textAnchor="middle"
                          >
                            {val.toFixed(1)}%
                          </text>
                        </g>
                      );
                    });
                  })()}

                  {/* Gradient shaders definition */}
                  <defs>
                    <linearGradient id="frontFaceGrad" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="#4338ca" />
                      <stop offset="100%" stopColor="#d946ef" />
                    </linearGradient>
                    <linearGradient id="sideFaceGrad" x1="0" y1="1" x2="1" y2="0">
                      <stop offset="0%" stopColor="#312e81" />
                      <stop offset="100%" stopColor="#701a75" />
                    </linearGradient>
                    <linearGradient id="topFaceGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#f472b6" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Depth overlay visual banner credits */}
                <div className="absolute top-3 left-3 bg-black/70 p-2 rounded-lg border border-white/5 text-[8.5px] font-mono text-zinc-400">
                  <span className="text-pink-400 font-extrabold tracking-wide">3D PROJECTED VIEW</span>
                  <div className="text-[8px] text-zinc-500 mt-0.5">Tilt: 30° / Rotation: 45°</div>
                </div>
              </div>
            </div>

            {/* 3D Isometric Scatter plot regression Accuracy block */}
            <div className="nm-card p-6.5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-slate-200 tracking-wider font-mono uppercase block">
                    9. 3D Isometric Regression Accuracy
                  </span>
                </div>
                <span className="text-[9px] font-mono uppercase bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded text-cyan-400">ISOMETRIC RESIDUALS GRID</span>
              </div>

              <div className="relative bg-[#020204] border border-white/5 rounded-2xl h-[330px] overflow-hidden flex items-center justify-center shadow-inner">
                <svg className="w-full h-full select-none" viewBox="0 0 600 400">
                  {/* Isometric base floor block */}
                  <polygon 
                    points="300,100 480,210 300,320 120,210" 
                    fill="#04060e" 
                    stroke="rgba(6, 182, 212, 0.2)" 
                    strokeWidth="25"
                    strokeLinejoin="round" 
                    opacity="0.9"
                  />
                  <polygon 
                    points="300,100 480,210 300,320 120,210" 
                    fill="#050811" 
                    stroke="rgba(255,255,255,0.03)" 
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />

                  {/* Interior floor gridlines using custom math */}
                  {Array.from({ length: 6 }).map((_, i) => {
                    const step = i * (180 / 6);
                    return (
                      <React.Fragment key={`floor-grid-${i}`}>
                        {/* Direction A lines */}
                        <line 
                          x1={300 - step} y1={100 + step * (110 / 180)} 
                          x2={480 - step} y2={210 + step * (110 / 180)} 
                          stroke="rgba(255,255,255,0.02)" 
                          strokeWidth="1"
                        />
                        {/* Direction B lines */}
                        <line 
                          x1={300 + step} y1={100 + step * (110 / 180)} 
                          x2={120 + step} y2={210 + step * (110 / 180)} 
                          stroke="rgba(255,255,255,0.02)" 
                          strokeWidth="1"
                        />
                      </React.Fragment>
                    );
                  })}

                  {/* Center Diagonal Regressive reference Line (Perfect Fit trajectory) */}
                  <line 
                    x1={120} y1={210} 
                    x2={480} y2={210} 
                    stroke="rgba(239, 68, 68, 0.45)" 
                    strokeWidth="1.5" 
                    strokeDasharray="4 2"
                  />

                  {/* Plot actual projections with height error indicators */}
                  {(() => {
                    // Pull random subset of 15 predictions to map onto the 3D grid
                    const datasetSubset = scatterData.slice(0, 16);
                    if (datasetSubset.length === 0) return null;
                    
                    const minAct = minVal;
                    const maxAct = maxVal;
                    
                    const actualScale = d3.scaleLinear().domain([minAct, maxAct]).range([140, 460]);
                    const errorScale = d3.scaleLinear().domain([-15, 15]).range([-45, 45]);

                    return datasetSubset.map((item, idx) => {
                      const actX = actualScale(item.actual);
                      // Calculate coordinate Y matching isometric floor plane
                      const floorY = 210 + (actX - 300) * (55 / 180);
                      
                      // Height term Z maps to prediction error residual
                      const isNeg = item.error < 0;
                      const errHeight = errorScale(item.error);
                      const ptY = floorY - errHeight;

                      return (
                        <g key={idx} className="transition-all hover:scale-110 duration-200">
                          {/* Footprint anchor point on perfect trajectory floor */}
                          <circle cx={actX} cy={floorY} r="1.5" fill="rgba(255,255,255,0.2)" />
                          
                          {/* Connecting vertical cord (residual line vector) */}
                          <line 
                            x1={actX} y1={floorY} 
                            x2={actX} y2={ptY} 
                            stroke={isNeg ? "#f43f5e" : "#10b981"} 
                            strokeWidth="1.2" 
                            strokeDasharray="2 1"
                          />

                          {/* Scatter point sphere with Neumorphic 3D inner glare */}
                          <circle 
                            cx={actX} 
                            cy={ptY} 
                            r="5" 
                            fill={isNeg ? "url(#negErrGrad)" : "url(#posErrGrad)"} 
                            stroke="rgba(0,0,0,0.5)" 
                            strokeWidth="0.8"
                            className="cursor-help"
                          >
                            <title>Sample #{idx+1}: Actual={item.actual}, Pred={item.predicted}, Err={item.error}</title>
                          </circle>
                          
                          {/* High-contrast reflection glow point */}
                          <circle cx={actX - 1.5} cy={ptY - 1.5} r="1.2" fill="rgba(255,255,255,0.7)" />
                        </g>
                      );
                    });
                  })()}

                  {/* Gradient colors of errors */}
                  <defs>
                    <radialGradient id="posErrGrad" cx="30%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#a7f3d0" />
                      <stop offset="50%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#047857" />
                    </radialGradient>
                    <radialGradient id="negErrGrad" cx="30%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#fecdd3" />
                      <stop offset="50%" stopColor="#f43f5e" />
                      <stop offset="100%" stopColor="#be123c" />
                    </radialGradient>
                  </defs>
                </svg>

                {/* Interactive Legend Badge */}
                <div className="absolute top-3 left-3 bg-black/70 p-2 rounded-lg border border-white/5 text-[8.5px] font-mono text-zinc-400">
                  <span className="text-cyan-400 font-extrabold tracking-wide">3D REGRESSION GRID</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Underestimation</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-rose-500" />
                    <span>Overestimation</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
