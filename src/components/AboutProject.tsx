import React, { useState } from "react";
import { 
  GraduationCap, Award, ShieldCheck, Landmark, 
  MapPin, MessageSquare, Github, Instagram, Globe, BookOpen,
  Navigation, Star, ExternalLink, Heart, Shield, Workflow, Info
} from "lucide-react";
import { Map, MapMarker, MarkerContent, MarkerLabel, MarkerPopup, MapControls } from "./ui/mapcn-marker-popup";
import WorkflowSection from "./WorkflowSection";
import EthicsSection from "./EthicsSection";
import { useLanguage } from "../context/LanguageContext";
import { audio } from "../utils/audioService";

export default function AboutProject() {
  const { t } = useLanguage();
  const [subTab, setSubTab] = useState<"about" | "workflow" | "ethics">("about");
  // Precise coordinate of Gedung G6 Teknik Mesin UMY
  const umyCoords = { lng: 110.3203470953695, lat: -7.80790378741042 };

  const handleSubTabChange = (targetTab: "about" | "workflow" | "ethics") => {
    audio.playTabSwitch();
    setSubTab(targetTab);
  };

  return (
    <div className="space-y-8 py-4 text-left font-sans select-none" id="about_project_viewport">
      
      {/* Introduction Title - Crafted 3D Header Board */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-[#070911] border border-white/10 shadow-[8px_8px_32px_rgba(0,0,0,0.95),_-4px_-4px_20px_rgba(255,255,255,0.02),_inset_0_1px_1px_rgba(255,255,255,0.08)]">
        {/* Absolute Glowing Accents */}
        <div className="absolute top-0 left-10 w-48 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-[1px]" />
        
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 bg-[#030409] border border-cyan-500/20 text-cyan-400 rounded-full text-[10px] font-mono tracking-wider font-black uppercase shadow-[inset_2px_2px_6px_rgba(0,0,0,0.8)]">
            <GraduationCap className="w-3.5 h-3.5 animate-pulse" />
            <span>{t("academic.research_badge", "Academic Research Workspace")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-center sm:text-left">
            {t("academic.title", "Integrated Scientific & Academic Center")}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-4xl leading-relaxed text-center sm:text-left">
            {t("academic.subtitle", "Officially verified specifications, methodology workflows, and technical ethics charters governing the Mechanical Informatics AutoML regression system. Toggle across segments below to inspect.")}
          </p>
        </div>
      </div>

      {/* LUXURIOUS 3D NEUMORPHIC SUB-TAB REGULATION PANEL */}
      <div className="flex justify-center p-2 rounded-2xl bg-[#030409] border border-white/5 shadow-[inset_6px_6px_16px_rgba(0,0,0,0.95),_4px_4px_12px_rgba(255,255,255,0.01)]" id="neumorphic_subtab_dock">
        <div className="grid grid-cols-3 gap-2 w-full max-w-3xl">
          {/* SubTab 1: Developer Core */}
          <button
            onClick={() => handleSubTabChange("about")}
            className={`cursor-pointer relative py-3 px-4 rounded-xl text-[10px] sm:text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
              subTab === "about"
                ? "bg-slate-900 border border-cyan-400/30 text-cyan-300 shadow-[inset_4px_4px_10px_rgba(0,0,0,0.9),_2px_2px_4px_rgba(6,182,212,0.1)] font-extrabold translate-y-[1px]"
                : "border border-transparent text-slate-400 hover:text-white hover:bg-white/[0.02] shadow-[3px_3px_8px_rgba(0,0,0,0.4)]"
            }`}
          >
            <Info className={`w-4 h-4 ${subTab === "about" ? "text-cyan-400 animate-pulse" : "text-slate-400"}`} />
            <span className="hidden sm:inline">{t("about.tab1", "Academic Portfolio")}</span>
            <span className="sm:hidden">{t("about.tab1", "Portfolio")}</span>
            {subTab === "about" && (
              <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1.0)]" />
            )}
          </button>

          {/* SubTab 2: SOP Workflow Map */}
          <button
            onClick={() => handleSubTabChange("workflow")}
            className={`cursor-pointer relative py-3 px-4 rounded-xl text-[10px] sm:text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
              subTab === "workflow"
                ? "bg-slate-900 border border-indigo-400/30 text-indigo-300 shadow-[inset_4px_4px_10px_rgba(0,0,0,0.9),_2px_2px_4px_rgba(99,102,241,0.1)] font-extrabold translate-y-[1px]"
                : "border border-transparent text-slate-400 hover:text-white hover:bg-white/[0.02] shadow-[3px_3px_8px_rgba(0,0,0,0.4)]"
            }`}
          >
            <Workflow className={`w-4 h-4 ${subTab === "workflow" ? "text-indigo-400" : "text-slate-400"}`} />
            <span className="hidden sm:inline">{t("about.tab2", "SOP Workflow Matrix")}</span>
            <span className="sm:hidden">{t("about.tab2", "Workflow")}</span>
            {subTab === "workflow" && (
              <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,1.0)]" />
            )}
          </button>

          {/* SubTab 3: Ethics Core */}
          <button
            onClick={() => handleSubTabChange("ethics")}
            className={`cursor-pointer relative py-3 px-4 rounded-xl text-[10px] sm:text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
              subTab === "ethics"
                ? "bg-slate-900 border border-emerald-400/30 text-emerald-300 shadow-[inset_4px_4px_10px_rgba(0,0,0,0.9),_2px_2px_4px_rgba(16,185,129,0.1)] font-extrabold translate-y-[1px]"
                : "border border-transparent text-slate-400 hover:text-white hover:bg-white/[0.02] shadow-[3px_3px_8px_rgba(0,0,0,0.4)]"
            }`}
          >
            <Shield className={`w-4 h-4 ${subTab === "ethics" ? "text-emerald-400" : "text-slate-400"}`} />
            <span className="hidden sm:inline">{t("about.tab3", "Ethics Charter")}</span>
            <span className="sm:hidden">{t("about.tab3", "Ethics")}</span>
            {subTab === "ethics" && (
              <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,1.0)]" />
            )}
          </button>
        </div>
      </div>

      {/* RENDER DYNAMIC ACTIVE PORTFOLIO OR METHODOLOGY SECTION */}
      {subTab === "about" && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-250">
          
          {/* Row 1: Equal-Sized Symmetrical Pair (Left: Premium Profile Card, Right: Science Core Synopsis) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* 1. Developer Neumorphic 3D Card with Luxurious Simplified Layout */}
            <div className="flex flex-col h-full">
              <div className="nm-card p-8 flex flex-col justify-between h-full hover:scale-[1.002] hover:border-cyan-400/30 overflow-hidden relative">
                
                {/* Subtle cyber grid backlight */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(255,255,255,0.01)_1.5px,transparent_1.5px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-30 pointer-events-none" />
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="space-y-6 relative z-10">
                  {/* Creator Card header */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/5">
                    
                    {/* High-Contrast Neumorphic 3D Bezel Frame */}
                    <div className="relative w-24 h-24 shrink-0 rounded-2xl p-1 bg-[#020305] border border-cyan-400/30 shadow-[10px_10px_20px_rgba(0,0,0,0.9),_inset_4px_4px_8px_rgba(0,0,0,0.95)] flex items-center justify-center">
                      <div className="w-full h-full rounded-xl overflow-hidden relative">
                        <img
                          src="https://res.cloudinary.com/df0razmlr/image/upload/v1771712564/PP_WEB_ianvph.jpg"
                          alt="Daffa Zain"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover select-none filter contrast-[105%] saturate-[102%]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop";
                          }}
                        />
                      </div>
                      {/* 3D Hardware micro studs */}
                      <span className="absolute top-1 left-1 w-1.5 h-1.5 bg-cyan-400/80 rounded-full blur-[0.5px]" />
                      <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-indigo-500/80 rounded-full blur-[0.5px]" />
                    </div>
                    
                    <div className="text-center sm:text-left space-y-3 flex-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 rounded-lg text-[8.5px] font-mono uppercase tracking-widest font-black shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8),_1px_1px_2px_rgba(255,255,255,0.02)]">
                        <Award className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        <span>{t("about.cert_researcher", "Certified Researcher")}</span>
                      </span>

                      {/* Prominent Multi-Layer Raised 3D Name Panel */}
                      <div className="p-3.5 rounded-2xl bg-[#03050c] border border-cyan-500/20 shadow-[4px_4px_10px_rgba(0,0,0,0.9),_-2px_-2px_6px_rgba(255,255,255,0.01),inset_1px_1px_1px_rgba(255,255,255,0.05)] transform hover:-translate-y-0.5 transition-transform">
                        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase leading-none font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] bg-gradient-to-r from-cyan-400 via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                          Daffa Zain
                        </h3>
                      </div>

                      {/* Debossed Physical Channel for NIM */}
                      <div className="px-3.5 py-2.5 rounded-xl bg-[#010103] border border-white/5 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.95)] flex items-center justify-between">
                        <span className="text-[9px] font-mono uppercase text-slate-500 font-extrabold tracking-widest">REGISTRASI AKADEMIK</span>
                        <p className="text-[12px] text-cyan-400 font-extrabold font-mono tracking-widest uppercase bg-cyan-950/30 border border-cyan-500/20 px-2.5 py-0.5 rounded-md shadow-inner">
                          NIM: 20230130023
                        </p>
                      </div>

                      <div className="pl-1">
                        <p className="text-[9.5px] text-slate-400 font-mono font-bold uppercase tracking-wider">{t("about.sub_campus_scholar", "Mechanical Engineering Undergrad Scholar")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Clean High-Level Credentials Grid */}
                  <div className="p-5.5 rounded-2xl bg-[#030409]/60 border border-white/5 shadow-[inset_6px_6px_16px_rgba(0,0,0,0.95)] grid grid-cols-1 gap-3 font-sans">
                    <span className="text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-widest block border-b border-white/5 pb-1.5 mb-1">{t("about.active_nodes", "Academic Credentials")}</span>
                    
                    <div className="flex items-center justify-between text-[11px] py-1 font-semibold border-b border-white/5 border-dashed">
                      <span className="text-slate-450">{t("about.sub_campus", "Campus / Affiliation")}</span>
                      <span className="text-white text-right font-bold uppercase font-sans tracking-wide">Universitas Muhammadiyah Yogyakarta</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] py-1 font-semibold border-b border-white/5 border-dashed">
                      <span className="text-slate-450">{t("about.course_dept", "Research Area")}</span>
                      <span className="text-slate-205 text-right font-bold uppercase tracking-wide">Dasar-Dasar Artificial Intelligence</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] py-1 font-semibold mb-0.5">
                      <span className="text-slate-450">{t("about.academic_focus", "Scholarly Major")}</span>
                      <span className="text-indigo-400 text-right font-extrabold font-mono uppercase tracking-widest">Mechanical Informatics (S1)</span>
                    </div>
                  </div>
                </div>

                {/* Secure Certification Footer */}
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-slate-500 relative z-10">
                  <span className="flex items-center gap-1.5 font-bold uppercase tracking-widest">
                    <Heart className="w-3 h-3 text-cyan-500 animate-pulse" />
                    <span>{t("about.crafted_by", "ZainProject Core Node")}</span>
                  </span>
                  <span className="uppercase tracking-widest text-[#10b981] font-black flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span>● ONLINE</span>
                  </span>
                </div>

              </div>
            </div>

            {/* 2. Research Scientific Synopsis Card */}
            <div className="flex flex-col h-full">
              <div className="nm-card p-8 flex flex-col justify-between h-full hover:scale-[1.002] hover:border-indigo-400/30 overflow-hidden relative">
                
                {/* Subtle hardware back plate */}
                <div className="absolute inset-0 bg-[radial-gradient(rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:16px_16px] opacity-40 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="space-y-6 relative z-10">
                  {/* Title Section */}
                  <div className="space-y-2 pb-5 border-b border-white/5All">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-[8.5px] font-mono tracking-widest font-black uppercase shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)]">
                      {t("about.brand_core", "MECH AI ENGINEER CORE")}
                    </span>
                    <h3 className="text-xl font-extrabold text-white leading-snug uppercase tracking-tight font-display">
                      {t("about.thesis_title", "Web App Berbasis Machine Learning untuk Analisis dan Prediksi Parameter Teknik Mesin")}
                    </h3>
                    <p className="text-[9.5px] text-indigo-400 font-mono uppercase tracking-widest font-black">
                      {t("about.thesis_subtitle", "Coursework Thesis | UMY Mechanical Informatics Study")}
                    </p>
                  </div>

                  {/* Core Statement Text Blocks with high visual readability */}
                  <div className="space-y-4 text-xs sm:text-[13px] text-slate-300 leading-relaxed font-semibold">
                    <p>
                      {t("about.abstract_part1", "This scientific platform demonstrates the practical application of Artificial Intelligence & High-Fidelity Machine Learning (AI/ML) to mechanical engineering optimization. Designed specifically to execute full multivariate, high-precision regressors purely inside the browser interface.")}
                    </p>
                    <p className="text-slate-450 leading-relaxed text-xs font-normal">
                      {t("about.abstract_part2", "By packaging robust Extremely Randomized Trees (Random Forest), symmetric oblivious trees (CatBoost), MLP backpropagation networks, and an advanced stacked CV meta-learner generalizer, the engine generates prompt calculations for physical outcomes like material stress boundaries, processing heat dissipation, and micro-machining surface roughness.")}
                    </p>
                  </div>
                </div>

                {/* Symmetrical Quality Credentials Indicators */}
                <div className="grid grid-cols-2 gap-4 pt-5 mt-5 border-t border-white/5 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#030409] border border-white/10 flex items-center justify-center shadow-md shrink-0">
                      <Landmark className="w-4 h-4 text-indigo-405" />
                    </div>
                    <div className="text-left">
                      <p className="text-[8px] text-slate-500 font-mono font-bold uppercase leading-none mb-0.5">{t("about.focus_label", "Campus Focus")}</p>
                      <p className="text-[10px] text-slate-205 font-extrabold uppercase leading-tight tracking-wide">UMY Teknik Mesin</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 border-l border-white/5 pl-4">
                    <div className="w-8 h-8 rounded-lg bg-[#030409] border border-white/10 flex items-center justify-center shadow-md shrink-0">
                      <ShieldCheck className="w-4 h-4 text-cyan-405" />
                    </div>
                    <div className="text-left">
                      <p className="text-[8px] text-slate-500 font-mono font-bold uppercase leading-none mb-0.5">{t("about.integrity_label", "Engine Integrity")}</p>
                      <p className="text-[10px] text-slate-205 font-extrabold uppercase leading-tight tracking-wide">100% Real Datasets</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Row 2: FULL WIDTH MASSIVE SATELLITE BENTO CORE */}
          <div className="w-full" id="massive_satellite_map_row">
            <div className="nm-card p-6 w-full relative overflow-hidden transition-all duration-300 hover:border-cyan-404/30 group">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <h4 className="font-mono text-[11px] font-black text-white uppercase tracking-widest flex items-center space-x-2.5">
                    <span className="flex h-2.5 w-2.5 items-center justify-center relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
                    </span>
                    <span>{t("about.map_title", "SUPERVISING CAMPUS COORDINATE HD SATELLITE MAP")}</span>
                  </h4>
                  <span className="text-[8.5px] font-mono font-black text-cyan-450 bg-cyan-500/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                    GEDUNG G6 TEKNIK MESIN UMY
                  </span>
                </div>
                
                {/* Massive Spacious Canvas with Satellite styling representation */}
                <div className="w-full h-[410px] rounded-2.5xl overflow-hidden border border-white/15 shadow-[inset_4px_4px_12px_rgba(0,0,0,0.95),0_10px_40px_rgba(0,0,0,0.85)] relative bg-[#010103]">
                  {/* Floating Glassmorphism HUD Overlay removed to keep satellite view clean */}

                  <Map 
                    center={[umyCoords.lng, umyCoords.lat]} 
                    zoom={15.0} 
                    pitch={0}
                    bearing={0}
                    className="w-full h-full"
                    styles={{
                      dark: {
                        version: 8,
                        sources: {
                          "satellite-tiles": {
                            type: "raster",
                            tiles: [
                              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            ],
                            tileSize: 256,
                            attribution: "Tiles &copy; Esri World Imagery"
                          }
                        },
                        layers: [
                          {
                            id: "satellite",
                            type: "raster",
                            source: "satellite-tiles",
                            minzoom: 0,
                            maxzoom: 17
                          }
                        ]
                      },
                      light: {
                        version: 8,
                        sources: {
                          "satellite-tiles": {
                            type: "raster",
                            tiles: [
                              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            ],
                            tileSize: 256,
                            attribution: "Tiles &copy; Esri World Imagery"
                          }
                        },
                        layers: [
                          {
                            id: "satellite",
                            type: "raster",
                            source: "satellite-tiles",
                            minzoom: 0,
                            maxzoom: 17
                          }
                        ]
                      }
                    }}
                  >
                    <MapControls showZoom={true} showLocate={true} showFullscreen={true} position="top-right" />
                    
                    {/* Precise Marker representing Gedung G6 with real image popup */}
                    <MapMarker longitude={umyCoords.lng} latitude={umyCoords.lat}>
                      <MarkerContent>
                        <div className="relative flex h-8 w-8 items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-400 border-2 border-white shadow-[0_0_15px_rgba(34,211,238,0.9)]"></span>
                        </div>
                        <MarkerLabel position="bottom" className="text-white font-black bg-slate-950/95 py-1 px-2.5 rounded-lg border border-white/10 text-[9px] font-mono uppercase tracking-widest whitespace-nowrap shadow-xl mt-1.5">
                          {t("about.map_label", "Gedung G6 Teknik Mesin UMY")}
                        </MarkerLabel>
                      </MarkerContent>
                      
                      <MarkerPopup className="w-64 p-0 border border-white/10 bg-slate-950/98 backdrop-blur-xl overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] text-left select-none">
                        <div className="relative h-28 overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=320&h=180&fit=crop" 
                            alt="Mechanical Lab G6" 
                            className="h-full w-full object-cover filter brightness-[80%] scale-102 hover:scale-105 transition-all duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/35" />
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md text-cyan-400 text-[8px] font-mono px-2 py-0.5 rounded-full font-black tracking-widest uppercase border border-white/5 shadow-md">
                            <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                            <span>{t("about.lab_building_tag", "BUILDING G6")}</span>
                          </div>
                        </div>
                        <div className="p-3.5 space-y-2.5 text-left bg-gradient-to-b from-slate-950/30 to-slate-950/95 relative z-10">
                          <div className="space-y-0.5">
                            <h4 className="text-white text-[11px] font-black leading-snug uppercase tracking-wider">{t("about.map_label", "Gedung G6 Teknik Mesin")}</h4>
                            <p className="text-[9px] text-slate-400 leading-normal font-medium font-sans">{t("about.map_dept", "Civil & Mechanical Engineering, FT-UMY")}</p>
                          </div>
                          
                          <div className="flex items-center gap-1 text-[8.5px] font-mono font-bold tracking-wider text-cyan-400 bg-cyan-500/5 border border-cyan-400/10 px-2 py-0.5 w-max rounded">
                            <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                            <span>5.0</span>
                            <span className="text-slate-450 uppercase">({t("about.map_desc", "CORE RESEARCH")})</span>
                          </div>
                          
                          <div className="pt-1">
                            <a 
                              href="https://maps.app.goo.gl/rxYG5GPaj8AezbNa7"
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => audio.playClick()}
                              className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-xl bg-cyan-400 px-3 text-[9px] font-bold text-slate-950 hover:bg-cyan-300 transition-all cursor-pointer shadow-[0_4px_12px_rgba(34,211,238,0.2)] uppercase tracking-wider active:scale-[0.98]"
                            >
                              <Navigation className="w-2.5 h-2.5 fill-current" />
                              <span>{t("about.directions", "GET DIRECTIONS")}</span>
                            </a>
                          </div>
                        </div>
                      </MarkerPopup>
                    </MapMarker>
                  </Map>
                </div>
              </div>

              {/* Geographic Coordination metadata footer */}
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-4.5 pt-3.5 border-t border-white/5">
                <span className="font-bold tracking-wider">COORDS -7.807904, 110.320347 | GEDUNG G6 TEKNIK MESIN UMY</span>
                <a 
                  href="https://maps.app.goo.gl/rxYG5GPaj8AezbNa7" 
                  target="_blank"  
                  rel="noreferrer"
                  className="text-cyan-400 font-extrabold hover:underline flex items-center space-x-1 uppercase"
                >
                  <span>{t("about.maps_link", "Google Maps Direct")}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>
          </div>

          {/* Row 3: Symmetrical Bottom Channels (Left: Connections, Right: Nodes) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Developer Contact Channels */}
            <div className="relative rounded-3xl bg-gradient-to-b from-[#090b16]/95 to-[#04050a]/98 border border-white/10 p-6.5 shadow-[12px_12px_36px_rgba(0,0,0,0.95)] overflow-hidden text-left flex flex-col justify-between">
              <div>
                <h4 className="font-mono text-[10.5px] font-black text-slate-300 uppercase tracking-widest flex items-center space-x-2 pb-3 border-b border-white/5 mb-4">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span>{t("about.contact_title", "DEVELOPER INTERACTIVE CONNECT")}</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-5.5 font-medium">
                  {t("about.contact_desc", "Connect directly with Ananda Nur Daffa Zain for code validation, academic review, and engineering enquiries:")}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3" id="developer_contact_channels">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/6281220010205"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-[#030409]/85 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/10 flex flex-col items-center justify-center text-emerald-400 transition-all duration-300 text-center gap-1.5 cursor-pointer hover:-translate-y-[2px] shadow-[4px_4px_12px_rgba(0,0,0,0.5)]"
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                  <span className="font-mono text-[8px] font-black tracking-widest uppercase">WhatsApp</span>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/DaffazainTM23"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-[#030409]/85 border border-white/10 hover:border-white/40 hover:bg-white/5 flex flex-col items-center justify-center text-slate-205 transition-all duration-300 text-center gap-1.5 cursor-pointer hover:-translate-y-[2px] shadow-[4px_4px_12px_rgba(0,0,0,0.5)]"
                >
                  <Github className="w-4.5 h-4.5" />
                  <span className="font-mono text-[8px] font-black tracking-widest uppercase">GitHub</span>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/daffazain_28/?__pwa=1#"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-[#030409]/85 border border-pink-500/20 hover:border-pink-500/50 hover:bg-pink-500/10 flex flex-col items-center justify-center text-pink-400 transition-all duration-300 text-center gap-1.5 cursor-pointer hover:-translate-y-[2px] shadow-[4px_4px_12px_rgba(0,0,0,0.5)]"
                >
                  <Instagram className="w-4.5 h-4.5" />
                  <span className="font-mono text-[8px] font-black tracking-widest uppercase">Instagram</span>
                </a>
              </div>
            </div>

            {/* University Web Resources */}
            <div className="relative rounded-3xl bg-gradient-to-b from-[#090b16]/95 to-[#04050a]/98 border border-white/10 p-6.5 shadow-[12px_12px_36px_rgba(0,0,0,0.95)] overflow-hidden text-left flex flex-col justify-between">
              <div>
                <h4 className="font-mono text-[10.5px] font-black text-slate-300 uppercase tracking-widest flex items-center space-x-2 pb-3 border-b border-white/5 mb-4">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <span>{t("about.institutional_nodes", "UNIVERSITAS MUHAMMADIYAH NODES")}</span>
                </h4>

                <div className="flex flex-col space-y-2.5">
                  {/* UMY Website */}
                  <a
                    href="https://www.umy.ac.id/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-black/50 border border-white/5 hover:border-indigo-455/35 hover:bg-indigo-950/20 transition-all text-xs font-mono text-slate-300 hover:text-white cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Globe className="w-4 h-4 text-indigo-400" />
                      <span className="font-extrabold uppercase tracking-wide text-[10px]">{t("about.umy_website", "Official UMY Website")}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>

                  {/* KRS portal */}
                  <a
                    href="https://krs.umy.ac.id/Beranda.aspx"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-black/50 border border-white/5 hover:border-indigo-455/35 hover:bg-indigo-950/20 transition-all text-xs font-mono text-slate-300 hover:text-white cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center space-x-2.5">
                      <BookOpen className="w-4 h-4 text-amber-500" />
                      <span className="font-extrabold uppercase tracking-wide text-[10px]">{t("about.krs_portal", "Academic KRS Portal")}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between font-mono text-[8.5px] text-slate-600 mt-4.5 pt-2 tracking-widest border-t border-white/5 uppercase">
                <span>EST. 1981 YOGYAKARTA</span>
                <span>SECURED CREDENTIALS</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {subTab === "workflow" && (
        <div className="animate-in fade-in zoom-in-95 duration-250">
          <WorkflowSection />
        </div>
      )}

      {subTab === "ethics" && (
        <div className="animate-in fade-in zoom-in-95 duration-250">
          <EthicsSection />
        </div>
      )}

    </div>
  );
}
