import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Send, Paperclip, FileText, Image as ImageIcon, 
  Trash2, Loader2, Copy, Check, MessageSquare, AlertCircle, 
  Cpu, Terminal, Zap, Compass, Info, FileCode, CheckCircle2,
  Lightbulb, Globe, Mic, X
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { fileToBase64, extractTextFromDocx } from "../utils/documentParser";

interface Attachment {
  name: string;
  type: "image" | "pdf" | "text";
  mimeType: string;
  data: string; // Base64 content or extracted text
  size: string;
}

interface ChatMessage {
  sender: "student" | "advisor";
  text: string;
  timestamp: string;
  isThought?: boolean;
  attachments?: Omit<Attachment, "data">[];
}

export default function AIAssistant() {
  const { language } = useLanguage();
  
  // Custom states
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "advisor",
      text: language === "id" 
        ? "Assalamu'alaikum ANANDA NUR DAFFA ZAIN! Saya adalah MECH AI yang mendampingi bimbingan akademik Anda di UMY. Di sini, Anda bisa mengunggah foto pengujian mekanis, cetak biru PDF, maupun dokumen Word (.docx) bimbingan untuk saya telaah dan diskusikan secara cerdas. Bagaimana progres analisis material atau regresi permesinan Anda hari ini?"
        : "Assalamu'alaikum ANANDA NUR DAFFA ZAIN! I am MECH AI accompanying your academic bimbingan at UMY. Here, you can upload mechanical test photos, PDF blueprints, or bimbingan Word documents (.docx) for highly intelligent analysis. Shall we review your material statistics or machining regression curves today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // High-fidelity toggles
  const [thinkActive, setThinkActive] = useState(false);
  const [deepSearchActive, setDeepSearchActive] = useState(false);
  const [inputIsFocused, setInputIsFocused] = useState(false);

  // File drag & hover support for supreme usability
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll only the local container to prevent global window jumping
  useEffect(() => {
    const scroller = document.getElementById("premium_chat_scroller");
    if (scroller) {
      scroller.scrollTo({
        top: scroller.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, loading]);

  // Handle Drag & Drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processUploadedFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processUploadedFiles(e.target.files);
    }
  };

  // Modern intelligent multicapable file reader (DOCX / PDF / Image / Text)
  const processUploadedFiles = async (files: FileList) => {
    setIsProcessingFile(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const sizeStr = (file.size / 1024).toFixed(1) + " KB";
        
        // Handle Images
        if (file.type.startsWith("image/")) {
          const base64 = await fileToBase64(file);
          setAttachments(prev => [...prev, {
            name: file.name,
            type: "image",
            mimeType: file.type,
            data: base64,
            size: sizeStr
          }]);
        } 
        // Handle PDF
        else if (file.type === "application/pdf") {
          const base64 = await fileToBase64(file);
          setAttachments(prev => [...prev, {
            name: file.name,
            type: "pdf",
            mimeType: file.type,
            data: base64,
            size: sizeStr
          }]);
        } 
        // Handle Word docs (.docx) - smart extracts contents
        else if (file.name.endsWith(".docx")) {
          const extractedText = await extractTextFromDocx(file);
          setAttachments(prev => [...prev, {
            name: file.name,
            type: "text",
            mimeType: "text/plain",
            data: extractedText,
            size: sizeStr
          }]);
        } 
        // Handle traditional text docs, spreadsheets or code
        else {
          const text = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string || "");
            reader.readAsText(file);
          });
          setAttachments(prev => [...prev, {
            name: file.name,
            type: "text",
            mimeType: "text/plain",
            data: text,
            size: sizeStr
          }]);
        }
      }
    } catch (err: any) {
      console.error("Critical processing error on attachments:", err);
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (customText?: string) => {
    const text = customText !== undefined ? customText : inputValue;
    if (!text.trim() && attachments.length === 0) return;
    if (loading) return;

    setLoading(true);
    if (customText === undefined) {
      setInputValue("");
    }

    // Capture states before clear
    const currentAttachments = [...attachments];
    const isThinking = thinkActive;
    const isSearching = deepSearchActive;

    setAttachments([]); // Flush working attachments list

    // Append student message
    const studentMessage: ChatMessage = {
      sender: "student",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: currentAttachments.map(att => ({
        name: att.name,
        type: att.type,
        mimeType: att.mimeType,
        size: att.size
      }))
    };

    setMessages(prev => [...prev, studentMessage]);

    try {
      // Setup smart prompts modifying short vs long answers
      let extraContextPrompt = "";
      if (isThinking) {
        extraContextPrompt += "\n[MODE: THINK_DEEPLY - Lakukan penalaran fisis kritis mendalam tentang material sains & teknik mesin secara detail, tumpahkan rumus matematika unicode jika relevan]";
      }
      if (isSearching) {
        extraContextPrompt += "\n[MODE: DEEP_SEARCH - Silakan sandingkan korelasi perbandingan model regresi (CatBoost, XGBoost, Extra Trees) di UMY dengan pemecahan numerik]";
      }

      const bodyPayload = {
        messages: [
          ...messages, 
          { 
            sender: studentMessage.sender, 
            text: studentMessage.text + extraContextPrompt 
          }
        ].map(m => ({ sender: m.sender, text: m.text })),
        attachments: currentAttachments.map(att => ({
          name: att.name,
          type: att.type,
          mimeType: att.mimeType,
          data: att.data
        })),
        datasetName: "Mechanical Machining Dataset (EXP2.csv)",
        features: ["Feed Rate (f)", "Spindle Speed (n)", "Depth of Cut (ap)"],
        target: "Surface Roughness (Ra)",
        bestModel: "CatBoost Regressor",
        metrics: { r2: 0.9482, mae: 0.0411, rmse: 0.0519 }
      };

      const resp = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload)
      });

      if (!resp.ok) {
        throw new Error("Koneksi akademik terputus.");
      }

      const result = await resp.json();
      
      setMessages(prev => [...prev, {
        sender: "advisor",
        text: result.reply || "Mohon maaf ANANDA NUR DAFFA ZAIN, server bimbingan sedang menguji optimasi. Silakan ajukan beberapa detik lagi.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

    } catch (err: any) {
      setMessages(prev => [...prev, {
        sender: "advisor",
        text: "Terjadi gangguan jaringan bimbingan mekanikal, ANANDA NUR DAFFA ZAIN. Silakan periksa koneksi atau ulangi menekan tombol kirim.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = (txt: string, idx: number) => {
    navigator.clipboard.writeText(txt);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const suggestedQuestions = [
    {
      label: "Rumus Kekasaran Permesinan (Ra)",
      prompt: "Bagaimana korelasi matematis/fisis antara feed rate dan spindle speed terhadap nilai kekasaran permukaan (Ra)?"
    },
    {
      label: "Bandingkan CatBoost & XGBoost",
      prompt: "Apa keunggulan CatBoost Regressor disbanding XGBoost dalam melatih parameter pembubatan logam?"
    },
    {
      label: "Fisika Getaran Logam",
      prompt: "Bagaimana cara mendeteksi keausan mata pahat berdasarkan grafik respon getaran transient?"
    }
  ];

  return (
    <div 
      className={`w-full max-w-7xl mx-auto rounded-3xl p-0.5 transition-all duration-700 relative overflow-hidden font-sans ${
        dragActive ? "ring-2 ring-cyan-400 bg-cyan-400/5" : "bg-gradient-to-b from-white/10 to-transparent shadow-[0_32px_96px_-16px_rgba(0,0,0,0.8)]"
      }`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      id="premium_3d_ai_dashboard"
    >
      {/* 3D Glass Obsidian Panel container */}
      <div className="w-full bg-gradient-to-b from-[#0e111d]/95 via-[#06080e]/95 to-[#020306]/98 rounded-[22px] overflow-hidden flex flex-col xl:flex-row h-[720px] relative">
        
        {/* Futuristic Grid backgrounds and 3D glowing lights */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.003)_1px,_transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40 z-0" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* LEFT COMPASS: 3D Spherical Control Sphere & Metadata panel */}
        <div className="w-full xl:w-[280px] border-b xl:border-b-0 xl:border-r border-white/5 bg-[#080b13]/85 p-5 flex flex-col justify-between relative z-10">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative flex items-center justify-center w-11 h-11">
                {/* Rotating holographic cyber ring */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-violet-600 animate-spin-around blur-[1px]" />
                <div className="absolute inset-0.5 rounded-[10px] bg-slate-950 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-center space-x-1">
                  <h3 className="text-xs font-black tracking-widest text-white uppercase font-sans">MECH_COGNITIVE</h3>
                </div>
                <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wide">SYSTEM REVISION v1.9</p>
              </div>
            </div>

            {/* NEUMORPHIC 3D STATS BALL: Pure elegant CSS projection */}
            <div className="my-6 p-4 rounded-2xl bg-black/45 border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-[inset_0_3px_12px_rgba(0,0,0,0.8)]">
              {/* Outer 3D floating aura */}
              <div className="absolute inset-0 bg-radial-gradient from-cyan-400/5 via-transparent to-transparent opacity-60 pointer-events-none" />
              
              {/* Spinning 3D Orbital Sphere */}
              <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-dashed border-cyan-400/20"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                  className="absolute inset-2 rounded-full border border-dashed border-indigo-400/15"
                />
                
                {/* The 3D Rendered Sphere */}
                <div className={`w-14 h-14 rounded-full bg-gradient-to-tr from-[#020306] via-[#101426] to-[#0d7377] relative shadow-[0_0_35px_rgba(6,182,212,0.35),_inset_3px_3px_10px_rgba(255,255,255,0.25)] flex items-center justify-center ${loading ? "animate-pulse" : ""}`}>
                  {/* Internal Core lighting glow */}
                  <div className={`absolute inset-1 rounded-full bg-cyan-400/10 blur-[2px] transition-opacity duration-500 ${loading ? "opacity-100" : "opacity-30"}`} />
                  <Sparkles className={`w-6 h-6 ${loading ? "text-cyan-400 animate-spin-around" : "text-white/80"}`} />
                </div>
              </div>

              <span className="text-[10px] text-slate-300 font-mono tracking-widest uppercase font-black">AI BRAIN ACTIVITY</span>
              <p className="text-[9px] text-cyan-400 font-semibold mt-1 font-mono tracking-wider">
                {loading ? "PROCESSING COGNITIVE PATHS" : "COGNITIVE SYSTEM STANDBY"}
              </p>
            </div>

            {/* Micro details listing - beautifully simple */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-[10px] font-mono p-2 bg-white/[0.02] border border-white/5 rounded-xl">
                <span className="text-slate-450 uppercase font-black">Engine Type</span>
                <span className="text-white font-bold">MECH AI ENGINEER</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono p-2 bg-white/[0.02] border border-white/5 rounded-xl">
                <span className="text-slate-450 uppercase font-black">Domain</span>
                <span className="text-white font-bold">Mechanical Science</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono p-2 bg-white/[0.02] border border-white/5 rounded-xl">
                <span className="text-slate-450 uppercase font-black">Context Mode</span>
                <span className="text-cyan-400 font-extrabold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 animate-pulse" /> Unified
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="bg-indigo-950/20 border border-indigo-500/10 rounded-xl p-3 text-left">
              <span className="text-[9px] font-extrabold font-mono text-indigo-400 tracking-wider block mb-1">PRO-ACADEMIC ADVICE</span>
              <p className="text-[10px] text-slate-300 leading-normal font-sans">
                Drag and drop your engineering PDF blueprints or test sheet documents here. I will scan and digest details in milliseconds.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT AREA: Primary Premium Chat Console */}
        <div className="flex-1 flex flex-col h-full relative z-10 overflow-hidden bg-[#030509]/30">
          
          {/* Main Top Header Strip */}
          <div className="px-6 py-4.5 bg-gradient-to-r from-slate-950/80 to-[#10131e]/50 border-b border-white/5 flex items-center justify-between">
            <div className="text-left">
              <h2 className="text-sm font-black text-white tracking-widest uppercase font-mono flex items-center gap-2">
                <span>MECH AI ADVISOR</span>
                <span className="text-[8px] bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black px-1.5 py-0.5 rounded uppercase tracking-widest font-mono">Premium</span>
              </h2>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">UMY - Universitas Muhammadiyah Yogyakarta</p>
            </div>
            
            <div className="flex items-center gap-2.5 bg-slate-950/85 px-4 py-1.5 rounded-full border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[9px] text-cyan-400 font-black uppercase tracking-widest font-mono">ACTIVE_STUDENT_SESSION</span>
            </div>
          </div>

          {/* Luxury Rounded Neumorphic Chat Feed */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-thin scrollbar-thumb-white/5" id="premium_chat_scroller">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => {
                const isAdvisor = msg.sender === "advisor";
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className={`flex w-full ${isAdvisor ? "justify-start" : "justify-end"}`}
                  >
                    <div className={`relative max-w-[85%] rounded-[24px] px-5 py-4.5 text-left border transition-all duration-300 ${
                      isAdvisor 
                        ? "bg-[#0c0e18]/90 border-white/5 text-slate-100 rounded-tl-none shadow-[inset_1px_1px_2px_rgba(255,255,255,0.05),_0_12px_36px_rgba(0,0,0,0.6)]" 
                        : "bg-indigo-500/10 border-indigo-400/20 text-indigo-150 rounded-tr-none shadow-[inset_1px_1px_2px_rgba(255,255,255,0.08),_0_12px_36px_rgba(0,0,0,0.4)]"
                    }`}>
                      
                      {/* Subtle color highlight nodes on active edge */}
                      {isAdvisor && <div className="absolute top-0 left-0 w-3 h-3 bg-cyan-400/35 rounded-full blur-md" />}

                      {/* Msg Ribbon Info heading */}
                      <div className="flex items-center justify-between mb-2 border-b border-white/[0.04] pb-1.5">
                        <span className="text-[9px] font-mono font-black uppercase tracking-widest text-[#81879a] flex items-center gap-1">
                          {isAdvisor ? <Sparkles className="w-3 h-3 text-cyan-400" /> : <Terminal className="w-3 h-3 text-pink-400" />}
                          {isAdvisor ? "MECH AI" : "STUDENT (ANANDA NUR DAFFA ZAIN)"}
                        </span>
                        
                        <div className="flex items-center space-x-2.5">
                          <span className="text-[8px] text-slate-500 font-mono">{msg.timestamp}</span>
                          {isAdvisor && (
                            <button 
                              onClick={() => copyMessage(msg.text, idx)}
                              className="text-slate-500 hover:text-white transition-colors cursor-pointer"
                              title="Copy Academic Response"
                            >
                              {copiedIndex === idx ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Clear Elegant Message body with standard unicode variables */}
                      <p className="text-xs leading-relaxed whitespace-pre-wrap select-text font-normal text-slate-150">
                        {msg.text}
                      </p>

                      {/* Document file attachment cards */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-3.5 pt-2.5 border-t border-white/[0.04] flex flex-wrap gap-2">
                          {msg.attachments.map((att, aIdx) => (
                            <div key={aIdx} className="inline-flex items-center gap-2 bg-black/40 rounded-xl px-3 py-1.5 border border-white/5 text-[9.5px] font-mono text-slate-300">
                              {att.type === "image" ? <ImageIcon className="w-3.5 h-3.5 text-cyan-400" /> : <FileText className="w-3.5 h-3.5 text-indigo-400" />}
                              <span className="max-w-[140px] truncate">{att.name}</span>
                              <span className="text-slate-500">({att.size})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex w-full justify-start select-none"
                >
                  <div className="flex flex-col space-y-1.5 self-start text-left max-w-[85%]">
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#81879a] flex items-center gap-1.5 ml-1">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      MECH AI ENGINEER
                    </span>
                    <div className="bg-[#050608]/90 border border-white/5 px-5 py-3.5 rounded-[1.25rem] rounded-tl-none shadow-xl flex items-center space-x-2.5">
                      <span className="text-[11.5px] font-medium text-slate-300 font-sans tracking-wide">
                        {language === "id" ? "MECH AI sedang mengetik" : "MECH AI is writing"}
                      </span>
                      <div className="flex space-x-1 items-center pt-2">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.8s' }} />
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms', style: { contentVisibility: 'auto' } } as any} />
                        <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' } as any} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* Floating suggested prompts container above composer */}
          <div className="px-6 py-2.5 bg-slate-950/20 flex flex-wrap gap-2.5 z-10 border-t border-white/5">
            {suggestedQuestions.map((item, qIdx) => (
              <button
                key={qIdx}
                onClick={() => handleSendMessage(item.prompt)}
                className="bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 hover:text-white border border-white/5 px-4.5 py-2 rounded-full text-[10px] font-bold tracking-wide transition-all cursor-pointer active:scale-95"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* COMPOSER PANEL: Dynamic animated input and premium features */}
          <div className="p-5 bg-gradient-to-t from-slate-950 to-black/80 border-t border-white/5 z-10 relative">
            
            {/* Show files currently waiting to upload */}
            {attachments.length > 0 && (
              <div className="mb-3.5 flex flex-wrap gap-2 p-2 bg-[#080b12]/90 rounded-2xl border border-white/5">
                {attachments.map((att, index) => (
                  <div 
                    key={index} 
                    className="inline-flex items-center gap-2.5 bg-white/5 hover:bg-white/[0.08] pl-3.5 pr-2 py-2 rounded-xl text-[10px] font-mono text-slate-100 transition-colors border border-white/5"
                  >
                    {att.type === "image" ? <ImageIcon className="w-3.5 h-3.5 text-cyan-400" /> : <FileText className="w-3.5 h-3.5 text-indigo-400" />}
                    <span className="max-w-[160px] truncate font-bold text-white">{att.name}</span>
                    <span className="text-slate-500 font-bold">{att.size}</span>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="p-1 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-450 transition cursor-pointer"
                      title="Remove from queue"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Futuristic 3D Input Composer Wrapper */}
            <div 
              className={`p-1 rounded-3xl bg-[#04060a] border transition-all duration-300 relative ${
                inputIsFocused ? "border-indigo-500/80 shadow-[inset_0_2px_12px_rgba(0,0,0,0.9),_0_0_25px_rgba(99,102,241,0.15)]" : "border-white/5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]"
              }`}
            >
              <div className="flex flex-col">
                
                {/* Text entry and button tools */}
                <div className="flex items-center gap-1.5 px-3 py-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingFile || loading}
                    className="p-3 bg-[#0a0f18] hover:bg-[#121927] text-slate-400 hover:text-cyan-400 rounded-2xl border border-white/5 hover:border-cyan-400/30 transition-all cursor-pointer flex items-center justify-center relative disabled:opacity-50"
                    title="Upload file or photo"
                  >
                    {isProcessingFile ? (
                      <Loader2 className="w-4.5 h-4.5 animate-spin text-cyan-400" />
                    ) : (
                      <Paperclip className="w-4.5 h-4.5" />
                    )}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    multiple
                    accept="image/*,application/pdf,.docx,.txt"
                    className="hidden"
                  />

                  {/* Input Element */}
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                    onFocus={() => setInputIsFocused(true)}
                    onBlur={() => setInputIsFocused(false)}
                    placeholder={language === "id"
                      ? "Komposisikan pertanyaan bimbingan, atau unggah data di sini..."
                      : "Compose your academic queries, or upload data here..."
                    }
                    className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 h-11 px-3"
                  />

                  {/* Submit Cylinder button */}
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={(!inputValue.trim() && attachments.length === 0) || loading}
                    className={`h-11 px-4.5 rounded-2xl font-black transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                      inputValue.trim() || attachments.length > 0
                        ? "bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-600 text-slate-950 active:scale-95 shadow-[0_0_20px_rgba(62,184,255,0.4)]"
                        : "bg-white/5 text-slate-500 hover:text-slate-400 pointer-events-none opacity-40"
                    }`}
                  >
                    <span className="text-[10px] uppercase font-mono font-black tracking-widest hidden sm:inline">SEND</span>
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                {/* Cognitive feature switch ribbon (Think Deeply, Deep Search) */}
                <div className="flex items-center space-x-3 px-3.5 pb-2.5 pt-1.5 border-t border-white/[0.03]">
                  {/* Thinking activation */}
                  <button
                    onClick={() => setThinkActive(!thinkActive)}
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-[9px] font-mono tracking-widest uppercase border cursor-pointer transition-all ${
                      thinkActive 
                        ? "bg-cyan-500/10 border-cyan-400/30 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                        : "bg-white/2 border-white/5 text-slate-450 hover:bg-white/5 hover:text-slate-300"
                    }`}
                  >
                    <Lightbulb className={`w-3.5 h-3.5 ${thinkActive ? "fill-cyan-400 text-cyan-400 animate-pulse" : ""}`} />
                    <span>THINK_DEEPLY</span>
                  </button>

                  {/* Deep search activation */}
                  <button
                    onClick={() => setDeepSearchActive(!deepSearchActive)}
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-[9px] font-mono tracking-widest uppercase border cursor-pointer transition-all ${
                      deepSearchActive 
                        ? "bg-indigo-500/10 border-indigo-400/30 text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                        : "bg-white/2 border-white/5 text-slate-450 hover:bg-white/5 hover:text-slate-300"
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>DEEP_SEARCH</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Tiny developer project link */}
            <div className="mt-3 flex items-center justify-between text-[9px] text-slate-500 font-mono tracking-widest">
              <span className="uppercase text-[8.5px]">Premium Academic Guidance Module</span>
              <span className="text-cyan-400 font-black">ZAINPROJECT © 2026</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
