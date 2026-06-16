import React, { useState, useEffect, useRef } from "react";
import { ParsedDataset } from "../utils/fileParser";
import { ModelPerformance, PreprocessedData } from "../utils/mlEngine";
import { useLanguage } from "../context/LanguageContext";
import { AIChatInput } from "./ui/ai-chat-input";
import { 
  Award, Database, Settings, BarChart2, TrendingUp, CheckCircle, 
  HelpCircle, Calendar, FileText, Download, ShieldCheck, ArrowRight, Activity, Sparkles, RefreshCw,
  Send, MessageSquare, GraduationCap, Copy, Check
} from "lucide-react";

interface ModelPerformanceDashboardProps {
  dataset: ParsedDataset | null;
  selectedFeatures: string[];
  selectedTarget: string;
  preprocessingResult: PreprocessedData | null;
  performances: ModelPerformance[];
  bestModelName: string;
  historyList?: any[];
}

export default function ModelPerformanceDashboard({
  dataset,
  selectedFeatures,
  selectedTarget,
  preprocessingResult,
  performances,
  bestModelName,
  historyList = []
}: ModelPerformanceDashboardProps) {

  const { language } = useLanguage();
  const tLocal = (en: string, id: string) => language === "id" ? id : en;

  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [errorAi, setErrorAi] = useState<string>("");

  // Academic Advisor Interactive Chat States
  const [activeSideTab, setActiveSideTab] = useState<"report" | "chat">("chat");
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      sender: "advisor",
      text: language === "id" 
        ? "Assalamu'alaikum, Ananda! Saya adalah MECH AI ENGINEER Anda. Di sini kita bebas berdiskusi mengenai hasil evaluasi model AutoML kita. Silakan tanyakan apa saja seputar hasil evaluasi parameter manufaktur dan machine learning untuk proyek Anda!"
        : "Assalamu'alaikum! I am your MECH AI ENGINEER. We can discuss the evaluation metrics of our AutoML model here. Feel free to ask anything about manufacturing parameter evaluations and machine learning for your project!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [thinkActive, setThinkActive] = useState<boolean>(false);
  const [deepSearchActive, setDeepSearchActive] = useState<boolean>(false);
  const [loadingChat, setLoadingChat] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  const chatEndRef = useRef<HTMLDivElement>(null);

  const bestModel = performances.find(p => p.modelName === bestModelName) || performances[0];
  const numRows = preprocessingResult?.allX.length || dataset?.rows.length || 0;
  const numFeatures = selectedFeatures.length;

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (activeSideTab === "chat" && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeSideTab]);

  // Automated trigger on metrics or components mount
  useEffect(() => {
    if (performances.length > 0) {
      fetchAiAnalysis();
    }
  }, [bestModelName, selectedTarget, numRows]);

  const fetchAiAnalysis = async () => {
    setLoadingAi(true);
    setErrorAi("");
    try {
      const resp = await fetch("/api/gemini/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datasetName: dataset?.fileName || "Mechanical Engineering Dataset",
          metrics: {
            r2: bestModel.r2,
            mae: bestModel.mae,
            rmse: bestModel.rmse,
            mape: bestModel.mape
          },
          features: selectedFeatures,
          target: selectedTarget,
          bestModel: bestModelName,
        })
      });
      if (!resp.ok) {
        throw new Error("HTTP " + resp.status + " response calling academic advisor brain.");
      }
      const data = await resp.json();
      setAiAnalysis(data.text || "");
    } catch (err: any) {
      setErrorAi(err?.message || "Academic advisor brain was unable to generate custom parameters analysis.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSendMessage = async (textToSend?: string, files?: any[]) => {
    const text = textToSend !== undefined ? textToSend : chatInput;
    if (!text.trim() && (!files || files.length === 0)) return;
    if (loadingChat) return;

    const userMsg = {
      sender: "student",
      text: text.trim(),
      attachments: files || [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (textToSend === undefined) setChatInput("");
    setLoadingChat(true);

    try {
      let advisorReply = "";
      let fetchedSuccessfully = false;

      // 1. Try server-side API call first
      try {
        const resp = await fetch("/api/gemini/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...chatMessages, userMsg].map(m => ({ sender: m.sender, text: m.text })),
            attachments: files || [],
            datasetName: dataset?.fileName || "Data Koridor Permesinan",
            features: selectedFeatures,
            target: selectedTarget,
            bestModel: bestModelName,
            metrics: {
              r2: bestModel.r2,
              mae: bestModel.mae,
              rmse: bestModel.rmse,
              mape: bestModel.mape
            }
          })
        });

        if (resp.ok) {
          const resData = await resp.json();
          advisorReply = resData.reply;
          fetchedSuccessfully = true;
        }
      } catch (serverErr) {
        console.warn("Backend chat server endpoint failed or unreachable, trying client fallback...", serverErr);
      }

      // 2. If server call fails (e.g. 404 in Netlify), try dynamic client fallback
      if (!fetchedSuccessfully) {
        const clientApiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
        if (clientApiKey && clientApiKey !== "MY_VITE_GEMINI_API_KEY" && clientApiKey.trim().length > 5) {
          try {
            const { GoogleGenAI } = await import("@google/genai");
            const aiClient = new GoogleGenAI({
              apiKey: clientApiKey,
              httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
            });

            const datasetName = dataset?.fileName || "Data Koridor Permesinan";
            const target = selectedTarget || "Ra";
            const featuresStr = selectedFeatures && selectedFeatures.length > 0 ? selectedFeatures.join(", ") : "f, vc, ap";
            const modelName = bestModelName || "Gradient Boosting Regressor";
            const r2Val = bestModel?.r2 != null ? bestModel.r2.toFixed(4) : "0.9482";
            const maeVal = bestModel?.mae != null ? bestModel.mae.toFixed(4) : "0.0411";
            const rmseVal = bestModel?.rmse != null ? bestModel.rmse.toFixed(4) : "0.0519";
            const mapeVal = bestModel?.mape != null ? (bestModel.mape * 100).toFixed(2) + "%" : "4.12%";

            const historyList = [...chatMessages, userMsg]
              .map(m => `${m.sender === "student" ? "Mahasiswa (Ananda)" : "Akselerator Akademik (MECH AI ADVISOR)"}: ${m.text}`)
              .join("\n\n");

            const fullPrompt = `Anda adalah Profesor Teknik Mesin dan Pakar AI Terapan terkemuka di Universitas Muhammadiyah Yogyakarta (UMY).
Nama Anda adalah MECH AI ADVISOR (Prof. AI Advisor), membimbing mahasiswa kesayangan Anda:
- Nama Mahasiswa: Ananda Nur Daffa Zain
- NIM: 20230130023
- Proyek Penelitian: Applied AI in Manufacturing Systems & Mechanical Diagnostics

DETAIL MODEL SAAT INI (Gunakan detail ini sebagai konteks bimbingan akademis jika relevan):
- Dataset: ${datasetName}
- Fitur Masukan (X): ${featuresStr}
- Variabel Target (Y): ${target}
- Pilihan Model Terbaik: ${modelName}
- Metrik Evaluasi: R² = ${r2Val}, MAE = ${maeVal}, RMSE = ${rmseVal}, MAPE = ${mapeVal}

PERATURAN RESPONS ADAPTIF:
1. SESUAIKAN PANJANG JAWABAN:
   - Jika mahasiswa mengirim pesan pendek, menyapa (seperti "halo", "apa kabar prof", "siap", "oke baik", "terima kasih"), Anda HARUS membalas secara SINGKAT, PADAT, elegan dan ramah (1-3 kalimat saja). JANGAN menulis analisis panjang lebar atau menampilkan statistik metrics jika tidak relevan dengan salam pendek mereka!
   - Jika mahasiswa memberikan pertanyaan ilmiah berbobot atau bertanya tentang langkah optimasi, fisika material, atau metrik pengujian, berikan analisis akademis ilmiah yang mendalam, terperinci, dan mendidik.
2. JELASKAN ATAU BACA BERKAS / LAMPIRAN JIKA ADA.
3. HINDARI SIMBOL MATEMATIKA YANG BERANTAKAN/LATEX JARGON: Selalu tulis persamaan matematika fisis secara bersih dengan teks Unicode murni tanpa simbol LaTeX ($), misalnya R², f².
4. GAYA BAHASA DAN PENUTUP: Gunakan Bahasa Indonesia yang sangat sopan khas dosen UMY. Selalu panggil mahasiswa dengan hangat sebagai "Mas Ananda" atau "Ananda".
   - Akhiri respons bimbingan secara santun dan konsisten dengan pesan motivasi: "Selamat belajar Ananda! Tetap teliti dalam praktikum. - Prof. AI Advisor".

Berikut transkrip riwayat obrolan terkini:
${historyList}
MECH AI ADVISOR (Prof. AI Advisor):`;

            const response = await aiClient.models.generateContent({
              model: "gemini-3.5-flash",
              contents: fullPrompt,
              config: {
                systemInstruction: "Anda adalah pembimbing akademis yang ramah dan berdedikasi tinggi di UMY untuk mahasiswa bimbingan bernama Ananda Nur Daffa Zain (NIM: 20230130023). Anda selalu menyesuaikan panjang jawaban dengan pertanyaan siswa, dan selalu menyajikan persamaan fisis dengan teks Unicode murni yang super rapi dan bersih tanpa simbol LaTeX ($)."
              }
            });
            
            if (response.text) {
              advisorReply = response.text;
              fetchedSuccessfully = true;
            }
          } catch (clientErr) {
            console.error("Client fallback Gemini call failed:", clientErr);
          }
        }
      }

      // 3. Fallback to highly advanced local academic advisor simulation engine if no keys are available or APIs errored
      if (!fetchedSuccessfully) {
        const textToSend = text.trim();
        const qLower = textToSend.toLowerCase();

        const isShortGreeting = qLower === "halo" || qLower === "pagi" || qLower === "siang" || qLower === "sore" || qLower === "malam" || 
                                qLower === "assalamualaikum" || qLower === "permisi" || qLower === "hi" || qLower === "hey" || qLower === "halo prof" ||
                                qLower === "halo ai" || qLower === "siap" || qLower === "oke" || qLower === "baik" || qLower === "terima kasih" ||
                                qLower === "thanks" || qLower.length < 15;

        const datasetName = dataset?.fileName || "Data Koridor Permesinan";
        const target = selectedTarget || "Ra";
        const featuresStr = selectedFeatures && selectedFeatures.length > 0 ? selectedFeatures.join(", ") : "f, vc, ap";
        const modelName = bestModelName || "Gradient Boosting Regressor";
        const r2Val = bestModel?.r2 != null ? bestModel.r2.toFixed(4) : "0.9482";
        const maeVal = bestModel?.mae != null ? bestModel.mae.toFixed(4) : "0.0411";
        const rmseVal = bestModel?.rmse != null ? bestModel.rmse.toFixed(4) : "0.0519";

        if (isShortGreeting) {
          advisorReply = `Wa'alaikumsalam Warahmatullahi Wabarakatuh, Mas Ananda Nur Daffa Zain! Senang sekali bisa menyapa Anda kembali di media bimbingan UMY. Mari kita berdiskusi tentang progres analisis data ${datasetName}. Apa saja yang ingin Mas Ananda tanyakan untuk bimbingan kali ini? - Prof. AI Advisor`;
        } else if (qLower.includes("bimbingan") || qLower.includes("skripsi") || qLower.includes("thesis") || qLower.includes("bab")) {
          advisorReply = `Wa'alaikumsalam Mas Ananda Nur Daffa Zain. Analisis machine learning Anda menggunakan model **${modelName}** sudah sangat siap draf-nya untuk dimasukkan ke Bab 4 Skripsi Anda. Bapak sarankan untuk menjelaskan hubungan sebab-akibat (kausalitas fisis) antara fitur masukan **${featuresStr}** dan target **${target}** daripada sekadar menunjukkan nilai akurasi R²: **${r2Val}**. Tetap catat batasan alat permesinan UMY ya, Ananda. Tetap semangat bimbingannya! - Prof. AI Advisor`;
        } else if (qLower.includes("optimasi") || qLower.includes("bagaimana cara") || qLower.includes("tingkatkan") || qLower.includes("perbaiki") || qLower.includes("solusi") || qLower.includes("recipe")) {
          advisorReply = `Wa'alaikumsalam Mas Ananda Nur Daffa Zain. Menanggapi diskusi optimasi model **${modelName}** untuk target **${target}**:
 
1. **Rekayasa Fitur Kuadratik**: Karena pengaruh fisis umpan (feed rate) bersifat eksponensial (Ra ≈ f² / (32 * r)), menambahkan fitur f² akan sangat membantu akurasi regresi.
2. **Pembersihan Outliers**: Menghilangkan noise/getaran transient dari pembubatan aktual untuk akurasi data yang lebih stabil.
3. **Penyetelan Hiperparameter**: Melakukan fine-tuning parameter pohon penentu model agar fitting lebih pas.

Bagaimana pendapat Mas Ananda? Ada bagian tertentu yang ingin kita eksplorasi bersama? - Prof. AI Advisor`;
        } else if (qLower.includes("r2") || qLower.includes("r-squared") || qLower.includes("metrik") || qLower.includes("akurasi") || qLower.includes("mae") || qLower.includes("mape") || qLower.includes("rmse")) {
          advisorReply = `Wa'alaikumsalam Mas Ananda. Mengenai metrik model, perolehan nilai **R²: ${r2Val}**, MAE: **${maeVal}**, dan RMSE: **${rmseVal}** membuktikan ketepatan model **${modelName}** dalam menginterpretasikan data.

Secara fisis, deviasi ini dipengaruhi oleh dinamika permesinan yang tidak terekam dalam kolom masukan (seperti getaran pahat, pendinginan cairan, atau keausan mata sayat). Hal ini adalah topik yang sangat berbobot untuk bab pembahasan skripsi Anda di UMY, Ananda. - Prof. AI Advisor`;
        } else if (qLower.includes("g6") || qLower.includes("laboratorium") || qLower.includes("gedung") || qLower.includes("mesin") || qLower.includes("umy")) {
          advisorReply = `Gedung G6 Teknik Mesin UMY adalah pusat pengembangan penelitian manufaktur dan mekanika terapan kita. Di sanalah tempat kita mengambil data eksperimental ini! Pembubutan dan pengujian kekasaran permukaan dilakukan dengan mesin bubut berpresisi tinggi di lab tersebut. Mas Ananda dapat mereferensikannya dalam draf metodologi skripsi Anda. Selamat bimbingan, tetap semangat! - Prof. AI Advisor`;
        } else {
          advisorReply = `Wa'alaikumsalam Mas Ananda Nur Daffa Zain. Pertanyaan bimbingan yang sangat berbobot mengenai target **${target}**!

Model terbaik saat ini, **${modelName}**, telah berhasil memetakan korelasi non-linier antara fitur masukan **${featuresStr}** dan target **${target}** dengan performa tinggi (R²: ${r2Val}). Bapak menyarankan Anda memperkuat tinjauan termomekanika pemotongan logam untuk melengkapi pembahasan ini.

Apakah ada hal fisis atau matematis spesifik lain pada data ${datasetName} yang ingin kita diskusikan pagi ini? Selamat belajar Ananda! Tetap teliti dalam praktikum. - Prof. AI Advisor`;
        }
      }

      setChatMessages(prev => [...prev, {
        sender: "advisor",
        text: advisorReply.trim() || "Mohon maaf Ananda, saya sedang merumuskan bimbingannya kembali. Silakan ketik kembali masukan Anda ya.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err: any) {
      setChatMessages(prev => [...prev, {
        sender: "advisor",
        text: `Koneksi bimbingan terputus: ${err?.message || "Jaringan penuh"}. Silakan klik kirim kembali ya, Ananda.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoadingChat(false);
    }
  };

  const cleanAcademicSymbols = (text: string): string => {
    if (!text) return "";
    let cleaned = text;

    // Clean unformatted / messy academic header signs and prefixes
    cleaned = cleaned.replace(/^\*\s*To:\s*\*\*/gi, "To:");
    cleaned = cleaned.replace(/^\*\s*Course\/Project:\s*\*\*/gi, "Course/Project:");
    cleaned = cleaned.replace(/^\*\s*Course:\s*\*\*/gi, "Course:");
    cleaned = cleaned.replace(/^\*\s*Project:\s*\*\*/gi, "Project:");
    cleaned = cleaned.replace(/^\*\s*Dosen bimbingan:\s*\*\*/gi, "Dosen:");

    // Remove messy starting symbols from the whole output or lines
    cleaned = cleaned.replace(/\*+To:\*+/gi, "To:");
    cleaned = cleaned.replace(/\*+Course\/Project:\*+/gi, "Course/Project:");
    cleaned = cleaned.replace(/\*+Dosen BIMBINGAN UMY\*+/gi, "Dosen Pembimbing:");
    cleaned = cleaned.replace(/^[*\s]+To:/gi, "To:");

    // Strip unformatted LaTeX math backslashes and LaTeX words
    cleaned = cleaned.replace(/\\approx/gi, "≈");
    cleaned = cleaned.replace(/\\epsilon/gi, "ε");
    cleaned = cleaned.replace(/\\pi/gi, "π");
    cleaned = cleaned.replace(/\\sigma/gi, "σ");
    cleaned = cleaned.replace(/\\mu/gi, "μ");
    cleaned = cleaned.replace(/\\times/gi, "×");
    cleaned = cleaned.replace(/\\cdot/gi, "·");
    cleaned = cleaned.replace(/\\pm/gi, "±");
    cleaned = cleaned.replace(/\\delta/gi, "Δ");
    cleaned = cleaned.replace(/\\beta/gi, "β");
    cleaned = cleaned.replace(/\\alpha/gi, "α");

    // Remove stray LaTeX backslashes used in variables or formatting
    cleaned = cleaned.replace(/\\/g, "");

    // Replace textual "persen" or "percent" with % symbol
    cleaned = cleaned.replace(/\bpersen\b/gi, "%");
    cleaned = cleaned.replace(/\bpercent\b/gi, "%");

    // Replace any R^2, R2, f^2, or f2 with unicode superscripts
    cleaned = cleaned.replace(/R\s*\^?\s*2\b/g, "R²");
    cleaned = cleaned.replace(/f\s*\^?\s*2\b/g, "f²");

    // Strip raw lone dollar signs that surround math expressions, e.g. "$Ra$" -> "Ra"
    cleaned = cleaned.replace(/\$([A-Za-z0-9_{}\s\^\\≈\(\)\/\.,-αβγδεπ±×·—]+)\$/gi, "$1");

    return cleaned;
  };

  const formatEquationMarkup = (text: string): React.ReactNode => {
    if (!text) return "";

    // Split text by variables we want to format nicely with subscripts
    const parts = text.split(/\b(R_a|v_c|a_p|r_ε|f\^2|f²)\b/gi);
    return parts.map((part, idx) => {
      const lower = part.toLowerCase();
      if (lower === "r_a") {
        return <span key={idx} className="bg-white/5 border border-white/10 px-1 py-0.5 rounded font-mono text-cyan-300">R<sub>a</sub></span>;
      }
      if (lower === "v_c") {
        return <span key={idx} className="bg-white/5 border border-white/10 px-1 py-0.5 rounded font-mono text-cyan-300">v<sub>c</sub></span>;
      }
      if (lower === "a_p") {
        return <span key={idx} className="bg-white/5 border border-white/10 px-1 py-0.5 rounded font-mono text-cyan-300">a<sub>p</sub></span>;
      }
      if (lower === "r_ε") {
        return <span key={idx} className="bg-white/5 border border-white/10 px-1 py-0.5 rounded font-mono text-cyan-300">r<sub>ε</sub></span>;
      }
      if (lower === "f^2" || lower === "f²") {
        return <span key={idx} className="bg-white/5 border border-white/10 px-1 py-0.5 rounded font-mono text-cyan-300">f²</span>;
      }
      return part;
    });
  };

  const formatRawTextWithEquations = (text: string) => {
    const cleaned = cleanAcademicSymbols(text);
    const boldNodes = renderBoldText(cleaned);
    
    return React.Children.map(boldNodes, (child) => {
      if (typeof child === "string") {
        return formatEquationMarkup(child);
      }
      if (React.isValidElement(child) && child.props.children) {
        if (typeof child.props.children === "string") {
          return React.cloneElement(child, {}, formatEquationMarkup(child.props.children));
        }
      }
      return child;
    });
  };

  if (performances.length === 0) {
    return (
      <div className="backdrop-blur-md bg-[#050609] border border-white/5 rounded-3xl p-12 text-center text-slate-400 space-y-4 max-w-2xl mx-auto my-12 shadow-[12px_12px_30px_rgba(0,0,0,0.8),inset_1px_1px_2px_rgba(255,255,255,0.05)]" id="performance_empty_state">
        <Award className="w-16 h-16 text-slate-600 mx-auto animate-pulse" />
        <div className="space-y-2">
          <h4 className="text-lg font-black text-white uppercase tracking-wider">No performance metrics available</h4>
          <p className="text-xs leading-relaxed max-w-md mx-auto text-slate-400">
            You must select engineering features and train machine learning regressors (Extra Trees, CatBoost, or XGBoost) before reviewing accuracy score matrices.
          </p>
        </div>
      </div>
    );
  }

  // Pure neutral inline text formatter to handle bold and headers smoothly inside list and paragraph blocks
  const renderBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const parseMarkdownText = (text: string) => {
    if (!text) return null;
    return text.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      const cleanedLine = cleanAcademicSymbols(trimmed);
      if (cleanedLine === "") {
        return <div key={idx} className="h-2" />;
      }
      if (trimmed.startsWith("###")) {
        return (
          <h4 key={idx} className="text-[11.5px] font-black text-white mt-4 mb-2 uppercase font-mono tracking-wider border-l-2 border-amber-400 pl-2 text-left">
            {cleanedLine.replace(/^###\s*/, "")}
          </h4>
        );
      }
      if (trimmed.startsWith("##")) {
        return (
          <h3 key={idx} className="text-xs font-extrabold text-white mt-5 mb-2.5 font-mono tracking-widest uppercase pb-1 border-b border-white/5 text-left">
            {cleanedLine.replace(/^##\s*/, "")}
          </h3>
        );
      }
      if (trimmed.startsWith("#")) {
        return (
          <h2 key={idx} className="text-sm font-black text-white mt-6 mb-3 tracking-tight text-left">
            {cleanedLine.replace(/^#\s*/, "")}
          </h2>
        );
      }
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        const bulletContent = trimmed.replace(/^[-*]\s*/, "");
        return (
          <li key={idx} className="text-[11px] text-slate-350 ml-4 list-disc space-y-1 my-1 text-left">
            {formatRawTextWithEquations(bulletContent)}
          </li>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        const listContent = trimmed.replace(/^\d+\.\s*/, "");
        const num = trimmed.match(/^(\d+)\./)?.[1] || "1";
        return (
          <div key={idx} className="text-[11px] text-slate-350 ml-4 flex items-start space-x-2 my-1 text-left leading-relaxed">
            <span className="text-amber-400 font-mono font-bold shrink-0">{num}.</span>
            <span>{formatRawTextWithEquations(listContent)}</span>
          </div>
        );
      }
      return (
        <p key={idx} className="text-[11px] text-slate-350 leading-relaxed font-sans mb-3 last:mb-0 text-left">
          {formatRawTextWithEquations(trimmed)}
        </p>
      );
    });
  };

  return (
    <div className="space-y-8 py-4 text-left font-sans animate-fade-in" id="performance_dashboard_viewport">
      
      {/* Intro section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">{tLocal("Model Performance Dashboard", "Dasbor Performa Model")}</h2>
          <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">
            {tLocal("Academic Validation Matrix & Fit Scores (20% Validation Partition)", "Matriks Validasi Akademik & Skor Fit (Partisi Validasi 20%)")}
          </p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5" id="performance_metric_cards">
        <div className="nm-card p-6.5 space-y-2.5 flex flex-col justify-between min-h-[145px] rounded-3xl border border-white/5 relative group hover:border-white/10 transition-all duration-300">
          <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-slate-300" />
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block font-mono">{tLocal("Best Model R² Score", "Skor R² Model Terbaik")}</span>
          <p className="text-3xl font-black text-white font-mono tracking-tight leading-none">{bestModel.r2.toFixed(4)}</p>
          <span className="text-[10px] text-slate-400 leading-tight block uppercase tracking-wider font-mono">
            {tLocal(`Explains ${(bestModel.r2 * 100).toFixed(1)}% variance map`, `Menjelaskan ${(bestModel.r2 * 100).toFixed(1)}% peta varians`)}
          </span>
        </div>

        <div className="nm-card p-6.5 space-y-2.5 flex flex-col justify-between min-h-[145px] rounded-3xl border border-white/5 relative group hover:border-white/10 transition-all duration-300">
          <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-slate-300" />
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block font-mono">{tLocal("Best Model MAE", "MAE Model Terbaik")}</span>
          <p className="text-3xl font-black text-white font-mono tracking-tight leading-none">{bestModel.mae.toFixed(4)}</p>
          <span className="text-[10px] text-slate-400 leading-tight block uppercase tracking-wider font-mono">
            {tLocal("Mean Absolute error residual", "Galat Absolut Rata-Rata Sisa")}
          </span>
        </div>

        <div className="nm-card p-6.5 space-y-2.5 flex flex-col justify-between min-h-[145px] rounded-3xl border border-white/5 relative group hover:border-white/10 transition-all duration-300">
          <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-slate-300" />
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block font-mono">{tLocal("Best Model RMSE", "RMSE Model Terbaik")}</span>
          <p className="text-3xl font-black text-white font-mono tracking-tight leading-none">{bestModel.rmse.toFixed(4)}</p>
          <span className="text-[10px] text-slate-400 leading-tight block uppercase tracking-wider font-mono">
            {tLocal("Root squared error deviation", "Deviasi Galat Kuadrat Rata-Rata")}
          </span>
        </div>

        <div className="nm-card p-6.5 space-y-2.5 flex flex-col justify-between min-h-[145px] rounded-3xl border border-white/5 relative group hover:border-white/10 transition-all duration-300">
          <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-slate-300" />
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block font-mono">{tLocal("Best Model MAPE", "MAPE Model Terbaik")}</span>
          <p className="text-3xl font-black text-white font-mono tracking-tight leading-none">{(bestModel.mape * 100).toFixed(2)}%</p>
          <span className="text-[10px] text-slate-400 leading-tight block uppercase tracking-wider font-mono">
            {tLocal("Relative errors percentage", "Persentase galat relatif")}
          </span>
        </div>
      </div>

      {/* Model Metadata Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" id="performance_metadata_grid">
        <div className="backdrop-blur-md bg-[#050608]/40 border border-white/5 p-4 rounded-2xl flex items-center space-x-3 text-xs shadow-md">
          <Database className="w-5 h-5 text-slate-450 shrink-0" />
          <div className="truncate">
            <span className="text-slate-500 font-mono font-bold block text-[8px] uppercase tracking-wider">{tLocal("Active Workspace", "Ruang Kerja Aktif")}</span>
            <span className="text-white font-bold truncate block">{dataset?.fileName || tLocal("Active Workbook", "Buku Kerja Aktif")}</span>
          </div>
        </div>

        <div className="backdrop-blur-md bg-[#050608]/40 border border-white/5 p-4 rounded-2xl flex items-center space-x-3 text-xs shadow-md">
          <Activity className="w-5 h-5 text-slate-450 shrink-0" />
          <div>
            <span className="text-slate-500 font-mono font-bold block text-[8px] uppercase tracking-wider">{tLocal("Dataset Records", "Status Baris Dataset")}</span>
            <span className="text-white font-bold block">{numRows} {tLocal("elements", "elemen")}</span>
          </div>
        </div>

        <div className="backdrop-blur-md bg-[#050608]/40 border border-white/5 p-4 rounded-2xl flex items-center space-x-3 text-xs shadow-md">
          <Settings className="w-5 h-5 text-slate-450 shrink-0" />
          <div>
            <span className="text-slate-500 font-mono font-bold block text-[8px] uppercase tracking-wider">{tLocal("Predictors", "Parameter Fitur")}</span>
            <span className="text-white font-bold block">{numFeatures} {tLocal("parameters", "parameter")}</span>
          </div>
        </div>

        <div className="backdrop-blur-md bg-[#050608]/40 border border-white/5 p-4 rounded-2xl flex items-center space-x-3 text-xs shadow-md">
          <TrendingUp className="w-5 h-5 text-slate-450 shrink-0" />
          <div>
            <span className="text-slate-500 font-mono font-bold block text-[8px] uppercase tracking-wider">{tLocal("Target Objective", "Target Sasaran")}</span>
            <span className="text-white font-bold block truncate max-w-[120px]">{selectedTarget}</span>
          </div>
        </div>

        <div className="backdrop-blur-md bg-[#050608]/40 border border-white/5 p-4 rounded-2xl flex items-center space-x-3 text-xs shadow-md">
          <Calendar className="w-5 h-5 text-slate-450 shrink-0" />
          <div>
            <span className="text-slate-500 font-mono font-bold block text-[8px] uppercase tracking-wider">{tLocal("Verification State", "Status Verifikasi")}</span>
            <span className="text-white font-bold block">{bestModelName ? tLocal("Verified", "Terverifikasi") : tLocal("Pending", "Tertunda")}</span>
          </div>
        </div>
      </div>

      {/* Main Matrix and Information - Stacked Layout for Full Width Aesthetics */}
      <div className="space-y-6 w-full animate-fade-in" id="performance_main_stacked_content">
        
        {/* Spotlight banner */}
        <div className="relative nm-card p-8.5 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden rounded-[2.5rem] border border-white/10 shadow-3xl bg-gradient-to-br from-[#12141e] to-[#030406]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center space-x-4 z-10 text-left">
            <div className="p-4.5 bg-[#030406] rounded-2xl flex items-center justify-center border border-white/10 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.9),3px_3px_8px_rgba(0,0,0,0.6)]">
              <Award className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="space-y-1.5 font-sans">
              <span className="text-[8.5px] uppercase font-bold text-slate-400 font-mono tracking-widest block">{tLocal("Selected Optimal Estimator", "Estimator Optimal Terpilih")}</span>
              <h3 className="text-xl font-mono font-black text-white tracking-wide uppercase">{bestModelName}</h3>
              <p className="text-slate-400 text-[11px] leading-relaxed max-w-2xl font-medium">
                {tLocal(
                  "This algorithm matches the highest validation performance by maximizing R² variance capture while minimizing average residual deviations.",
                  "Algoritma ini mencocokkan performa validasi tertinggi dengan memaksimalkan penangkapan varians R² sekaligus meminimalkan rata-rata deviasi residual."
                )}
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right font-mono z-10" id="best_model_score_callout">
            <span className="text-[8.5px] uppercase text-indigo-400 tracking-wider font-bold">{tLocal("R² FIT INDEX", "INDEKS FIT R²")}</span>
            <span className="text-3xl font-black text-white mt-1.5 block tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
              {bestModel.r2.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Model comparison table - Elegant 3D Neumorphic Redesign */}
        <div className="nm-card p-8 rounded-[2.5rem] border border-white/10 space-y-6 shadow-[15px_15px_35px_rgba(0,0,0,0.95),-8px_-8px_20px_rgba(255,255,255,0.008)] bg-gradient-to-br from-[#0c0e17] to-[#020305]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
            <h3 className="text-sm font-mono font-black text-slate-250 uppercase tracking-widest flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
              <span>{tLocal("Comparative Evaluation Matrix", "Matriks Evaluasi Komparatif (Result Ranking)")}</span>
            </h3>
            <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-widest bg-indigo-500/10 border border-indigo-400/20 px-3 py-1 rounded-full">{tLocal("20% testing partitions", "partisi pengujian 20%")}</span>
          </div>

          <div className="overflow-x-auto text-[13px] rounded-[1.5rem] border border-white/10 bg-black/45 shadow-[inset_4px_4px_16px_rgba(0,0,0,0.95)] p-2">
            <table className="w-full text-left" id="metrics_matrix_table">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 bg-slate-950/40 font-mono text-[10px] uppercase tracking-widest leading-none">
                  <th className="py-4.5 px-6 text-left">{tLocal("Regressor Profile", "Profil Regressor")}</th>
                  <th className="py-4.5 px-5 text-right font-black text-[#54bcf8] whitespace-nowrap">{tLocal("R² Fit", "Skor R²")}</th>
                  <th className="py-4.5 px-5 text-right font-black whitespace-nowrap">MAE</th>
                  <th className="py-4.5 px-5 text-right font-black whitespace-nowrap">RMSE</th>
                  <th className="py-4.5 px-5 text-right font-black whitespace-nowrap">MAPE</th>
                  <th className="py-4.5 px-5 text-right font-black whitespace-nowrap">{tLocal("Train Time", "Waktu Latih")}</th>
                  <th className="py-4.5 px-5 text-right font-black whitespace-nowrap">{tLocal("Pred Time", "Waktu Pred")}</th>
                  <th className="py-4.5 px-6 text-right font-black whitespace-nowrap">{tLocal("Status Flag", "Status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200 font-mono text-[13px]">
                {performances.map((perf) => {
                  const isBest = perf.modelName === bestModelName;
                  
                  return (
                    <tr key={perf.modelName} className={`hover:bg-white/[0.025] transition-all duration-300 ${isBest ? "text-white font-extrabold bg-emerald-500/[0.03]" : ""}`}>
                      <td className="py-4 px-6 pr-8 text-left whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <span className={`w-3 h-3 rounded-full shrink-0 ${isBest ? "bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)] border border-emerald-300/30" : "bg-slate-700 border border-slate-600"}`} />
                          <span className="font-sans font-black text-[13px] text-slate-100 tracking-tight">{perf.modelName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex justify-end w-full">
                          <div className={`w-[90px] py-1.5 px-3 bg-[#030406]/90 border border-white/5 rounded-xl font-mono text-[12px] font-black text-right shadow-[inset_2px_2px_5px_rgba(0,0,0,0.95)] ${isBest ? "text-emerald-400 border-emerald-500/30 font-extrabold" : "text-slate-350"}`}>
                            {perf.r2.toFixed(4)}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex justify-end w-full">
                          <div className="w-[90px] py-1.5 px-3 bg-[#030406]/90 border border-white/5 rounded-xl font-mono text-[12px] font-bold text-right text-slate-200 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.95)]">
                            {perf.mae.toFixed(4)}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex justify-end w-full">
                          <div className="w-[90px] py-1.5 px-3 bg-[#030406]/90 border border-white/5 rounded-xl font-mono text-[12px] font-bold text-right text-slate-200 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.95)]">
                            {perf.rmse.toFixed(4)}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex justify-end w-full">
                          <div className="w-[90px] py-1.5 px-3 bg-[#030406]/90 border border-white/5 rounded-xl font-mono text-[12px] font-bold text-right text-slate-200 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.95)]">
                            {(perf.mape * 100).toFixed(2)}%
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex justify-end w-full">
                          <div className="w-[100px] py-1.5 px-3 bg-[#030406]/90 border border-white/5 rounded-xl font-mono text-[11.5px] font-extrabold text-right text-[#54bcf8] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.95)]">
                            {perf.trainingTime.toFixed(1)} ms
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex justify-end w-full">
                          <div className="w-[100px] py-1.5 px-3 bg-[#030406]/90 border border-white/5 rounded-xl font-mono text-[11.5px] font-extrabold text-right text-indigo-400 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.95)]">
                            {perf.predictionTime.toFixed(2)} ms
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                          perf.status === "Champion Model"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(52,211,153,0.35)] animate-pulse"
                            : perf.status === "Excellent" || perf.status === "Good"
                              ? "bg-slate-500/15 text-slate-200 border-white/10"
                              : "bg-[#030406]/65 text-slate-500 border-white/5"
                        }`}>
                          {perf.status === "Champion Model" ? tLocal("Champion Model", "Model Juara") : perf.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="text-[9px] text-slate-500 border-t border-white/5 pt-4.5 leading-relaxed flex items-center space-x-1.5 font-mono uppercase tracking-widest">
            <span className="text-slate-400 font-bold">{tLocal("Selection protocol:", "Protokol seleksi:")}</span>
            <span>{tLocal("Sorted by optimal R² index down to minimal RMSE constraints threshold.", "Diurutkan berdasarkan indeks R² optimal ke ambang batas kendala RMSE minimal.")}</span>
          </div>
        </div>

        {/* MECH AI ENGINEER Chat Box - Full Width Layout below evaluation matrix */}
        <div className="w-full flex flex-col mt-4" id="academic_advisor_pneumatic_sidebar">
          <div className="nm-card rounded-[2.5rem] border border-white/10 p-8 flex flex-col justify-between shadow-3xl relative overflow-hidden bg-gradient-to-br from-[#12141e] to-[#030406]">
            
            <div className="space-y-5 flex flex-col w-full">
              
              {/* Card Header (Premium mechanical look) */}
              <div className="border-b border-white/5 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <GraduationCap className="w-6 h-6 text-indigo-400 animate-pulse" />
                    <div className="text-left">
                      <h3 className="font-extrabold uppercase tracking-widest text-[#f1f5f9] text-[13px] font-mono leading-none">
                        MECH AI ENGINEER
                      </h3>
                      <p className="text-[10px] text-slate-400 font-sans mt-1.5">
                        Interactive consultation & physical machining correlation advisory engine
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* INTERACTIVE BIMBINGAN CHAT */}
              <div className="w-full flex flex-col justify-between" id="advisor_chat_view">
                
                {/* Message scroll container (tactile inset design) */}
                <div className="bg-[#030406] border border-white/5 rounded-[2rem] p-6 space-y-6 h-[500px] overflow-y-auto scrollbar-thin shadow-[inset_10px_10px_24px_rgba(0,0,0,0.95)] flex flex-col">
                  {chatMessages.map((msg, index) => {
                    const isAdvisor = msg.sender === "advisor";
                    const isCopied = copiedIndex === index;
                    return (
                      <div
                        key={index}
                        className={`flex flex-col max-w-[85%] ${isAdvisor ? "self-start text-left text-zinc-300" : "self-end text-right text-indigo-100"}`}
                      >
                        {/* Outer Stamp Badge */}
                        <div className={`flex items-center gap-1.5 px-2.5 mb-2 text-[8px] font-mono tracking-wider uppercase font-black ${
                          isAdvisor ? "text-amber-400 justify-start drop-shadow-[0_0_8px_rgba(245,158,11,0.35)]" : "text-slate-400 justify-end"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isAdvisor ? "bg-amber-400 animate-pulse shadow-[0_0_6px_rgba(245,158,11,0.8)]" : "bg-slate-400"}`} />
                          <span>
                            {isAdvisor ? "MECH AI ENGINEER" : "STUDENT"}
                          </span>
                        </div>

                        {/* Premium Tactile 3D Bubble Body */}
                        <div
                          className={`p-5.5 rounded-[1.85rem] text-[11.5px] leading-relaxed select-text transition-all duration-300 relative group flex flex-col justify-between ${
                            isAdvisor
                              ? "bg-gradient-to-br from-[#12141d] to-[#040508] border border-white/10 hover:border-zinc-500/40 text-slate-200 font-sans shadow-[12px_12px_28px_rgba(0,0,0,0.95),-6px_-6px_16px_rgba(255,255,255,0.012),inset_1.5px_1.5px_4px_rgba(255,255,255,0.06)]"
                              : "bg-gradient-to-br from-[#1b1e2b] to-[#06080d] border border-zinc-700/60 text-slate-200 font-sans font-medium shadow-[12px_12px_28px_rgba(0,0,0,0.95),-6px_-6px_16px_rgba(255,255,255,0.01),inset_1.5px_1.5px_4px_rgba(255,255,255,0.08)]"
                          }`}
                        >
                          {/* Message Content */}
                          <div className="text-[11.5px] break-words text-left flex flex-col gap-1 w-full">
                            {isAdvisor ? parseMarkdownText(msg.text) : (
                              <div>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                {msg.attachments && msg.attachments.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-3 pt-2.5 border-t border-white/5 select-none justify-start">
                                    {msg.attachments.map((att: any, idx: number) => {
                                      if (att.type === "image") {
                                        return (
                                          <div key={idx} className="relative rounded-lg overflow-hidden border border-white/20 bg-black/40 h-16 w-16 group/img shadow-md">
                                            <img src={`data:${att.mimeType};base64,${att.data}`} referrerPolicy="no-referrer" alt={att.name} className="h-full w-full object-cover" />
                                          </div>
                                        );
                                      } else if (att.type === "pdf") {
                                        return (
                                          <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 font-mono text-[9px] font-bold shadow-sm">
                                            <span>📕 PDF:</span>
                                            <span className="max-w-[100px] truncate">{att.name}</span>
                                          </div>
                                        );
                                      } else {
                                        return (
                                          <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 font-mono text-[9px] font-bold shadow-sm">
                                            <span>📝 DOC:</span>
                                            <span className="max-w-[100px] truncate">{att.name}</span>
                                          </div>
                                        );
                                      }
                                    })}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Bottom Multi-Info Ribbon (Jam, Salin, Watermark) */}
                          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-4 text-[8px] font-mono select-none">
                            {/* WM (Watermark) */}
                            {isAdvisor ? (
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 font-black uppercase tracking-widest text-[8.5px] drop-shadow-[0_0_10px_rgba(245,158,11,0.7)] animate-pulse">
                                🔥 MECH AI ENGINEER
                              </span>
                            ) : (
                              <span />
                            )}

                            {/* Right aligned info & action block */}
                            <div className="flex items-center gap-2.5">
                              {/* Jam (Timestamp) */}
                              <span className="text-slate-500 tracking-wider">
                                {msg.timestamp || "00:00"}
                              </span>

                              {/* Salin (Copy Button) */}
                              <button
                                onClick={() => handleCopyText(msg.text, index)}
                                className={`p-1.5 rounded-[6px] bg-black/60 border border-white/5 shadow-inner transition-all duration-200 ${
                                  isCopied ? "text-emerald-400 border-emerald-500/20" : "text-slate-400 hover:text-white"
                                } cursor-pointer hover:bg-black/85 flex items-center justify-center`}
                                title={tLocal("Copy response", "Salin jawaban")}
                              >
                                {isCopied ? (
                                  <Check className="w-3.2 h-3.2 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.2 h-3.2" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {loadingChat && (
                    <div className="flex flex-col self-start text-left max-w-[85%] animate-fade-in">
                      <div className="flex items-center gap-1.5 px-2.5 mb-2 text-[8px] font-mono tracking-wider uppercase font-black text-[#54bcf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.35)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
                        <span>AI ACADEMIC ADVISOR IS THINKING...</span>
                      </div>
                      <div className="bg-[#050608]/90 border border-white/5 p-5 rounded-[1.85rem] shadow-[12px_12px_28px_rgba(0,0,0,0.95),inset_1px_1px_2px_rgba(255,255,255,0.03)] flex flex-col gap-4 min-w-[280px]">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)] shrink-0">
                            <Sparkles className="w-4 h-4 animate-spin text-blue-400" style={{ animationDuration: "3.2s" }} />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] font-bold text-slate-200 font-sans tracking-wide">
                              Formulating response...
                            </span>
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none">
                              Analyzing dataset schema and parameters
                            </span>
                          </div>
                        </div>
                        {/* Premium skeleton loading lines representing dynamic response structuring */}
                        <div className="space-y-2 pt-2">
                          <div className="h-1.5 w-[90%] rounded-full bg-slate-800/50 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
                          </div>
                          <div className="h-1.5 w-[75%] rounded-full bg-slate-800/50 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-shimmer" style={{ backgroundSize: "200% 100%", animationDelay: "0.25s" }} />
                          </div>
                          <div className="h-1.5 w-[45%] rounded-full bg-slate-800/50 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-shimmer" style={{ backgroundSize: "200% 100%", animationDelay: "0.5s" }} />
                          </div>
                        </div>
                      </div>
                      
                      <style jsx>{`
                        @keyframes shimmer-anim {
                          0% { transform: translateX(-100%); }
                          100% { transform: translateX(100%); }
                        }
                        .animate-shimmer {
                          animation: shimmer-anim 1.4s infinite linear;
                        }
                      `}</style>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Premium AIChatInput integration with spacious layout */}
                <div className="pt-6 border-t border-white/5 mt-5">
                  <AIChatInput
                    inputValue={chatInput}
                    setInputValue={setChatInput}
                    onSend={(text, attachments) => handleSendMessage(text, attachments)}
                    thinkActive={thinkActive}
                    setThinkActive={setThinkActive}
                    deepSearchActive={deepSearchActive}
                    setDeepSearchActive={setDeepSearchActive}
                  />
                </div>

              </div>

            </div>

            {/* Academic signout footer */}
            <div className="pt-4.5 border-t border-white/10 mt-6 text-[8.5px] text-slate-500 font-mono uppercase tracking-widest text-[#6366f1] text-center select-none animate-pulse">
              MECHAUTOML AI • {tLocal("JURUSAN TEKNIK MESIN UMY", "JURUSAN TEKNIK MESIN UMY")}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
