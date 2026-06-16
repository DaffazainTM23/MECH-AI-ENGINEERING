import { useState } from "react";
import { ParsedDataset } from "../utils/fileParser";
import { 
  ArrowRight, Info, CheckSquare, Target, Flame, 
  Sparkles, CheckCircle2, AlertOctagon, HelpCircle, Columns, Filter, Check, ShieldCheck
} from "lucide-react";
import DatasetPreviewModal from "./DatasetPreviewModal";

interface FeatureSelectionProps {
  dataset: ParsedDataset;
  selectedFeatures: string[];
  selectedTarget: string;
  onSetFeatures: (features: string[]) => void;
  onSetTarget: (target: string) => void;
  onConfirmSelection: () => void;
}

export default function FeatureSelection({
  dataset,
  selectedFeatures,
  selectedTarget,
  onSetFeatures,
  onSetTarget,
  onConfirmSelection,
}: FeatureSelectionProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const toggleFeature = (col: string) => {
    if (selectedFeatures.includes(col)) {
      onSetFeatures(selectedFeatures.filter(f => f !== col));
    } else {
      if (col === selectedTarget) return;
      onSetFeatures([...selectedFeatures, col]);
    }
  };

  const handleTargetChange = (col: string) => {
    onSetTarget(col);
    onSetFeatures(selectedFeatures.filter(f => f !== col));
  };

  const isTargetNumeric = selectedTarget ? dataset.summary[selectedTarget]?.type === "numeric" : true;
  const isSelectionReady = selectedFeatures.length > 0 && selectedTarget !== "" && isTargetNumeric;

  return (
    <div className="space-y-8 py-4 text-left font-sans" id="feature_selection_viewport">
      
      {/* Intro section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[10px] font-mono tracking-wider font-extrabold uppercase">
            <Filter className="w-3.5 h-3.5" />
            <span>Step 2: Define Learnable Tensor Axes</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Feature Dimensionality Binder</h2>
          <p className="text-slate-400 text-sm">
            Configure matrix vectors to bind into our estimators. Choose predictor attributes (X) and designate corresponding target outputs (Y).
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="flex items-center space-x-2 py-3 px-5 bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-blue-500/30 text-slate-300 hover:text-white rounded-2xl transition-all cursor-pointer font-bold font-mono text-xs uppercase shadow-xl select-none shrink-0"
        >
          <Columns className="w-4 h-4 text-blue-450 animate-pulse" />
          <span>Inspect Sheet Matrix</span>
        </button>
      </div>

      {/* Educational Terminology Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/60 border border-white/10 rounded-3xl p-6 shadow-inner" id="edu_legend_box">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 shrink-0 shadow-md">
            <CheckSquare className="w-5.5 h-5.5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-white font-mono uppercase tracking-widest flex items-center space-x-1.5">
              <span>Input Features (X Matrix)</span>
            </h4>
            <p className="text-[11px] text-slate-450 leading-relaxed font-light">
              Predictive features represent independent design variables. These mechanical or chemical attributes (heat setpoints, chemistry compositions) are mapped for alloy training.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 shrink-0 shadow-md">
            <Target className="w-5.5 h-5.5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-white font-mono uppercase tracking-widest flex items-center space-x-1.5">
              <span>Independent Target (Y Parameter)</span>
            </h4>
            <p className="text-[11px] text-slate-450 leading-relaxed font-light">
              Dependent target output parameters. Since MechAutoML regression solvers perform numerical projections, the outcome column must represent a continuous numeric parameter (hardness, fatigue, yields).
            </p>
          </div>
        </div>
      </div>

      {/* Main Choice Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="features_selection_columns">
        
        {/* Core Checklist Grid */}
        <div className="lg:col-span-8 space-y-6">
          <div className="backdrop-blur-xl bg-slate-950/40 border border-white/10 hover:border-white/15 rounded-3xl p-6.5 space-y-4 shadow-2xl relative transition-all">
            
            <div className="absolute top-0 right-0 w-32 h-[1px] bg-gradient-to-l from-blue-500/30 to-transparent" />

            <div className="flex items-center justify-between border-b border-white/5 pb-3.5">
              <span className="text-xs font-extrabold text-slate-300 font-mono uppercase tracking-widest block">
                Worksheet Header Mapping
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-semibold bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">
                {dataset.colCount} continuous dimensions available
              </span>
            </div>

            <div className="space-y-4.5 max-h-[460px] overflow-y-auto pr-1" id="columns_checklist_matrix">
              {dataset.headers.map((col) => {
                const sumry = dataset.summary[col];
                const isInputSelected = selectedFeatures.includes(col);
                const isTargetSelected = selectedTarget === col;
                const isColNumeric = sumry?.type === "numeric";

                return (
                  <div
                    key={col}
                    id={`row_column_select_${col}`}
                    className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 ${
                      isInputSelected
                        ? "bg-gradient-to-b from-[#07132a] to-[#030814] border-blue-500/40 text-blue-300 shadow-[inset_3px_3px_8px_rgba(0,0,0,0.9),4px_4px_12px_rgba(0,0,0,0.8),0_0_15px_rgba(59,130,246,0.1)]"
                        : isTargetSelected
                          ? "bg-gradient-to-b from-[#0f1128] to-[#060712] border-indigo-500/40 text-indigo-300 shadow-[inset_3px_3px_8px_rgba(0,0,0,0.9),4px_4px_12px_rgba(0,0,0,0.8),0_0_15px_rgba(99,102,241,0.1)]"
                          : "bg-gradient-to-b from-[#090b16] to-[#04050a] border-white/10 hover:border-white/15 shadow-[6px_6px_16px_rgba(0,0,0,0.95),-3px_-3px_10px_rgba(255,255,255,0.01),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[8px_8px_20px_rgba(0,0,0,0.98)]"
                    }`}
                  >
                    {/* Left Column Description */}
                    <div className="flex items-center space-x-3.5">
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2.5">
                          <span className="font-bold text-sm text-white font-mono tracking-wide">{col}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black font-mono tracking-widest uppercase shadow-sm ${
                            isColNumeric 
                              ? "bg-blue-500/15 text-blue-400 border border-blue-500/20" 
                              : "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                          }`}>
                            {sumry?.type || "categorical"}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-450 font-mono font-medium leading-relaxed">
                          Unique: <strong className="text-slate-300">{sumry?.uniqueCount || 0}</strong> | Blanks: <strong className="text-slate-350">{sumry?.missingCount || 0}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Right Choice Buttons - Perfectly Symmetrical, Premium Neumorphic 3D Buttons */}
                    <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-center justify-end" id={`choices_box_for_${col}`}>
                      {/* Select Input Features Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleFeature(col)}
                        disabled={isTargetSelected}
                        className={`w-32 h-11 rounded-xl text-[10.5px] font-black font-mono uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer ${
                          isInputSelected
                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[inset_2px_2px_6px_rgba(0,0,0,0.65),0_0_15px_rgba(59,130,246,0.35)] border border-blue-400/30"
                            : isTargetSelected
                              ? "opacity-15 cursor-not-allowed bg-[#010204]/80 text-slate-705 border border-transparent"
                              : "bg-[#030409] hover:bg-[#070912] text-slate-400 hover:text-white border border-white/10 hover:border-blue-400/40 shadow-[4px_4px_10px_rgba(0,0,0,0.8),-2px_-2px_6px_rgba(255,255,255,0.01)] active:translate-y-[1px]"
                        }`}
                      >
                        <CheckSquare className={`w-3.5 h-3.5 ${isInputSelected ? "animate-pulse" : ""}`} />
                        <span>Input (X)</span>
                      </button>

                      {/* Select Target */}
                      <button
                        type="button"
                        onClick={() => handleTargetChange(col)}
                        disabled={isInputSelected}
                        className={`w-32 h-11 rounded-xl text-[10.5px] font-black font-mono uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer ${
                          isTargetSelected
                            ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-[inset_2px_2px_6px_rgba(0,0,0,0.65),0_0_15px_rgba(99,102,241,0.35)] border border-indigo-400/30"
                            : isInputSelected
                              ? "opacity-15 cursor-not-allowed bg-[#010204]/80 text-slate-705 border border-transparent"
                              : "bg-[#030409] hover:bg-[#070912] text-slate-400 hover:text-white border border-white/10 hover:border-indigo-400/40 shadow-[4px_4px_10px_rgba(0,0,0,0.8),-2px_-2px_6px_rgba(255,255,255,0.01)] active:translate-y-[1px]"
                        }`}
                      >
                        <Target className={`w-3.5 h-3.5 ${isTargetSelected ? "animate-pulse" : ""}`} />
                        <span>Target (Y)</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Selected Parameter Summary Console */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Validation Check Box */}
          {selectedTarget && !isTargetNumeric && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-4.5 rounded-3xl flex items-start space-x-3 text-rose-300 shadow-xl" id="selection_validation_alert">
              <AlertOctagon className="w-5 h-5 text-rose-450 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <h4 className="font-extrabold text-[11px] uppercase tracking-wider font-mono">Target Must Be Continuous Float</h4>
                <p className="leading-relaxed text-slate-350">
                  The selected target <strong>"{selectedTarget}"</strong> is categorical. Regression algorithms fit numerical properties. Please bind a numeric Y parameter.
                </p>
              </div>
            </div>
          )}

          <div className="backdrop-blur-xl bg-slate-950/50 border border-white/10 hover:border-white/15 rounded-3xl p-6 space-y-6 shadow-2xl text-xs relative transition-all" id="parameter_console_summary">
            
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-indigo-500/5 blur-xl rounded-full" />

            <div className="flex items-center space-x-2.5 border-b border-white/5 pb-3">
              <Flame className="w-4 h-4 text-blue-450" />
              <h3 className="font-extrabold uppercase tracking-widest text-slate-200 font-mono text-xs">
                Compiler Configuration
              </h3>
            </div>

            {/* Target Panel */}
            <div className="space-y-2 text-left">
              <span className="text-[9.5px] uppercase font-bold text-slate-500 font-mono tracking-wider block">Target Outcomes (Y-Vector):</span>
              {selectedTarget ? (
                <div className="bg-indigo-600/10 border border-indigo-500/25 p-4 rounded-2xl flex items-center justify-between font-mono font-bold text-indigo-300 shadow-inner">
                  <span className="truncate max-w-[150px]">{selectedTarget}</span>
                  <span className="text-[8.5px] bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                    {dataset.summary[selectedTarget]?.type || "Numeric Target"}
                  </span>
                </div>
              ) : (
                <div className="border border-dashed border-white/10 bg-slate-950/20 p-4 rounded-2xl text-center text-slate-500 font-mono uppercase text-[10px] tracking-wider select-none">
                  Bind Target Variable (Required)
                </div>
              )}
            </div>

            {/* Features list */}
            <div className="space-y-2 text-left">
              <span className="text-[9.5px] uppercase font-bold text-slate-500 font-mono tracking-wider block">Predictive Matrix Weights (X-Features):</span>
              {selectedFeatures.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 max-h-[180px] overflow-y-auto pr-1" id="mini_feature_chips_list">
                  {selectedFeatures.map(f => (
                    <span key={f} className="inline-flex items-center space-x-1 font-mono text-[10.5px] font-bold bg-blue-500/5 border border-blue-500/15 text-blue-300 px-3 py-1.5 rounded-xl">
                      <span>{f}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-white/10 bg-slate-950/20 p-4 rounded-2xl text-center text-slate-500 font-mono uppercase text-[10px] tracking-wider select-none">
                  Bind Input Features (Required)
                </div>
              )}
            </div>

            {/* Ready summary checklist */}
            <div className="space-y-3 bg-slate-950/80 rounded-2xl p-4.5 border border-white/5 text-[10.5px] font-mono leading-normal shadow-inner text-left select-none" id="selection_validation_checklist">
              <div className="flex items-center space-x-2.5">
                <span className={`w-2 h-2 rounded-full ${selectedTarget ? "bg-emerald-500" : "bg-slate-700"} animate-pulse`} />
                <span className={selectedTarget ? "text-slate-300 font-bold" : "text-slate-500"}>Target Defined (Y)</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className={`w-2 h-2 rounded-full ${selectedTarget && isTargetNumeric ? "bg-emerald-500" : "bg-slate-700"}`} />
                <span className={selectedTarget && isTargetNumeric ? "text-slate-300 font-bold" : "text-slate-500"}>Numeric Constraints Satisfied</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className={`w-2 h-2 rounded-full ${selectedFeatures.length > 0 ? "bg-emerald-500" : "bg-slate-700"}`} />
                <span className={selectedFeatures.length > 0 ? "text-slate-300 font-bold" : "text-slate-500"}>Input Vector Loaded ({selectedFeatures.length})</span>
              </div>
            </div>

            {/* Confirm button */}
            <button
              onClick={onConfirmSelection}
              disabled={!isSelectionReady}
              className={`w-full py-4 px-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg transform active:scale-[0.98] font-mono uppercase text-xs tracking-wider select-none ${
                isSelectionReady
                  ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600 hover:brightness-110 text-white shadow-blue-500/10 cursor-pointer"
                  : "bg-slate-900 text-slate-500 cursor-not-allowed border border-white/5 shadow-none"
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Register Variables</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

          </div>

        </div>

      </div>

      <DatasetPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        dataset={dataset}
        selectedFeatures={selectedFeatures}
        selectedTarget={selectedTarget}
        onSetFeatures={onSetFeatures}
        onSetTarget={onSetTarget}
      />

    </div>
  );
}
