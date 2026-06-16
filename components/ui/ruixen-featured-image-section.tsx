"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, Sliders, Activity, ShieldAlert, CheckCircle2, 
  Sparkles, Layers, TrendingUp, Compass, Network, RefreshCw
} from "lucide-react";

const themes = {
  accent: "#22d3ee", // cyan
  primary: "#6366f1", // indigo
  warning: "#f59e0b", // amber
  danger: "#f43f5e" // rose
};

export default function RuixenFeaturedImageSection() {
  const [selectedTab, setSelectedTab] = useState(0);
  
  // Tab 1: Mechanical Load Simulator Core State
  const [mechanicalLoad, setMechanicalLoad] = useState(240); // 0 to 500 KN
  const [isAutoLoading, setIsAutoLoading] = useState(false);

  // Tab 2: Neural synapse state
  const [hoveredNeuron, setHoveredNeuron] = useState<string | null>(null);
  const [networkDepth, setNetworkDepth] = useState(4); // hidden node complexity

  // Tab 3: Model Fit & Telemetry State
  const [noiseLevel, setNoiseLevel] = useState(5.2); // micrometers
  const [predictionAccuracy, setPredictionAccuracy] = useState(99.4);

  // Auto load loop for ultimate mechanical simulation presentation
  useEffect(() => {
    if (!isAutoLoading) return;
    const interval = setInterval(() => {
      setMechanicalLoad((prev) => {
        const next = prev + 8;
        return next > 500 ? 50 : next;
      });
    }, 85);
    return () => clearInterval(interval);
  }, [isAutoLoading]);

  // Tab Content Definitions
  const tabs = [
    {
      id: 0,
      title: "Finite Element Stress Twin",
      subtitle: "Dynamic Mechanical Load & Strain",
      description: "Applies real-time physical load parameters across coordinate boundaries to visualize structural deformation contours on a machined steel workpiece.",
      icon: Cpu
    },
    {
      id: 1,
      title: "Deep MLP Synapse Matrix",
      subtitle: "Backpropagation Weights & Bias",
      description: "Visualizes the active feed-forward synapses, nodes, and optimization rates of a 3-layer Perceptron regressor network fitting live stress boundaries.",
      icon: Network
    },
    {
      id: 2,
      title: "Regression Residual Contour",
      subtitle: "SHAP Values & Confidence Bands",
      description: "Explores the variance splits and predictive accuracy bounds under Gaussian sensor noises, mapping high-dimensional decision boundaries.",
      icon: TrendingUp
    }
  ];

  // Calculations for FEM simulation based on Load
  const calculatedStrain = (mechanicalLoad * 0.0028).toFixed(4);
  const calculatedStress = (mechanicalLoad * 1.54).toFixed(1);
  const safetyFactor = Math.max(1.02, (1200 / (parseFloat(calculatedStress) + 50))).toFixed(2);
  const probabilityOfFracture = Math.min(100, Math.max(0, ((mechanicalLoad - 350) / 1.5))).toFixed(1);

  // Color mapping based on applied mechanical load
  const loadColor = 
    mechanicalLoad < 180 ? "rgba(34, 211, 238, 0.85)" : // cyan
    mechanicalLoad < 350 ? "rgba(99, 102, 241, 0.85)" : // indigo
    mechanicalLoad < 430 ? "rgba(245, 158, 11, 0.9)" :  // amber
    "rgba(244, 63, 94, 0.95)"; // rose

  return (
    <section className="py-16 md:py-24 relative overflow-hidden" id="ruixen_featured_section">
      {/* Structural visual decorators */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Superior Luxury Section Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-[9px] font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            Advanced Cybernetic Analysis Suite
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white font-display leading-tight">
            Analytical Modeling & Forecasting Stage
          </h2>
          
          <p className="text-slate-450 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-sans font-medium">
            Step into the virtual engineering twin vault. Test materials behavior, neural activation splits, and multivariable regression distributions in real-time under high stress vectors.
          </p>
        </div>

        {/* 3-Tab Selector Row - Clean, luxurious, and spacious layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 w-full" id="premium_tabs_selector">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isSelected = selectedTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`relative group rounded-2xl border p-5 transition-all duration-300 flex items-start gap-4 text-left select-none cursor-pointer ${
                  isSelected 
                    ? "bg-slate-900/65 border-indigo-500/30 text-white shadow-lg shadow-indigo-500/5" 
                    : "bg-slate-950/30 border-white/5 text-slate-450 hover:bg-slate-950/50 hover:border-white/10 hover:text-white"
                }`}
              >
                {/* Border glowing line animation when active */}
                {isSelected && (
                  <motion.div 
                    className="absolute inset-0 border border-indigo-400 rounded-2xl pointer-events-none"
                    layoutId="activeTabOutline"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <div className={`p-3 rounded-xl shrink-0 transition-transform duration-300 ${
                  isSelected 
                    ? "bg-indigo-500/10 text-indigo-400 scale-105" 
                    : "bg-white/5 text-slate-500 group-hover:scale-105"
                }`}>
                  <IconComponent className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-black tracking-wider uppercase font-mono">{tab.title}</h3>
                  <p className="text-[10px] text-slate-500 font-bold font-mono">{tab.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Sandbox Stage: Redesigned interactive workspace container */}
        <div className="relative rounded-[32px] p-1 bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/5 shadow-[0_45px_100px_rgba(0,0,0,0.9)] overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl -z-10" />
          
          <div className="min-h-[420px] rounded-[28px] relative overflow-hidden flex flex-col lg:flex-row items-stretch">
            
            {/* Engineering technical boundary coordinates and grids */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.01)_1px,_transparent_1px)] bg-[size:20px_20px] pointer-events-none z-10" />
            
            <div className="absolute top-4 left-4 text-[7.5px] font-mono text-slate-500 uppercase tracking-widest font-black select-none z-20">SYS: DUAL_TWIN_SIM</div>
            <div className="absolute bottom-4 left-4 text-[7.5px] font-mono text-slate-500 uppercase tracking-widest font-black select-none z-20">GRID: CORRELATION_MATRIX</div>
            <div className="absolute top-4 right-4 text-[7.5px] font-mono text-indigo-400 tracking-widest font-black uppercase flex items-center gap-1.5 z-20">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> ACTIVE_CALIBRATION
            </div>

            {/* Left Portion of Bento Grid: Visual Interactive Playground */}
            <div className="flex-[3] relative bg-slate-950/60 border-b lg:border-b-0 lg:border-r border-white/5 p-6 sm:p-8 flex flex-col justify-between overflow-hidden min-h-[360px]">
              
              <AnimatePresence mode="wait">
                
                {/* Visualizer Tab 0: Stress Twin Load Simulation */}
                {selectedTab === 0 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full flex flex-col justify-between space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3">
                      <span className="text-[10px] font-mono font-black text-indigo-400 tracking-widest uppercase flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-indigo-400" />
                        Mesh Finite Element Model
                      </span>
                      <div className="flex items-center gap-3 mt-2 sm:mt-0 font-mono text-[9px] text-slate-500 uppercase font-bold">
                        <span>Physical Matrix: Static Geometry Mesh</span>
                      </div>
                    </div>

                    {/* Highly polished static CAD specimen viewport */}
                    <div className="flex-1 relative flex items-center justify-center py-4 min-h-[220px]">
                      
                      {/* Geometric Billet and FEM Mesh Plot */}
                      <svg className="w-full h-48 select-none" viewBox="0 0 450 180" preserveAspectRatio="none">
                        <defs>
                          <radialGradient id="stressGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={loadColor} stopOpacity="0.4" />
                            <stop offset="60%" stopColor={loadColor} stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.0" />
                          </radialGradient>
                          <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1e293b" />
                            <stop offset="100%" stopColor="#0f172a" />
                          </linearGradient>
                        </defs>

                        {/* Background structural lines */}
                        <line x1="25" y1="90" x2="425" y2="90" stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
                        <line x1="225" y1="10" x2="225" y2="170" stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />

                        {/* Solid 3D-perspective specimen boundaries */}
                        <rect x="50" y="30" width="350" height="120" rx="8" fill="url(#gridGrad)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                        
                        {/* Interactive FEM Mesh nodes coordinates - fully static & clean */}
                        <g stroke="rgba(255,255,255,0.06)" strokeWidth="0.8">
                          {/* Columns */}
                          {[50, 100, 150, 200, 250, 300, 350, 400].map((x) => (
                            <line 
                              key={x} 
                              x1={x} 
                              y1="30" 
                              x2={x} 
                              y2="150" 
                            />
                          ))}
                          {/* Rows with subtle luxury blueprint curves */}
                          {[30, 50, 70, 90, 110, 130, 150].map((y) => (
                            <path 
                              key={y} 
                              d={`M 50,${y} Q 225,${y + 12} 400,${y}`} 
                              fill="none" 
                            />
                          ))}
                        </g>

                        {/* Static thermal stress center point (luxurious subtle glow) */}
                        <circle 
                          cx="225" 
                          cy="96" 
                          r={60} 
                          fill="url(#stressGrad)" 
                        />
                        <circle cx="225" cy="96" r="3" fill="#22d3ee" stroke="#fff" strokeWidth="1" />

                        {/* Absolute target crosshairs annotations */}
                        <circle cx="225" cy="96" r="16" fill="none" stroke="rgba(34,211,238,0.3)" strokeWidth="1" strokeDasharray="2 3" />

                        {/* Solid vector force indicators */}
                        <g stroke={loadColor} strokeWidth="1.5">
                          <line x1="225" y1="1" x2="225" y2="18" strokeWidth="2" />
                          <polygon points="221,14 225,20 229,14" fill={loadColor} stroke="none" />
                          <text x="235" y="14" fill="#22d3ee" className="text-[8px] font-mono font-black tracking-wider">LOAD INTEGRATION POINT</text>
                        </g>

                        {/* Structural calibration labels */}
                        <text x="56" y="42" fill="rgba(255,255,255,0.3)" className="text-[6.5px] font-mono leading-none">STRUCT_NODE_L_01</text>
                        <text x="340" y="144" fill="rgba(255,255,255,0.3)" className="text-[6.5px] font-mono leading-none">STRUCT_NODE_R_99</text>
                      </svg>

                      {/* Precise measurement readout panels (beautiful glass blocks) */}
                      <div className="absolute top-1/2 left-8 -translate-y-1/2 bg-slate-950/80 border border-white/10 p-3 rounded-xl text-left shadow-2xl backdrop-blur-md">
                        <p className="text-[7px] font-mono text-slate-500 font-bold uppercase tracking-wider">Y_COORD STRESS</p>
                        <p className="text-sm font-black font-mono text-white mt-0.5">{calculatedStress} <span className="text-[9px] text-slate-400">MPa</span></p>
                      </div>

                      <div className="absolute top-1/2 right-8 -translate-y-1/2 bg-slate-950/80 border border-white/10 p-3 rounded-xl text-left shadow-2xl backdrop-blur-md">
                        <p className="text-[7px] font-mono text-slate-500 font-bold uppercase tracking-wider">SAFETY COEFF</p>
                        <p className="text-sm font-black font-mono mt-0.5 text-emerald-400">{safetyFactor}</p>
                      </div>
                    </div>

                    {/* Luxurious static slider parameter selection */}
                    <div className="space-y-2 border-t border-white/5 pt-4">
                      <div className="flex justify-between text-[10px] font-mono text-slate-450 uppercase font-black leading-none pb-1">
                        <span>Set Specimen External Force Load (Vector FX)</span>
                        <span className="text-white bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">{mechanicalLoad} KiloNewtons</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <input 
                          type="range" 
                          min="0" 
                          max="500" 
                          value={mechanicalLoad}
                          onChange={(e) => {
                            setMechanicalLoad(Number(e.target.value));
                          }}
                          className="flex-1 accent-indigo-400 h-1 rounded bg-slate-900 outline-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Visualizer Tab 1: Neural Synapse Actuator Network */}
                {selectedTab === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full flex flex-col justify-between space-y-6"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="text-[10px] font-mono font-black text-indigo-400 tracking-widest uppercase flex items-center gap-1.5">
                        <Network className="w-4 h-4" />
                        MLP Regressor Feed-Forward Synaptic Map
                      </span>
                      <span className="text-[9.5px] font-mono text-slate-500 uppercase font-bold">MULTILAYER SCHEMATIC MAP</span>
                    </div>

                    {/* MLP Synapse Diagram Frame (Fully Solid & Luxurious) */}
                    <div className="flex-1 relative flex items-center justify-center min-h-[200px]">
                      <svg className="w-full h-40 max-w-sm" viewBox="0 0 300 150">
                        {/* Synaptic Weights Link Lines - Solid gray links */}
                        {[25, 75, 125].map((yInput) => (
                          [15, 55, 95, 135].map((yHidden) => (
                            <line 
                              key={`${yInput}-${yHidden}`}
                              x1="40" y1={yInput}
                              x2="150" y2={yHidden}
                              stroke="rgba(99,102,241,0.18)"
                              strokeWidth="0.8"
                            />
                          ))
                        ))}

                        {/* Hidden Layer -> Output (2 nodes) - Solid links */}
                        {[15, 55, 95, 135].map((yHidden) => (
                          [50, 100].map((yOutput) => (
                            <line 
                              key={`${yHidden}-${yOutput}`}
                              x1="150" y1={yHidden}
                              x2="260" y2={yOutput}
                              stroke="rgba(34,211,238,0.22)"
                              strokeWidth="0.8"
                            />
                          ))
                        ))}

                        {/* Static indicator dots showing flow (no animation) */}
                        <circle cx="95" cy="53" r="1.5" fill="#6366f1" />
                        <circle cx="150" cy="55" r="2" fill="#22d3ee" />
                        <circle cx="210" cy="74" r="1.5" fill="#cbd5e1" />

                        {/* Input Layer circles - Clean, precise outlines */}
                        {[25, 75, 125].map((y, idx) => (
                          <g 
                            key={`input-${idx}`}
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredNeuron(`Input Node ${idx + 1}`)}
                            onMouseLeave={() => setHoveredNeuron(null)}
                          >
                            <circle cx="40" cy={y} r="8" fill="#090d16" stroke="#6366f1" strokeWidth="1.5" />
                            <circle cx="40" cy={y} r="3.5" fill="#6366f1" />
                          </g>
                        ))}

                        {/* Hidden Layer circles */}
                        {[15, 55, 95, 135].map((y, idx) => (
                          <g 
                            key={`hidden-${idx}`}
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredNeuron(`Hidden Activation Neuron ${idx + 1}`)}
                            onMouseLeave={() => setHoveredNeuron(null)}
                          >
                            <circle cx="150" cy={y} r="7" fill="#090d16" stroke="#818cf8" strokeWidth="1" />
                            <circle cx="150" cy={y} r="2.5" fill="#818cf8" />
                          </g>
                        ))}

                        {/* Output Parameter circles */}
                        {[50, 100].map((y, idx) => (
                          <g 
                            key={`output-${idx}`}
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredNeuron(idx === 0 ? "Output Parameter: Calculated Stress (MPa)" : "Output Parameter: Calculated Strain")}
                            onMouseLeave={() => setHoveredNeuron(null)}
                          >
                            <circle cx="260" cy={y} r="9" fill="#090d16" stroke="#22d3ee" strokeWidth="2" />
                            <circle cx="260" cy={y} r="4" fill="#22d3ee" />
                          </g>
                        ))}

                        {/* Layer names labels */}
                        <text x="12" y="10" fill="rgba(255,255,255,0.4)" className="text-[6.5px] font-mono uppercase tracking-wider font-extrabold">INPUT_BLOCK</text>
                        <text x="128" y="8" fill="rgba(255,255,255,0.4)" className="text-[6.5px] font-mono uppercase tracking-wider font-extrabold">HIDDEN_LAYER</text>
                        <text x="245" y="10" fill="rgba(255,255,255,0.4)" className="text-[6.5px] font-mono uppercase tracking-wider font-extrabold">OUTPUT_EST</text>
                      </svg>

                      {/* Synapse Weight value indicator popup */}
                      <div className="absolute bottom-1 w-full max-w-sm flex items-center justify-center h-8">
                        <AnimatePresence mode="wait">
                          {hoveredNeuron ? (
                            <motion.div 
                              initial={{ opacity: 0, y: 3 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -3 }}
                              className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-[8.5px] font-mono text-[#22d3ee] flex items-center gap-2 shadow-2xl"
                            >
                              <span className="text-slate-500 font-bold">NODE PARAMETER:</span>
                              <span className="font-extrabold text-white">{hoveredNeuron} (Weights aligned)</span>
                            </motion.div>
                          ) : (
                            <p className="text-[8px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Hover nodes to view model weights offsets and backpropagation paths.</p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-3.5 gap-2">
                      <span className="text-[9.5px] font-mono text-slate-500 uppercase font-black">Weights Optimization Index</span>
                      <span className="text-[9px] font-mono text-emerald-400 font-extrabold flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-500/15 px-3 py-1 rounded-xl">
                        CONVERGED STRESS RESIDUAL: 1.458e-05
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Visualizer Tab 2: Multivariable Contour Surface Plot */}
                {selectedTab === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full flex flex-col justify-between space-y-6"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="text-[10px] font-mono font-black text-indigo-400 tracking-widest uppercase flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4" />
                        Probability Regression Surface & Residual split
                      </span>
                      <span className="text-[9.5px] font-mono text-slate-500 uppercase font-bold">GAUSSIAN VARIANCE DEVIATIONS</span>
                    </div>

                    {/* SHAP / Gauges display viewport (Stable, clean design) */}
                    <div className="flex-1 relative flex items-center justify-center min-h-[220px]">
                      <div className="w-full max-w-sm grid grid-cols-1 gap-3.5 font-mono text-[9px] text-left">
                        {[
                          { title: "Material Yield Split Coefficient", shap: "+0.345 HRC", accuracy: 98, color: "bg-indigo-500" },
                          { title: "Milling Tool Contact Pressure", shap: "+0.185 HRC", accuracy: 94, color: "bg-cyan-500" },
                          { title: "Induction Heat Diffusion Spline", shap: "-0.092 HRC", accuracy: 88, color: "bg-rose-400" },
                          { title: "Pressurized Coolant Colloid Rate", shap: "+0.045 HRC", accuracy: 76, color: "bg-amber-500" }
                        ].map((m) => (
                          <div key={m.title} className="bg-slate-900/60 border border-white/5 p-3 rounded-xl space-y-2">
                            <div className="flex items-center justify-between text-slate-300">
                              <span className="font-sans font-extrabold text-[10px] text-white leading-none">{m.title}</span>
                              <span className="text-[8px] font-black text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-550/20">{m.shap}</span>
                            </div>
                            
                            {/* Completely stable solid progress markers */}
                            <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden relative">
                              <div 
                                className={`h-full ${m.color}`}
                                style={{ width: `${m.accuracy}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-3.5 gap-2">
                      <span className="text-[9.5px] font-mono text-slate-500 uppercase font-black">Gaussian variance correlation analysis score</span>
                      <span className="text-[9.5px] font-mono text-white font-extrabold">R² PREDICTIVE FIT: 0.9942</span>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

            </div>

            {/* Right Portion of Bento Grid: Luxury HUD Readout details */}
            <div className="flex-[2] bg-slate-950/85 p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden">
              <div className="space-y-6">
                <span className="text-[8px] font-mono text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-full bg-indigo-500/5 font-black tracking-widest uppercase">
                  SYSTEM CORE SPECIFICATIONS
                </span>
                
                <div className="space-y-1.5">
                  <h3 className="text-white font-black text-xl font-display leading-tight tracking-tight">
                    {tabs[selectedTab].title}
                  </h3>
                  <p className="text-slate-450 text-[11px] leading-relaxed font-sans font-medium">
                    {tabs[selectedTab].description}
                  </p>
                </div>

                {/* Highly structured, clean system specs rows */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500 flex items-center gap-1.5 font-bold uppercase">
                      <Compass className="w-3.5 h-3.5 text-slate-400" /> Core Engine
                    </span>
                    <span className="text-slate-200 font-extrabold">CatBoost Generalizer</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500 flex items-center gap-1.5 font-bold uppercase">
                      <Activity className="w-3.5 h-3.5 text-slate-400" /> Computing Speed
                    </span>
                    <span className="text-cyan-400 font-extrabold">0.024 ms/record</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500 flex items-center gap-1.5 font-bold uppercase">
                      <Layers className="w-3.5 h-3.5 text-slate-400" /> Validation Fold
                    </span>
                    <span className="text-slate-200 font-extrabold">10-Fold CV Stacked</span>
                  </div>
                </div>
              </div>

              {/* Interactive Performance Stabilizer widget */}
              <div className="bg-slate-950 border border-white/5 p-4 rounded-2xl space-y-2 mt-8 font-mono text-[9px] relative overflow-hidden shadow-inner">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.02)_0%,_transparent_100%)] pointer-events-none" />
                
                {selectedTab === 0 && (
                  <div className="space-y-2 relative">
                    <div className="flex justify-between items-center text-slate-500 font-bold uppercase leading-none">
                      <span>Calculated Physical Parameters</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px] text-left">
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-white/[0.03]">
                        <p className="text-[7.5px] text-slate-500 uppercase font-black">STRESS VAL</p>
                        <p className="text-xs font-black text-white mt-1">{calculatedStress} MPa</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-white/[0.03]">
                        <p className="text-[7.5px] text-slate-500 uppercase font-black">STRAIN MAPPING</p>
                        <p className="text-xs font-black text-white mt-1">{calculatedStrain} &mu;</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === 1 && (
                  <div className="space-y-2.5 relative">
                    <div className="flex justify-between items-center text-slate-500 font-bold uppercase leading-none">
                      <span>Adjust MLP Layer Node count</span>
                      <span className="text-indigo-400 font-black">{networkDepth} Neurons</span>
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <input 
                        type="range" 
                        min="2" 
                        max="8" 
                        value={networkDepth}
                        onChange={(e) => setNetworkDepth(Number(e.target.value))}
                        className="flex-1 accent-indigo-400 h-1 rounded bg-slate-900 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {selectedTab === 2 && (
                  <div className="space-y-2 relative">
                    <div className="flex justify-between items-center text-slate-500 font-bold uppercase leading-none">
                      <span>Regression Model Accuracy</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-white/[0.03] mt-1.5">
                      <p className="text-[9.5px] font-sans font-bold text-white">Cumulative Fit Confidence</p>
                      <p className="text-xs font-black text-indigo-400 font-mono">99.42%</p>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
