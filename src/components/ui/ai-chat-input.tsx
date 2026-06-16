"use client" 

import * as React from "react"
import { useState, useEffect, useRef } from "react";
import { Lightbulb, Mic, Globe, Paperclip, Send, X, FileText, Image, FileCode, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
 
const PLACEHOLDERS = [
  "Explain the regression results for this model...",
  "Analyze the feature importance rankings...",
  "Is an R² score of 0.85 considered high rigor?",
  "What is the physical meaning of MAE in this context?",
  "How can we optimize these parameters further?",
  "Write an engineering summary of this experiment...",
];

export interface AttachedFile {
  name: string;
  type: "image" | "pdf" | "text";
  data: string; // base64 string for image/pdf, extract characters for spreadsheets/txt
  mimeType: string;
}
 
interface AIChatInputProps {
  inputValue?: string;
  setInputValue?: (val: string) => void;
  onSend?: (text: string, attachments?: AttachedFile[]) => void;
  thinkActive?: boolean;
  setThinkActive?: (val: boolean) => void;
  deepSearchActive?: boolean;
  setDeepSearchActive?: (val: boolean) => void;
  placeholder?: string;
}
 
const AIChatInput = ({
  inputValue: externalInputValue,
  setInputValue: externalSetInputValue,
  onSend,
  thinkActive = false,
  setThinkActive,
  deepSearchActive = false,
  setDeepSearchActive,
}: AIChatInputProps) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [localInputValue, setLocalInputValue] = useState("");
  const [localThinkActive, setLocalThinkActive] = useState(false);
  const [localDeepSearchActive, setLocalDeepSearchActive] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
 
  // Sync state
  const inputValue = externalInputValue !== undefined ? externalInputValue : localInputValue;
  const setInputValue = externalSetInputValue || setLocalInputValue;
  const isThinkActive = setThinkActive ? thinkActive : localThinkActive;
  const isDeepSearchActive = setDeepSearchActive ? deepSearchActive : localDeepSearchActive;

  const toggleThinkActive = () => {
    if (setThinkActive) {
      setThinkActive(!thinkActive);
    } else {
      setLocalThinkActive(!localThinkActive);
    }
  };

  const toggleDeepSearchActive = () => {
    if (setDeepSearchActive) {
      setDeepSearchActive(!deepSearchActive);
    } else {
      setLocalDeepSearchActive(!localDeepSearchActive);
    }
  };
 
  // Cycle placeholder text when input is inactive
  useEffect(() => {
    if (isActive || inputValue) return;
 
    const interval = setInterval(() => {
      setShowPlaceholder(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setShowPlaceholder(true);
      }, 400);
    }, 3000);
 
    return () => clearInterval(interval);
  }, [isActive, inputValue]);
 
  // Close input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        if (!inputValue && attachedFiles.length === 0) setIsActive(false);
      }
    };
 
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputValue, attachedFiles]);
 
  const handleActivate = () => setIsActive(true);
 
  const containerVariants = {
    collapsed: {
      minHeight: 64,
      boxShadow: "inset 8px 8px 24px rgba(0,0,0,0.85), inset -8px -8px 24px rgba(255,255,255,0.005), 0 4px 16px rgba(0,0,0,0.4)",
      transition: { type: "spring", stiffness: 140, damping: 20 },
    },
    expanded: {
      minHeight: 124,
      boxShadow: "inset 8px 8px 32px rgba(0,0,0,0.95), inset -8px -8px 32px rgba(255,255,255,0.008), 0 12px 36px rgba(0,0,0,0.6)",
      transition: { type: "spring", stiffness: 140, damping: 20 },
    },
  };
 
  const placeholderContainerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.02 } },
    exit: { transition: { staggerChildren: 0.012, staggerDirection: -1 } },
  };
 
  const letterVariants = {
    initial: {
      opacity: 0,
      filter: "blur(10px)",
      y: 8,
    },
    animate: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        opacity: { duration: 0.22 },
        filter: { duration: 0.35 },
        y: { type: "spring", stiffness: 85, damping: 18 },
      },
    },
    exit: {
      opacity: 0,
      filter: "blur(10px)",
      y: -8,
      transition: {
        opacity: { duration: 0.15 },
        filter: { duration: 0.22 },
        y: { type: "spring", stiffness: 85, damping: 18 },
      },
    },
  };
 
  const handleSend = () => {
    if (!inputValue.trim() && attachedFiles.length === 0) return;
    if (onSend) {
      onSend(inputValue, attachedFiles);
      setInputValue("");
      setAttachedFiles([]);
    }
  };
 
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Process files parsing them based on type (Image, PDF, Document/Table text extraction)
  const processFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const name = file.name;
      const mimeType = file.type || "application/octet-stream";
      const reader = new FileReader();

      if (file.type.startsWith("image/")) {
        reader.onload = (event) => {
          const resultUrl = event.target?.result as string;
          const base64Raw = resultUrl.split(",")[1] || "";
          setAttachedFiles(prev => [...prev, {
            name,
            type: "image",
            data: base64Raw,
            mimeType
          }]);
        };
        reader.readAsDataURL(file);
      } else if (file.type === "application/pdf") {
        reader.onload = (event) => {
          const resultUrl = event.target?.result as string;
          const base64Raw = resultUrl.split(",")[1] || "";
          setAttachedFiles(prev => [...prev, {
            name,
            type: "pdf",
            data: base64Raw,
            mimeType
          }]);
        };
        reader.readAsDataURL(file);
      } else {
        // Doc, CSV, spreadsheets, txt represent text extracts
        reader.onload = (event) => {
          const rawText = event.target?.result as string;
          // Strip binary garbage characters elegantly to provide clean textual parsing for Gemini
          const filteredText = rawText.replace(/[^\x20-\x7E\t\r\n]/g, " ").slice(0, 6000);
          setAttachedFiles(prev => [...prev, {
            name,
            type: "text",
            data: filteredText,
            mimeType: "text/plain"
          }]);
        };
        reader.readAsText(file);
      }
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsActive(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (idxToRemove: number) => {
    setAttachedFiles(prev => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Indonesian webkit speech integration mapping
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech Recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari.");
        return;
      }
      const rec = new SpeechRecognition();
      recognitionRef.current = rec;
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "id-ID";

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onerror = (event: any) => {
        console.error("Speech Recognition Error Error Key:", event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text) {
          setInputValue((prev: string) => prev ? `${prev} ${text}` : text);
        }
      };

      rec.start();
    }
  };
 
  return (
    <div className="w-full flex justify-center items-center text-slate-100 p-1" id="ai_chat_input_container_premium">
      <motion.div
        ref={wrapperRef}
        className={`w-full relative overflow-hidden border transition-all duration-300 ${
          isDragging 
            ? "border-cyan-400 bg-[#0c101d] ring-1 ring-cyan-400/20" 
            : "border-white/5 bg-[#030406]"
        }`}
        variants={containerVariants}
        animate={isActive || inputValue || attachedFiles.length > 0 ? "expanded" : "collapsed"}
        initial="collapsed"
        style={{ borderRadius: 28 }}
        onClick={handleActivate}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-stretch w-full h-full justify-between pr-1">
          {/* File input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            multiple 
            accept=".csv,.xlsx,.xls,.doc,.docx,.pdf,.png,.jpg,.jpeg,text/plain" 
            className="hidden"
          />

          {/* Attached Files Badge Bar (if any) */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 px-5 pt-3.5 pb-1 select-none border-b border-white/5 bg-black/30">
              {attachedFiles.map((file, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[#0c0d12] hover:border-red-500/20 group/badge"
                >
                  {file.type === "image" ? (
                    <Image size={12} className="text-emerald-400" />
                  ) : file.type === "pdf" ? (
                    <FileText size={12} className="text-red-400" />
                  ) : (
                    <FileCode size={12} className="text-cyan-400" />
                  )}
                  <span className="text-[10px] font-mono max-w-[130px] truncate font-bold text-slate-300">{file.name}</span>
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                    className="p-0.5 rounded-full hover:bg-white/10 text-slate-500 hover:text-red-400 transition cursor-pointer"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Row */}
          <div className="flex items-center gap-2 px-4 py-2 w-full h-[64px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="p-2.5 rounded-full hover:bg-white/5 transition text-slate-400 hover:text-white hover:scale-105 active:scale-95 cursor-pointer"
              title="Attach File (CSV, XLS, DOC, PDF, Image)"
              type="button"
              tabIndex={-1}
            >
              <Paperclip size={18} />
            </button>
  
            {/* Text Input & Placeholder */}
            <div className="relative flex-1 h-full min-w-0 flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isDragging ? "Drop your machine analysis sheets or files here..." : ""}
                className="flex-1 border-0 outline-0 rounded-md py-2.5 text-[12.5px] font-sans font-medium tracking-wide bg-transparent w-full text-zinc-150 placeholder-slate-500 focus:ring-0 focus:outline-none"
                style={{ position: "relative", zIndex: 1 }}
                onFocus={handleActivate}
              />
              <div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center">
                <AnimatePresence mode="wait">
                  {showPlaceholder && !isActive && !inputValue && (
                    <motion.span
                      key={placeholderIndex}
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500 select-none pointer-events-none text-[12px] font-mono tracking-wide"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        zIndex: 0,
                      }}
                      variants={placeholderContainerVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      {PLACEHOLDERS[placeholderIndex]
                        .split("")
                        .map((char, i) => (
                          <motion.span
                            key={i}
                            variants={letterVariants}
                            style={{ display: "inline-block" }}
                          >
                            {char === " " ? "\u00A0" : char}
                          </motion.span>
                        ))}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
  
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleListening();
              }}
              className={`p-2.5 rounded-full transition cursor-pointer hover:scale-105 active:scale-95 ${
                isListening 
                  ? "bg-red-500/20 text-red-400 animate-pulse border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.3)]" 
                  : "hover:bg-white/5 text-slate-400 hover:text-white"
              }`}
              title={isListening ? "Listening... Click to Stop" : "Voice Input (Mic)"}
              type="button"
              tabIndex={-1}
            >
              <Mic size={18} />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSend();
              }}
              disabled={!inputValue.trim() && attachedFiles.length === 0}
              className={`flex items-center justify-center p-2.5 rounded-full font-extrabold cursor-pointer transition-all duration-300 ${
                inputValue.trim() || attachedFiles.length > 0
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:scale-110"
                  : "bg-white/5 text-slate-500 hover:text-slate-400"
              }`}
              title="Send to Advisor"
              type="button"
              tabIndex={-1}
            >
              <Send size={15} />
            </button>
          </div>
 
          {/* Expanded Controls (Spaced beautifully and matching premium 3D look) */}
          <motion.div
            className="w-full flex justify-start px-4 items-center text-xs pb-3.5 h-[52px]"
            variants={{
              hidden: {
                opacity: 0,
                y: 8,
                pointerEvents: "none" as const,
                transition: { duration: 0.15 },
              },
              visible: {
                opacity: 1,
                y: 0,
                pointerEvents: "auto" as const,
                transition: { duration: 0.25, delay: 0.05 },
              },
            }}
            initial="hidden"
            animate={isActive || inputValue || attachedFiles.length > 0 ? "visible" : "hidden"}
          >
            <div className="flex gap-3 items-center">
              {/* Think Toggle */}
              <button
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all text-[10px] font-bold font-mono uppercase tracking-wider border cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                  isThinkActive
                    ? "bg-blue-500/10 border-blue-400/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                    : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10"
                }`}
                title="Explain with deeper details and physical analysis"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleThinkActive();
                }}
              >
                <Lightbulb
                  className={`w-3.5 h-3.5 transition-all ${isThinkActive ? "fill-blue-400 text-blue-400" : "text-slate-400"}`}
                />
                Think Deeply
              </button>
 
              {/* Deep Search Toggle */}
              <motion.button
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all text-[10px] font-bold font-mono uppercase tracking-wider border cursor-pointer whitespace-nowrap overflow-hidden justify-start hover:scale-[1.02] active:scale-[0.98] ${
                  isDeepSearchActive
                    ? "bg-blue-500/10 border-blue-400/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                    : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10"
                }`}
                title="Deep cross-referenced dataset analysis search"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDeepSearchActive();
                }}
                initial={false}
                animate={{
                  width: isDeepSearchActive ? 132 : 38,
                  paddingLeft: isDeepSearchActive ? 14 : 11,
                }}
              >
                <div className="flex-shrink-0">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <motion.span
                  className="pb-[1px]"
                  initial={false}
                  animate={{
                    opacity: isDeepSearchActive ? 1 : 0,
                  }}
                >
                  Deep Search
                </motion.span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
 
export { AIChatInput };
