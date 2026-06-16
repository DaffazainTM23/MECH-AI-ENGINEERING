"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, LayoutGrid, Play, Pause, Sparkles, BookMarked } from "lucide-react";

export interface Testimonial {
  text: string;
  name: string;
  initials: string;
}

export const lecturersData: Testimonial[] = [
  {
    name: "Dr. Ir. Mudjijana, M.Eng.",
    text: "“MECH AI ENGINEER dapat menjadi media pembelajaran yang baik untuk memahami hubungan antara data eksperimen teknik dan pemodelan prediktif berbasis machine learning.”",
    initials: "M"
  },
  {
    name: "Krisdiyanto, S.T., M.Eng., Ph.D.",
    text: "“Platform ini menarik karena membantu mahasiswa mengevaluasi performa beberapa model prediksi secara langsung melalui data teknik yang mereka unggah sendiri.”",
    initials: "K"
  },
  {
    name: "Rela Adi Himarosa, S.T., M.Eng.",
    text: "“Sistem prediksi berbasis dataset seperti ini dapat melatih mahasiswa untuk memahami pentingnya kualitas data, pemilihan fitur, dan interpretasi hasil model.”",
    initials: "RA"
  },
  {
    name: "Tri Wahyono, S.Pd., M.Pd.",
    text: "“MECH AI ENGINEER dapat mendukung proses pembelajaran AI karena alurnya jelas, mulai dari upload dataset, preprocessing, training model, hingga evaluasi hasil.”",
    initials: "TW"
  },
  {
    name: "Ir. Berli Paripurna Kamiel, S.T., M.Eng.Sc., Ph.D.",
    text: "“Penggunaan machine learning dalam analisis data teknik menjadi semakin penting, terutama untuk membantu mahasiswa memahami pola data eksperimen secara lebih terukur.”",
    initials: "BK"
  },
  {
    name: "Ir. Aris Widyo Nugroho, S.T., M.T., Ph.D.",
    text: "“Website ini dapat menjadi sarana eksplorasi data teknik yang baik karena menyediakan model pembanding dan visualisasi hasil prediksi.”",
    initials: "AN"
  },
  {
    name: "Prof. Dr. Ir. Sukamta, S.T., M.T., IPU., ASEAN Eng.",
    text: "“Integrasi AI dalam bidang teknik mesin perlu diarahkan sebagai alat bantu analisis, bukan pengganti validasi teori dan eksperimen.”",
    initials: "S"
  },
  {
    name: "Prof. Drs. Sudarisman, M.S. Mechs., Ph.D.",
    text: "“Pendekatan berbasis data seperti ini dapat membantu mahasiswa memahami hubungan antara variabel teknik dan hasil pengujian secara lebih sistematis.”",
    initials: "SD"
  },
  {
    name: "Dr. Ir. Cahyo Budiyantoro, S.T., M.Sc., IPM.",
    text: "“Platform ini relevan untuk pembelajaran teknik karena menggabungkan proses komputasi, pemodelan, visualisasi, dan evaluasi performa model.”",
    initials: "CB"
  },
  {
    name: "Sunardi, S.T., M.Eng., Ph.D.",
    text: "“MECH AI ENGINEER dapat menjadi contoh penerapan AI yang dekat dengan kebutuhan manufaktur, terutama untuk analisis data proses dan prediksi performa.”",
    initials: "SN"
  },
  {
    name: "Tito Hadji Agung Santosa, S.T., M.T.",
    text: "“Sistem ini membantu mahasiswa melihat bagaimana model machine learning dapat digunakan untuk membandingkan hasil prediksi pada berbagai data teknik.”",
    initials: "TS"
  },
  {
    name: "Dr. Ir. Sudarja, S.T., M.T., IPM., ASEAN Eng.",
    text: "“Prediksi berbasis AI harus selalu disertai pemahaman engineering judgment, sehingga hasil model tetap dapat dianalisis secara kritis.”",
    initials: "SD"
  },
  {
    name: "Ir. Muh. Budi Nur Rahman, S.T., M.Eng.",
    text: "“Penggunaan dataset teknik dalam sistem ini dapat memperkuat pemahaman mahasiswa terhadap proses analisis, evaluasi, dan optimasi parameter.”",
    initials: "BR"
  },
  {
    name: "Ir. Thoharudin, S.T., M.T., Ph.D.",
    text: "“MECH AI ENGINEER menarik karena menyediakan proses machine learning yang lengkap dari data mentah hingga hasil prediksi yang dapat divisualisasikan.”",
    initials: "T"
  },
  {
    name: "Teddy Nurcahyadi, S.T., M.Eng., Ph.D.",
    text: "“Fitur perbandingan model dan evaluasi metrik dapat membantu mahasiswa memahami bahwa setiap model memiliki karakteristik dan batasan masing-masing.”",
    initials: "TN"
  },
  {
    name: "Dr. Ir. Harini Sosiati, M.Eng.",
    text: "“Platform ini dapat digunakan sebagai media latihan untuk menghubungkan data material, proses, dan hasil pengujian dengan pendekatan prediktif.”",
    initials: "HS"
  },
  {
    name: "Dr. Ir. Totok Suwanda, S.T., M.T.",
    text: "“Penerapan AI seperti ini dapat memperkaya pembelajaran teknik mesin karena mahasiswa dapat melakukan eksperimen model secara interaktif.”",
    initials: "TS"
  },
  {
    name: "Fitroh Anugrah Kusuma Yudha, S.T., M.Eng.",
    text: "“MECH AI ENGINEER memberikan pengalaman belajar yang praktis karena mahasiswa dapat mengunggah dataset sendiri dan langsung melihat performa model.”",
    initials: "FY"
  },
  {
    name: "Dr. Muhammad Nadjib, S.T., M.Eng.",
    text: "“Sistem ini dapat membantu mahasiswa memahami bahwa prediksi teknik perlu dilihat dari akurasi model, kualitas dataset, dan kesesuaian interpretasi engineering.”",
    initials: "MN"
  }
];

