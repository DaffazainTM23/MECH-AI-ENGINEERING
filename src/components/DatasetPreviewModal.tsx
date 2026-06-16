import { useState, useMemo } from "react";
import { ParsedDataset } from "../utils/fileParser";
import { 
  X, Search, Sparkles, CheckSquare, Target, Save, 
  Settings, Columns, Eye, EyeOff
} from "lucide-react";

interface DatasetPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: ParsedDataset;
  selectedFeatures: string[];
  selectedTarget: string;
  onSetFeatures: (features: string[]) => void;
  onSetTarget: (target: string) => void;
}

export default function DatasetPreviewModal({
  isOpen,
  onClose,
  dataset,
  selectedFeatures,
  selectedTarget,
  onSetFeatures,
  onSetTarget,
}: DatasetPreviewModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<string[]>(dataset.headers);
  const [activeTab, setActiveTab] = useState<"grid" | "visibility">("grid");

  // Page Controls
  const [pageSize, setPageSize] = useState<number | "all">(20);
  const [currentPage, setCurrentPage] = useState(1);

  if (!isOpen) return null;

  // Search filtering logic
  const filteredRows = dataset.rows.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate paginated elements dynamically
  const paginatedRows = useMemo(() => {
    if (pageSize === "all") return filteredRows;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredRows.slice(startIndex, startIndex + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  const totalPages = useMemo(() => {
    if (pageSize === "all") return 1;
    return Math.ceil(filteredRows.length / pageSize) || 1;
  }, [filteredRows, pageSize]);

  const toggleFeature = (col: string) => {
    if (selectedFeatures.includes(col)) {
      onSetFeatures(selectedFeatures.filter(f => f !== col));
    } else {
      if (col === selectedTarget) {
        // Clear target if setting as feature
        onSetTarget("");
      }
      onSetFeatures([...selectedFeatures, col]);
    }
  };

  const setTargetColumn = (col: string) => {
    if (selectedTarget === col) {
      onSetTarget("");
    } else {
      onSetTarget(col);
      // Remove from selected features
      onSetFeatures(selectedFeatures.filter(f => f !== col));
    }
  };

  const toggleColumnVisibility = (col: string) => {
    if (visibleColumns.includes(col)) {
      if (visibleColumns.length === 1) return; // Must have at least one column visible
      setVisibleColumns(visibleColumns.filter(c => c !== col));
    } else {
      setVisibleColumns([...visibleColumns, col]);
    }
  };

  const selectAllFeatures = () => {
    const validFeatures = dataset.headers.filter(h => h !== selectedTarget);
    onSetFeatures(validFeatures);
  };

  const clearAllSelected = () => {
    onSetFeatures([]);
    onSetTarget("");
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 backdrop-blur-xl bg-slate-950/60 transition-all duration-300 animate-fadeIn" id="dataset_preview_modal">
      <div 
        className="w-full max-w-6xl h-[85vh] bg-slate-900/80 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden ios-glass text-left"
        style={{ boxShadow: "0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.05)" }}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-500/10 rounded-2xl text-blue-450 border border-blue-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-sans tracking-tight">Interactive Dataset Schema Preview</h2>
              <p className="text-[11px] text-slate-400 font-mono tracking-wide">
                FILENAME: {dataset.fileName} &bull; {dataset.rowCount} ROWS &bull; {dataset.colCount} COLUMNS
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 bg-white/5 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer pointer-events-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action strip */}
        <div className="px-6 py-4 border-b border-white/5 bg-slate-955 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-64 pointer-events-auto">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search raw values..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono placeholder:text-slate-600"
              />
            </div>

            <div className="flex rounded-xl bg-slate-950/40 p-1 border border-white/5 pointer-events-auto">
              <button
                onClick={() => setActiveTab("grid")}
                className={`px-3 py-1 text-[11px] font-bold font-sans rounded-lg transition-all cursor-pointer ${
                  activeTab === "grid" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Data Grid View
              </button>
              <button
                onClick={() => setActiveTab("visibility")}
                className={`px-3 py-1 text-[11px] font-bold font-sans rounded-lg transition-all cursor-pointer ${
                  activeTab === "visibility" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Column Controller
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pointer-events-auto">
            <button
              onClick={selectAllFeatures}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white rounded-xl transition-all text-[10px] font-bold font-mono tracking-wider uppercase cursor-pointer"
            >
              Select All Inputs
            </button>
            <button
              onClick={clearAllSelected}
              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition-all text-[10px] font-bold font-mono tracking-wider uppercase cursor-pointer"
            >
              Reset Configuration
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-auto p-6 min-h-0 bg-slate-950/20">
          {activeTab === "visibility" ? (
            <div className="space-y-4 max-w-2xl mx-auto py-8">
              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-400 font-mono uppercase block tracking-wider">Column Controller</span>
                <p className="text-slate-400 text-xs">Toggle the visibility of specific columns in the main interactive data grid representation below.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
                {dataset.headers.map(col => {
                  const isVisible = visibleColumns.includes(col);
                  return (
                    <button
                      key={col}
                      onClick={() => toggleColumnVisibility(col)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left pointer-events-auto cursor-pointer ${
                        isVisible
                          ? "bg-slate-900 border-blue-500/40 text-white"
                          : "bg-slate-950/30 border-white/5 text-slate-500"
                      }`}
                    >
                      <span className="text-xs font-mono font-bold truncate max-w-[130px]">{col}</span>
                      {isVisible ? <Eye className="w-3.5 h-3.5 text-blue-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-650" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col space-y-4">
              {/* Pagination controls */}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2 pb-1">
                <div className="flex items-center space-x-2 font-mono">
                  <span className="text-slate-400">Page Size Limit:</span>
                  <div className="flex bg-slate-950/60 border border-white/5 p-0.5 rounded-lg">
                    {[10, 20, 50, 100, 250, "all"].map((limit) => (
                      <button
                        key={limit}
                        type="button"
                        onClick={() => {
                          setPageSize(limit as any);
                          setCurrentPage(1);
                        }}
                        className={`px-2 py-1 rounded text-[9.5px] font-bold uppercase transition-all cursor-pointer ${
                          pageSize === limit 
                            ? "bg-blue-600 text-white"
                            : "text-slate-500 hover:text-slate-350"
                        }`}
                      >
                        {limit === "all" ? "All" : limit}
                      </button>
                    ))}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-550">
                  Matches: {filteredRows.length} of {dataset.rowCount} total records
                </span>
              </div>

              <div className="flex-1 overflow-auto border border-white/10 rounded-2xl bg-slate-950/40 max-h-[420px] shadow-inner relative">
                <table className="w-full text-left font-mono text-[10px] border-collapse">
                  <thead className="bg-slate-950 text-slate-450 sticky top-0 z-10 border-b border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                    <tr>
                      <th className="p-3 border-r border-white/5 text-center w-12 text-slate-500">#</th>
                      {visibleColumns.map((col) => {
                        const isInput = selectedFeatures.includes(col);
                        const isTarget = selectedTarget === col;
                        const colType = dataset.summary[col]?.type;

                        return (
                          <th key={col} className="p-3 border-r border-white/5 min-w-[200px] align-top">
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-white font-black truncate text-[11px]" title={col}>{col}</span>
                                <span className={`text-[8.5px] uppercase font-bold p-0.5 px-1.5 rounded-md ${
                                  colType === "numeric" ? "bg-teal-500/10 text-teal-400" : "bg-purple-500/10 text-purple-400"
                                }`}>
                                  {colType || "type"}
                                </span>
                              </div>

                              {/* Target overrides checklist in table header */}
                              <div className="flex items-center space-x-1.5 pt-1 pointer-events-auto">
                                <button
                                  onClick={() => toggleFeature(col)}
                                  className={`flex-1 py-1 px-1.5 rounded-lg border transition-all text-[9px] font-bold uppercase flex items-center justify-center space-x-1 cursor-pointer ${
                                    isInput 
                                      ? "bg-blue-600/25 border-blue-500 text-blue-400" 
                                      : "bg-white/5 border-white/5 text-slate-550 hover:text-slate-350"
                                  }`}
                                  disabled={isTarget}
                                  title="Toggle as input features (X)"
                                >
                                  <CheckSquare className="w-2.5 h-2.5" />
                                  <span>{isInput ? "Feature" : "+ Fit X"}</span>
                                </button>

                                <button
                                  onClick={() => setTargetColumn(col)}
                                  disabled={colType !== "numeric"}
                                  className={`flex-1 py-1 px-1.5 rounded-lg border transition-all text-[9px] font-bold uppercase flex items-center justify-center space-x-1 cursor-pointer ${
                                    isTarget 
                                      ? "bg-indigo-600/30 border-indigo-500 text-indigo-400" 
                                      : "bg-white/5 border-white/5 text-slate-550 hover:text-slate-350 disabled:opacity-30 disabled:cursor-not-allowed"
                                  }`}
                                  title="Toggle as output prediction target (Y). Target columns must be numeric."
                                >
                                  <Target className="w-2.5 h-2.5" />
                                  <span>{isTarget ? "Target" : "+ Target Y"}</span>
                                </button>
                              </div>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-350 font-mono">
                    {paginatedRows.length === 0 ? (
                      <tr>
                        <td colSpan={visibleColumns.length + 1} className="py-8 text-center text-slate-500 uppercase tracking-widest">
                          No matching records found
                        </td>
                      </tr>
                    ) : (
                      paginatedRows.map((row, rIdx) => {
                        const rowNum = pageSize === "all" ? rIdx + 1 : (currentPage - 1) * pageSize + rIdx + 1;
                        return (
                          <tr key={rIdx} className="hover:bg-white/5 transition-all">
                            <td className="p-3 border-r border-white/5 text-center text-slate-600 font-bold bg-slate-950/20">{rowNum}</td>
                            {visibleColumns.map((col) => {
                              const val = row[col];
                              const isInput = selectedFeatures.includes(col);
                              const isTarget = selectedTarget === col;

                              let bgClass = "";
                              if (isInput) bgClass = "bg-blue-500/[0.02]";
                              if (isTarget) bgClass = "bg-indigo-500/[0.04] text-indigo-300 font-extrabold";

                              return (
                                <td key={col} className={`p-3 border-r border-white/5 max-w-[200px] truncate ${bgClass}`}>
                                  {val !== undefined && val !== null ? String(val) : <span className="text-red-500/70 font-bold">NULL</span>}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-500 text-[10px] font-mono border-t border-white/5 pt-3">
                <span>
                  Showing {pageSize === "all" ? "all" : `${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, filteredRows.length)}`} of {filteredRows.length} rows (Total {dataset.rowCount} rows)
                </span>
                
                {pageSize !== "all" && totalPages > 1 && (
                  <div className="flex items-center space-x-1.5" id="modal_paginated_picker">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
                      className="px-2 py-1 hover:bg-white/5 disabled:opacity-25 border border-white/5 rounded-md cursor-pointer text-slate-400 hover:text-white"
                    >
                      Prev
                    </button>
                    <span className="text-slate-400">Page {currentPage} of {totalPages}</span>
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))}
                      className="px-2 py-1 hover:bg-white/5 disabled:opacity-25 border border-white/5 rounded-md cursor-pointer text-slate-400 hover:text-white"
                    >
                      Next
                    </button>
                  </div>
                )}
                
                <span className="text-slate-400">
                  Currently configured: <strong className="text-blue-400">{selectedFeatures.length} Features</strong> &bull; <strong className="text-indigo-400">{selectedTarget || "No target"}</strong> target index.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-slate-950/40 flex items-center justify-between">
          <div className="hidden md:flex items-center space-x-2 text-slate-500 text-[10px] font-mono">
            <Settings className="w-3.5 h-3.5 text-blue-500" />
            <span>Interactive mappings are synced live with Feature Selection Workspace configuration.</span>
          </div>
          
          <button
            onClick={onClose}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-bold font-mono flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/10 cursor-pointer pointer-events-auto transform active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>CONFIRM SCHEMATIC MATRIX</span>
          </button>
        </div>
      </div>
    </div>
  );
}
