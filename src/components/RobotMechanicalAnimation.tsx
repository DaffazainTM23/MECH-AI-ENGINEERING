import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GraduationCap, Award, Landmark, BookOpen, Clock, 
  MapPin, ShieldCheck, Cpu, HardHat, Compass, Box, Settings 
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { ContainerScroll } from "./ui/container-scroll-animation";

export default function RobotMechanicalAnimation() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"profil" | "laboratorium" | "riset">("profil");

  const labs = [
    {
      nama: t("lab.comp", "Laboratorium Komputer & Gambar Keahlian"),
      lokasi: "Gedung G1 & G6 Lantai 2",
      deskripsi: t("lab.comp_desc", "Pusat simulasi CAD/CAM/CAE dan optimasi desain mesin berbasis high-performance computing, tempat dikembangkannya algoritma Machine Learning & AutoML."),
      fitur: ["SolidWorks & ANSYS", "Simulasi Finite Element (FEA)", "Pemodelan Prediktif Teknik", "AI-Integrated Ingestion"]
    },
    {
      nama: t("lab.cnc", "Laboratorium CNC & Otomasi Manufaktur"),
      lokasi: "Gedung G6 Bengkel Utama",
      deskripsi: t("lab.cnc_desc", "Pengujian pembubutan CNC, milling berkecepatan tinggi, dan pemrograman otomatis mesin perkakas presisi tinggi."),
      fitur: ["Mesin CNC Rotary Lathe", "G-Code Optimization", "Sistem Otomasi Industri", "PLC & Servo Control System"]
    },
    {
      nama: t("lab.energy", "Laboratorium Konversi Energi & Fenomena Dasar"),
      lokasi: "Gedung G6 Lab Selatan",
      deskripsi: t("lab.energy_desc", "Eksperimen dinamika fluida, perpindahan kalor, mekanika mesin fluida, turbin, pompa, dan kalibrasi termal motor bakar."),
      fitur: ["Turbin Gas & Angin", "Thermodynamics Analysis", "Uji Emisi Motor Bakar", "Hydraulic Valve Research"]
    },
    {
      nama: t("lab.material", "Laboratorium Material Teknik & Metalurgi"),
      lokasi: "Gedung G1 Lantai Dasar",
      deskripsi: t("lab.material_desc", "Uji keras logam, uji tarik, metalografi, perlakuan panas (heat treatment), dan analisis struktur mikro kristal material."),
      fitur: ["Uji Hardness Rockwell/Vickers", "Tensile Test Dynamic", "Furnace Suhu Tinggi", "Microscope Digital Metallurgy"]
    }
  ];

  const risetPillars = [
    {
      icon: Cpu,
      title: t("riset.title1", "Informatika Mekanika"),
      sub: "Applied AI & ML in Mechanical S1",
      text: t("riset.text1", "Integrasi algoritma optimasi machine learning (Extra Trees, CatBoost, XGBoost) guna memprediksi keausan pahat potong CNC, laju korosi material, dan efisiensi termal sistem fluida.")
    },
    {
      icon: Settings,
      title: t("riset.title2", "Advanced Manufacturing"),
      sub: "Otomasi & Fabrikasi Presisi",
      text: t("riset.text2", "Penelitian mendalam sistem kontrol otomatis, optimasi parameter pemesinan kecepatan tinggi, dan integrasi digital twin untuk meningkatkan rekayasa manufaktur nasional.")
    },
    {
      icon: Box,
      title: t("riset.title3", "Material Berkelanjutan"),
      sub: "Composite & Biomaterials Science",
      text: t("riset.text3", "Desain, pengujian, dan karakterisasi material komposit serat alam lokal untuk aplikasi otomotif, penerbangan, dan implan biomedis ramah lingkungan.")
    }
  ];

  return (
    <div className="w-full select-none py-10 bg-gradient-to-b from-[#020306] to-[#04060d]" id="robot_mechanical_animation_module">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <ContainerScroll
          titleComponent={
            <div className="text-center max-w-4xl mx-auto space-y-6 px-4">
              {/* Ultra-Tactile 3D Soft Embossed Badge */}
              <div id="school_academic_badge" className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#050814] border border-white/5 text-indigo-300 font-mono text-[10px] font-black uppercase tracking-widest mx-auto shadow-[6px_6px_15px_rgba(0,0,0,0.8),-4px_-4px_12px_rgba(99,102,241,0.1),inset_1px_1px_1px_rgba(255,255,255,0.05)]">
                <GraduationCap className="w-4 h-4 text-cyan-400 animate-bounce" />
                <span>{t("background.badge", "Program Studi Teknik Mesin UMY • Akreditasi Unggul")}</span>
              </div>
              
              <h2 id="academic_bg_title" className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-none font-sans text-center drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)] bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                {t("background.title", "LATAR BELAKANG AKADEMIK TEKNIK MESIN UMY")}
              </h2>
              
              <p id="academic_bg_subtitle" className="text-indigo-200/80 text-xs sm:text-sm leading-relaxed max-w-3xl mx-auto font-sans font-semibold text-center tracking-normal">
                {t("background.subtitle", "Menerobos batas rekayasa dengan menyinergikan ilmu mekanika tradisional, otomasi industri, dan pengolahan data cerdas berbasis kecerdasan buatan (Artificial Intelligence).")}
              </p>
            </div>
          }
        >
          {/* Spacious Integrated Dashboard Frame with start alignment to prevent excessive stretching */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch p-2 text-left w-full h-full">
            {/* LEFT COLUMN: Majestic 3D Neumorphic Profile & Identity Board */}
            <div id="academic_faculty_sidebar" className="lg:col-span-4 flex flex-col justify-between rounded-3xl bg-[#060813] border border-white/[0.06] p-7 shadow-[15px_15px_35px_rgba(0,0,0,0.95),-10px_-10px_30px_rgba(99,102,241,0.08),inset_1px_1px_1px_rgba(255,255,255,0.04)] relative group transition-all duration-500 hover:border-indigo-500/25 h-full">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px] pointer-events-none transition-all duration-700 group-hover:bg-indigo-500/20" />
 
              <div className="space-y-6 flex-grow flex flex-col justify-between">
                {/* Embossed Institution Label */}
                <div className="space-y-3 border-b border-white/5 pb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#030408] border border-white/5 text-cyan-400 rounded-lg text-[9px] font-mono uppercase tracking-wider font-extrabold shadow-[inset_2px_2px_5px_rgba(0,0,0,0.9),1px_1px_2px_rgba(255,255,255,0.02)]">
                    <Landmark className="w-3.5 h-3.5 text-cyan-400" />
                    <span>INSTITUTION KEYNET</span>
                  </span>
                  <h3 className="text-2xl font-black text-white tracking-tight leading-tight">Teknik Mesin UMY</h3>
                  <p className="text-[10px] text-indigo-300 font-mono tracking-widest uppercase font-black">{t("background.badge_sub", "FAKULTAS TEKNIK • UNIVERSITAS MUHAMMADIYAH YOGYAKARTA")}</p>
                </div>
 
                {/* High-Fidelity 3D Debossed Spec Vault */}
                <div id="academic_specs_block" className="p-5 rounded-2xl bg-[#020205] border border-white/[0.03] shadow-[inset_4px_4px_12px_rgba(0,0,0,0.9),inset_-4px_-4px_12px_rgba(255,255,255,0.02)] space-y-4 my-auto">
                  <span className="text-[9px] font-mono font-black text-indigo-400 uppercase tracking-widest block border-b border-white/5 pb-2">SPESIFIKASI AKADEMIK</span>
 
                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 border-dashed">
                    <span className="text-slate-350 font-bold flex items-center gap-2">
                      <Award className="w-4 h-4 text-cyan-400 shrink-0" /> Akreditasi
                    </span>
                    <span className="text-cyan-400 font-mono text-xs px-2.5 py-1 rounded bg-[#050915] border border-cyan-500/20 shadow-inner font-bold uppercase">
                      UNGGUL (A)
                    </span>
                  </div>
 
                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 border-dashed">
                    <span className="text-slate-350 font-bold flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-400 shrink-0" /> Tahun Berdiri
                    </span>
                    <span className="text-slate-100 font-mono font-bold">1981 (Yogyakarta)</span>
                  </div>
 
                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 border-dashed">
                    <span className="text-slate-350 font-bold flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-purple-400 shrink-0" /> Gelar Lulusan
                    </span>
                    <span className="text-slate-100 font-semibold font-bold">Sarjana Teknik (S.T.)</span>
                  </div>
 
                  <div className="flex items-center justify-between text-xs py-1.5">
                    <span className="text-slate-350 font-bold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> Fokus AI-ML
                    </span>
                    <span className="text-emerald-400 font-mono font-black text-[11px] bg-emerald-950/25 border border-emerald-500/20 px-2 py-0.5 rounded shadow-inner animate-pulse uppercase">
                      Verified Core
                    </span>
                  </div>
                </div>
 
                <p className="text-slate-300 text-xs leading-relaxed font-sans font-medium px-1 pt-4">
                  {t("background.department_vision", "The Mechanical Engineering Department at UMY is committed to producing professionals with international competency, entrepreneurial spirit founded on noble Islamic values, and robust mastery of industry 4.0 digitalization.")}
                </p>
              </div>
            </div>
 
            {/* RIGHT COLUMN: Majestic 3D Tactile Segment Deck & Info Cards */}
            <div id="academic_research_deck" className="lg:col-span-8 flex flex-col justify-between rounded-3xl bg-[#060813] border border-white/[0.06] p-7 shadow-[15px_15px_35px_rgba(0,0,0,0.95),-10px_-10px_30px_rgba(99,102,241,0.08),inset_1px_1px_1px_rgba(255,255,255,0.04)] relative group/right transition-all duration-500 hover:border-indigo-500/25 h-full">
              <div className="space-y-6 flex-grow flex flex-col justify-between">
                
                {/* Tactile Neumorphic Tab Controller */}
                <div id="academic_tab_switcher" className="flex justify-center p-1.5 rounded-2xl bg-[#020205] border border-white/5 shadow-[inset_4px_4px_12px_rgba(0,0,0,0.95),inset_-4px_-4px_12px_rgba(255,255,255,0.01)] max-w-lg mx-auto mb-6 w-full">
                  <div className="grid grid-cols-3 gap-2 w-full font-sans text-xs">
                    <button
                      onClick={() => setActiveTab("profil")}
                      className={`py-3 px-2 rounded-xl text-center font-black tracking-wider uppercase transition-all duration-300 cursor-pointer text-[10px] md:text-xs select-none block ${
                        activeTab === "profil"
                          ? "bg-[#090d1f] border border-indigo-400/35 text-indigo-300 shadow-[4px_4px_10px_rgba(0,0,0,0.9),-2px_-2px_6px_rgba(99,102,241,0.2)] transform -translate-y-0.5"
                          : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
                      }`}
                    >
                      {t("background.tab_profile", "Profil Ringkas")}
                    </button>
                    <button
                      onClick={() => setActiveTab("laboratorium")}
                      className={`py-3 px-2 rounded-xl text-center font-black tracking-wider uppercase transition-all duration-300 cursor-pointer text-[10px] md:text-xs select-none block ${
                        activeTab === "laboratorium"
                          ? "bg-[#090d1f] border border-indigo-400/35 text-indigo-300 shadow-[4px_4px_10px_rgba(0,0,0,0.9),-2px_-2px_6px_rgba(99,102,241,0.2)] transform -translate-y-0.5"
                          : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
                      }`}
                    >
                      {t("background.tab_lab", "Laboratorium")}
                    </button>
                    <button
                      onClick={() => setActiveTab("riset")}
                      className={`py-3 px-2 rounded-xl text-center font-black tracking-wider uppercase transition-all duration-300 cursor-pointer text-[10px] md:text-xs select-none block ${
                        activeTab === "riset"
                          ? "bg-[#090d1f] border border-indigo-400/35 text-indigo-300 shadow-[4px_4px_10px_rgba(0,0,0,0.9),-2px_-2px_6px_rgba(99,102,241,0.2)] transform -translate-y-0.5"
                          : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
                      }`}
                    >
                      {t("background.tab_research", "Bidang Riset")}
                    </button>
                  </div>
                </div>
 
                {/* Dynamic Animated Panels with crystal clear fonts */}
                <div id="academic_animated_content" className="flex-grow">
                  <AnimatePresence mode="wait">
                    {activeTab === "profil" && (
                      <motion.div
                        key="profil"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="space-y-6"
                      >
                        <div className="space-y-2">
                          <h4 className="text-white font-sans font-black text-base md:text-lg tracking-tight flex items-center gap-2">
                            <Compass className="w-5 h-5 text-indigo-400" />
                            {t("background.profile_title", "Menghubungkan Teori Eksperimen dengan Sains Komputasi Modern")}
                          </h4>
                          <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" />
                        </div>
 
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1 items-stretch">
                          {/* Interactive 3D Card 1 */}
                          <div className="p-5 rounded-2xl bg-[#03050c] border border-white/[0.04] shadow-[8px_8px_20px_rgba(0,0,0,0.9),-4px_-4px_12px_rgba(255,255,255,0.01)] hover:border-indigo-500/25 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-[9px] font-mono font-extrabold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/10 shadow-inner block uppercase tracking-widest">
                                  {t("background.mission_tag", "Core Mission")}
                                </span>
                              </div>
                              <h5 className="text-sm font-black text-white uppercase font-sans tracking-tight leading-tight">
                                {t("background.mission_title", "Kurikulum Berstandar Internasional")}
                              </h5>
                              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                {t("background.mission_desc", "Mengadaptasi keilmuan secara berkala untuk mencetak lulusan unggulan di bidang desain mekanis, konversi energi ramah lingkungan, material baru, dan robotika industri.")}
                              </p>
                            </div>
                          </div>
 
                          {/* Interactive 3D Card 2 */}
                          <div className="p-5 rounded-2xl bg-[#03050c] border border-white/[0.04] shadow-[8px_8px_20px_rgba(0,0,0,0.9),-4px_-4px_12px_rgba(255,255,255,0.01)] hover:border-cyan-500/25 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-[9px] font-mono font-extrabold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/10 shadow-inner block uppercase tracking-widest">
                                  {t("background.ai_tag", "Digital Integration")}
                                </span>
                              </div>
                              <h5 className="text-sm font-black text-white uppercase font-sans tracking-tight leading-tight">
                                {t("background.ai_title", "Keterlibatan Artificial Intelligence")}
                              </h5>
                              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                {t("background.ai_desc", "Melalui mata kuliah pilihan dan riset tugas akhir, mahasiswa dilatih menyusun model cerdas yang memprediksi dinamika tegangan fisik material dan getaran rotasi mesin.")}
                              </p>
                            </div>
                          </div>
                        </div>
 
                        {/* Luxurious Quote box with left accent border */}
                        <div className="text-xs font-semibold text-indigo-200 bg-[#020306]/80 border-l-4 border-l-cyan-400 border border-white/[0.04] p-4.5 rounded-r-2xl italic shadow-inner max-w-3xl mx-auto block leading-relaxed">
                          {t("background.quote_desc", "\"Studi S1 Teknik Mesin UMY didukung penuh oleh infrastruktur laboratorium berspesifikasi tinggi di dalam kompleks Fakultas Teknik UMY yang asri dan modern.\"")}
                        </div>
                      </motion.div>
                    )}
 
                    {activeTab === "laboratorium" && (
                      <motion.div
                        key="labs"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="space-y-6"
                      >
                        <div className="space-y-2">
                          <h4 className="text-white font-sans font-black text-base md:text-lg tracking-tight flex items-center gap-2">
                            <HardHat className="w-5 h-5 text-cyan-400" />
                            {t("background.g6_lab_title", "Fasilitas Laboratorium Unggulan Gedung G6 UMY")}
                          </h4>
                          <div className="h-1 w-16 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full" />
                        </div>
 
                        {/* Spacious modern 2-column grid to prevent any text wrapping, truncation or vertical squishing */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1 items-stretch">
                          {labs.map((lab, i) => (
                            <div 
                              key={i} 
                              className="p-6 rounded-3xl bg-[#03050c] border border-white/[0.04] shadow-[10px_10px_30px_rgba(0,0,0,0.95),inset_1px_1px_1px_rgba(255,255,255,0.03)] hover:border-cyan-400/30 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(6,182,212,0.1),inset_1px_1px_2px_rgba(255,255,255,0.05)] hover:-translate-y-1.5 text-left flex flex-col justify-between h-full min-h-[220px] relative group"
                            >
                              {/* Top light glow for premium 3D effect */}
                              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/35 to-transparent pointer-events-none rounded-t-3xl" />
                              
                              <div className="space-y-4 flex-grow">
                                <div className="flex justify-between items-center gap-3 border-b border-white/[0.04] pb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[13px] font-mono font-black text-cyan-400 bg-[#06101c] px-2.5 py-1 rounded bg-opacity-70 border border-cyan-500/20 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8)]">0{i+1}</span>
                                    <span className="text-[10px] font-mono text-purple-300 font-extrabold tracking-wider uppercase">{t("background.academic_facility_tag", "LABORATORIUM UTAMA")}</span>
                                  </div>
                                  <span className="text-[9px] font-mono text-cyan-300 border border-cyan-500/20 px-2.5 py-1 rounded-sm uppercase font-black tracking-widest shrink-0 bg-[#020409]/60 shadow-inner">
                                    {lab.lokasi}
                                  </span>
                                </div>
                                
                                <h5 className="text-[14px] md:text-base font-black text-white leading-snug font-sans uppercase tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent group-hover:from-white group-hover:to-cyan-200 transition-colors duration-300">
                                  {lab.nama}
                                </h5>
                                
                                <p className="text-[11.5px] text-slate-300 leading-relaxed font-sans font-medium">
                                  {lab.deskripsi}
                                </p>
                              </div>
                              
                              {/* Tactile features slots with generous space */}
                              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.04] mt-5 shrink-0">
                                {lab.fitur.map((fit, idx) => (
                                  <span 
                                    key={idx} 
                                    className="bg-[#010204] border border-white/[0.05] hover:border-cyan-500/10 px-2.5 py-1 rounded-md text-[8.5px] font-mono font-bold text-indigo-200 hover:text-cyan-200 transition-all duration-300 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.9)] inline-block select-none"
                                  >
                                    ✦ {fit}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
 
                    {activeTab === "riset" && (
                      <motion.div
                        key="riset"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <h4 className="text-white font-sans font-black text-base md:text-lg tracking-tight flex items-center gap-2">
                            <Cpu className="w-5 h-5 text-purple-400 animate-spin" style={{ animationDuration: "12s" }} />
                            {t("background.research_title", "Kombinasi Rekayasa Struktur Fisik dan Komputasi")}
                          </h4>
                          <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
                        </div>
 
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 items-stretch">
                          {risetPillars.map((p, i) => {
                            const Icon = p.icon;
                            return (
                              <div 
                                key={i} 
                                className="p-5 rounded-2xl bg-[#03050c] border border-white/[0.04] shadow-[8px_8px_20px_rgba(0,0,0,0.9),-4px_-4px_12px_rgba(255,255,255,0.01)] hover:border-purple-500/25 transition-all duration-300 hover:-translate-y-1.5 text-left flex flex-col justify-between h-full min-h-[220px]"
                              >
                                <div className="space-y-3 flex-grow">
                                  {/* Glowing 3D circular icon nest */}
                                  <div className="w-9 h-9 rounded-xl bg-[#010204] border border-white/5 flex items-center justify-center shadow-inner">
                                    <Icon className="w-4 h-4 text-indigo-400" />
                                  </div>
                                  <div>
                                    <h5 className="text-[12px] font-black text-white font-sans uppercase leading-tight tracking-tight">{p.title}</h5>
                                    <span className="text-[7.5px] font-mono text-indigo-300 font-black uppercase tracking-wider block mt-0.5">{p.sub}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans font-medium">
                                    {p.text}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </ContainerScroll>
      </div>
    </div>
  );
}