const getGradientAvatar = (initials: string, index: number) => {
  const gradients = [
    "from-cyan-500 via-blue-600 to-indigo-700",
    "from-indigo-500 via-purple-600 to-pink-700",
    "from-indigo-600 via-teal-500 to-emerald-600",
    "from-blue-600 via-indigo-600 to-sky-500",
    "from-purple-600 via-violet-600 to-indigo-750"
  ];
  const gradient = gradients[index % gradients.length];
  
  return (
    <div className={`h-12 w-12 rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center text-white text-sm font-black font-mono shadow-[0_4px_12px_rgba(6,182,212,0.25)] border border-white/20 shrink-0`}>
      {initials}
    </div>
  );
};

// Continuous vertical scrolling column component
export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof lecturersData;
  duration?: number;
  pause: boolean;
}) => {
  return (
    <div className={`${props.className} overflow-hidden relative max-h-[640px] px-2`}>
      <motion.div
        animate={props.pause ? {} : {
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 14,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {props.testimonials.map((t, i) => (
                <div 
                  className="p-7 rounded-[2rem] border border-white/[0.06] bg-slate-950/80 backdrop-blur-2xl transition-all duration-300 hover:scale-[1.03] hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] flex flex-col justify-between max-w-xs sm:max-w-md w-full shadow-[12px_12px_24px_rgba(0,0,0,0.85),-4px_-4px_16px_rgba(255,255,255,0.01)]"
                  key={`${groupIndex}-${i}`}
                >
                  <div className="space-y-3 text-left">
                    <span className="text-[10px] text-indigo-400 font-mono font-black uppercase tracking-widest block">“</span>
                    <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed font-sans font-medium">
                      {t.text}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center gap-4">
                    {getGradientAvatar(t.initials, i)}
                    <div className="flex flex-col text-left">
                      <span className="font-extrabold text-white text-xs sm:text-[13px] tracking-tight leading-tight">
                        {t.name}
                      </span>
                      <span className="text-[9px] text-cyan-400 font-mono font-black uppercase mt-1 tracking-widest bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/15 inline-block w-max">
                        Academic Note
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

export function TestimonialsDemo() {
  const [viewMode, setViewMode] = useState<"grid" | "flow">("grid");
  const [pauseFlow, setPauseFlow] = useState<boolean>(false);

  // Divide the list of 19 comments evenly into 3 columns for flow or structured styling
  const col1 = lecturersData.filter((_, i) => i % 3 === 0);
  const col2 = lecturersData.filter((_, i) => i % 3 === 1);
  const col3 = lecturersData.filter((_, i) => i % 3 === 2);

  return (
    <section className="py-20 bg-black relative border-y border-white/5 select-none" id="testimonials_section_integrated">
      
      {/* Dynamic fluorescent corner glows */}
      <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/[0.03] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-cyan-500/[0.03] rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Title strictly as specified */}
        <div className="text-center space-y-4 max-w-4xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 font-mono text-[9px] font-black uppercase tracking-widest leading-none">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            PANEL AKADEMISI JURUSAN TEKNIK MESIN UMY
          </div>
          
          <h2 className="text-3xl sm:text-4.5xl font-black text-white tracking-tight uppercase leading-none font-sans">
            Academic Comments from Mechanical Engineering UMY
          </h2>
          
          <p className="text-slate-400 text-xs sm:text-sm md:text-md max-w-2xl mx-auto font-sans font-medium leading-relaxed">
            “Selected academic-style comments about AI, machine learning, and engineering data prediction.”
          </p>

          {/* Interactive Mode Toggles formatted with luxury Neumorphism layout */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="bg-[#050608] border border-white/5 p-1 rounded-2xl flex items-center shadow-[inset_6px_6px_10px_rgba(0,0,0,0.8)]">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider font-sans transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_2px_10px_rgba(99,102,241,0.2)]"
                    : "text-slate-400 hover:text-white border border-transparent"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid View</span>
              </button>
              
              <button
                onClick={() => setViewMode("flow")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider font-sans transition-all cursor-pointer ${
                  viewMode === "flow"
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_2px_10px_rgba(6,182,212,0.2)]"
                    : "text-slate-400 hover:text-white border border-transparent"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Marquee Flow</span>
              </button>
            </div>

            {viewMode === "flow" && (
              <button
                onClick={() => setPauseFlow(!pauseFlow)}
                className="p-2.5 rounded-xl border border-white/5 bg-slate-950/80 hover:bg-slate-900 hover:border-white/10 text-slate-400 hover:text-white transition-all shadow-md cursor-pointer"
                title={pauseFlow ? "Resume Scroll" : "Pause Scroll"}
              >
                {pauseFlow ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* View render router */}
        {viewMode === "grid" ? (
          /* RESPONSIVE CARD GRID: 3 columns on desktop, 2 columns on tablet, 1 column on mobile */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="lecturer_grid_view_container">
            {lecturersData.map((t, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                className="group relative p-8 rounded-[2rem] border border-white/[0.06] bg-slate-950/40 backdrop-blur-2xl transition-all duration-300 hover:scale-[1.03] hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] flex flex-col justify-between shadow-[16px_16px_36px_rgba(0,0,0,0.85),-8px_-8px_24px_rgba(255,255,255,0.015)]"
                id={`lecturer_card_${index}`}
              >
                <div className="space-y-3 flex-grow text-left">
                  <span className="text-3xl text-cyan-500/10 font-bold font-serif leading-none block">“</span>
                  <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed font-sans font-medium transition-colors group-hover:text-white">
                    {t.text}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.04] flex items-center gap-4">
                  {getGradientAvatar(t.initials, index)}
                  <div className="flex flex-col text-left">
                    <span className="font-extrabold text-white text-xs sm:text-[13px] tracking-tight group-hover:text-cyan-400 transition-colors leading-tight">
                      {t.name}
                    </span>
                    <span className="text-[9px] text-cyan-400 font-mono font-black uppercase mt-1.5 tracking-widest bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/15 inline-block w-max">
                      Academic Note
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* VERTICAL CONTINUOUS MARQUEE FLOW STREAMS */
          <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[640px] overflow-hidden">
            <TestimonialsColumn testimonials={col1} duration={16} pause={pauseFlow} className="w-full md:w-1/2 lg:w-1/3" />
            <TestimonialsColumn testimonials={col2} duration={20} pause={pauseFlow} className="hidden md:block md:w-1/2 lg:w-1/3" />
            <TestimonialsColumn testimonials={col3} duration={18} pause={pauseFlow} className="hidden lg:block lg:w-1/3" />
          </div>
        )}

      </div>
    </section>
  );
}
