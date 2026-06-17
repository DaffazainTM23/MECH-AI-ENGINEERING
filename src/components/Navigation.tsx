"use client";

import React, { useState } from "react";
import { ActiveTab } from "../types";
import { 
  Home, 
  Upload, 
  Database, 
  Cpu, 
  Compass, 
  Workflow, 
  Shield, 
  Award, 
  Menu, 
  X,
  Sparkles
} from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import { useLanguage } from "../context/LanguageContext";

export function ModernPremiumLogo({ size = 10 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center select-none shrink-0" style={{ width: `${size * 4}px`, height: `${size * 4}px` }}>
      {/* Absolute ring glow */}
      <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md opacity-75 animate-pulse" />
      <img
        src="https://res.cloudinary.com/df0razmlr/image/upload/v1781586940/LOGO_AI_hhtfjy.png"
        alt="MECH AI ENGINEERING LOGO"
        className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  datasetLoaded: boolean;
  modelTrained: boolean;
}

export default function Navigation({ activeTab, setActiveTab, datasetLoaded, modelTrained }: NavigationProps) {
  const { language, setLanguage, t } = useLanguage();

  const isSelected = (id: ActiveTab): boolean => {
    if (id === "upload") {
      return activeTab === "upload" || activeTab === "features" || activeTab === "train";
    }
    if (id === "performance") {
      return activeTab === "performance" || activeTab === "analytics";
    }
    return activeTab === id;
  };

  // Direct Academic Tabs List with elegant Icons
  const navItems = [
    {
      id: "home" as ActiveTab,
      name: t("nav.home", "Home"),
      icon: Home,
      disabled: false
    },
    {
      id: "upload" as ActiveTab,
      name: t("nav.ingress", "Ingest Data"),
      icon: Upload,
      disabled: false
    },
    ...(modelTrained
      ? [
          {
            id: "performance" as ActiveTab,
            name: t("nav.dashboard", "Model Performance"),
            icon: Database,
            disabled: false
          }
        ]
      : []),
    {
      id: "twin" as ActiveTab,
      name: t("nav.education", "AI Education"),
      icon: Compass,
      disabled: false
    },
    {
      id: "about" as ActiveTab,
      name: t("nav.about", "About Project"),
      icon: Award,
      disabled: false
    }
  ];

  return (
    <nav 
      className="sticky top-0 left-0 right-0 z-50 w-full bg-[#050608]/95 backdrop-blur-3xl border-b border-white/15 px-6 py-4 flex items-center justify-between transition-all duration-300 shadow-[0_12px_45px_rgba(0,0,0,0.98),inset_0_1px_1px_rgba(255,255,255,0.08)] print-hidden select-none" 
      id="main_navigation_premium_integrated"
    >
      {/* 3D Glowing running line at the top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-indigo-500 blur-[0.5px] opacity-80" />

      {/* Pinned Left: Logo Brand Section */}
      <div 
        className="flex items-center space-x-3.5 cursor-pointer shrink-0" 
        onClick={() => setActiveTab("home")} 
        id="nav_logo"
      >
        <ModernPremiumLogo size={11} />
        <div className="text-left flex flex-col justify-center h-11 space-y-1">
          <span className="font-sans font-black text-sm sm:text-[15px] text-white tracking-wider block uppercase bg-gradient-to-r from-cyan-400 via-sky-200 to-white bg-clip-text text-transparent leading-none">
            {t("nav.brand", "MECH AI ENGINEERING")}
          </span>
          <span className="text-[8.2px] sm:text-[9.2px] text-cyan-400 font-bold tracking-[0.25em] uppercase block font-mono leading-none">
            {t("nav.campus", "TEKNIK MESIN UMY")}
          </span>
        </div>
      </div>

      {/* Center Section: Sliding Tubelight Dock for Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-1.5 bg-[#030405] border border-white/5 px-2 py-1.5 rounded-[1.5rem] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.95)]">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const active = isSelected(item.id);

          return (
            <button
              key={item.id}
              onClick={() => {
                if (!item.disabled) setActiveTab(item.id);
              }}
              disabled={item.disabled}
              className={cn(
                "relative cursor-pointer text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 border border-transparent whitespace-nowrap",
                active 
                  ? "text-cyan-400 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.95)] bg-slate-950/20" 
                  : "text-slate-400 hover:text-white hover:bg-white/[0.01]",
                item.disabled && "opacity-20 cursor-not-allowed"
              )}
            >
              <IconComponent size={14} className={cn("", active ? "text-cyan-400 animate-pulse" : "text-slate-400")} />
              <span className="font-sans font-black tracking-widest">{item.name}</span>

              {/* Slider Active Backlight indicator (Spring Lamp feedback) */}
              {active && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-cyan-500/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-9 h-[2px] bg-cyan-400 rounded-t-full">
                    <div className="absolute w-12 h-6 bg-cyan-400/20 rounded-full blur-md -top-2 -left-[6px]" />
                    <div className="absolute w-8 h-4 bg-cyan-400/30 rounded-full blur-sm -top-1 left-0.5" />
                  </div>
                </motion.div>
              )}
            </button>
          );
        })}
      </div>

      {/* Right Section: Call-To-Action buttons and High-Fidelity Creator Profile */}
      <div className="flex items-center space-x-4 shrink-0">
        <div className="hidden sm:block">
          {datasetLoaded && !modelTrained ? (
            <Button
              size="sm"
              onClick={() => setActiveTab("train")}
              className="bg-amber-600 hover:bg-amber-500 text-white font-sans font-black uppercase text-[10px] tracking-wider px-4 py-2.5 rounded-xl border border-amber-500/40 active:scale-95 transition-all shadow-[0_4px_15px_rgba(245,158,11,0.3)] animate-pulse cursor-pointer"
            >
              {t("btn.train", "Train AutoML")}
            </Button>
          ) : null}
        </div>

        {/* High-Fidelity Neumorphic Language Selector */}
        <div 
          onClick={() => setLanguage(language === "en" ? "id" : "en")}
          className="flex items-center justify-between p-0.5 rounded-lg bg-[#030405] border border-white/5 hover:border-cyan-400/35 cursor-pointer h-8 w-16 relative shadow-[inset_2px_2px_5px_rgba(0,0,0,0.95)] select-none transition-all duration-300 active:scale-95 shrink-0"
          title={language === "en" ? "Ubah ke Bahasa Indonesia" : "Switch to English"}
        >
          <motion.div 
            className="absolute top-0.5 bottom-0.5 w-[28px] bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-md flex items-center justify-center font-bold text-[9px] text-slate-950 shadow-[1px_1px_3px_rgba(0,0,0,0.8)]"
            animate={{ left: language === "en" ? "2px" : "32px" }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            {language.toUpperCase()}
          </motion.div>
          <span className="w-full text-right pr-2 text-[8.5px] font-black text-slate-450 select-none block leading-none">
            {language === "en" ? "ID" : "EN"}
          </span>
        </div>

        {/* High-Fidelity Interactive Creator Profile Avatar */}
        <div 
          onClick={() => setActiveTab("about")}
          className="hidden sm:flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-[#030405] border border-white/5 hover:border-cyan-400/35 active:scale-95 cursor-pointer hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300"
          title="Creator Profile"
          id="nav_profile_avatar_badge"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-[#020305] shrink-0">
            <img 
              src="https://res.cloudinary.com/df0razmlr/image/upload/v1771712564/PP_WEB_ianvph.jpg" 
              alt="Daffa Zain" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop";
              }}
            />
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-[10px] text-white font-black leading-none tracking-tight">ANANDA NUR DAFFA ZAIN</span>
            <span className="text-[7.5px] text-indigo-400 font-mono font-extrabold uppercase tracking-widest mt-1">NIM: 20230130023</span>
          </div>
        </div>

        {/* Mobile view side sheet trigger - optimized Neumorphic click block */}
        <div className="lg:hidden flex items-center gap-1">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-xl border border-white/5 hover:bg-white/5 h-10 w-10 cursor-pointer shadow-md">
                <Menu className="size-5 text-slate-350" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              showClose={true}
              className="bg-[#050608]/98 border-l border-white/10 w-4/5 max-w-sm gap-0 backdrop-blur-3xl p-6 flex flex-col justify-between select-none"
            >
              <div className="space-y-6">
                 {/* Drawer Brand & User Profile Information */}
                <div className="flex flex-col space-y-4 pb-6 border-b border-white/5 text-left">
                  <div className="flex items-center space-x-3 h-10">
                    <ModernPremiumLogo size={10} />
                    <div className="flex flex-col justify-center h-10 space-y-0.5 text-left">
                      <span className="font-sans font-black text-xs sm:text-sm text-white tracking-wider block uppercase bg-gradient-to-r from-cyan-400 via-sky-200 to-white bg-clip-text text-transparent leading-none">
                        MECH AI ENG
                      </span>
                      <span className="text-[7.8px] sm:text-[8.5px] text-cyan-400 font-bold tracking-[0.2em] uppercase block font-mono leading-none">
                        TEKNIK MESIN UMY
                      </span>
                    </div>
                  </div>

                  {/* Drawer Creator profile shortcut */}
                  <SheetClose asChild>
                    <div 
                      onClick={() => setActiveTab("about")}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-white/5 hover:border-cyan-400/20 cursor-pointer transition-all active:scale-98"
                      id="mobile_drawer_creator_profile"
                    >
                      <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/10 bg-[#020305] shrink-0 font-sans">
                        <img 
                          src="https://res.cloudinary.com/df0razmlr/image/upload/v1771712564/PP_WEB_ianvph.jpg" 
                          alt="Daffa Zain" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop";
                          }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] text-white font-extrabold leading-tight">ANANDA NUR DAFFA ZAIN</span>
                        <span className="text-[8px] text-indigo-400 font-mono font-bold uppercase tracking-wider mt-0.5">NIM: 20230130023</span>
                      </div>
                    </div>
                  </SheetClose>
                </div>

                {/* Directly Accessible Menu List */}
                <div className="space-y-1.5 text-left">
                  <span className="text-[8.5px] font-mono font-bold text-slate-500 uppercase tracking-widest block px-1 mb-2">Academic Channels</span>
                  
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SheetClose asChild key={item.id}>
                        <button 
                          disabled={item.disabled}
                          onClick={() => {
                            if (!item.disabled) setActiveTab(item.id);
                          }}
                          className={`w-full p-3 rounded-xl border text-[10.5px] font-bold text-left uppercase font-sans flex items-center justify-between transition-all cursor-pointer ${
                            item.disabled
                              ? "opacity-20 cursor-not-allowed border-transparent text-slate-600"
                              : isSelected(item.id)
                              ? "bg-cyan-500/10 border-cyan-500/25 text-cyan-300"
                              : "border-transparent text-slate-300 hover:bg-white/5 hover:border-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${isSelected(item.id) ? "text-cyan-400" : "text-slate-400"}`} />
                            <span>{item.name}</span>
                          </div>
                          {item.disabled && (
                            <span className="text-[7.5px] font-mono font-black text-amber-500 uppercase tracking-widest border border-amber-500/20 px-1.5 py-0.5 rounded bg-amber-500/5">LOCK</span>
                          )}
                        </button>
                      </SheetClose>
                    );
                  })}
                </div>
              </div>

              {/* Academic branding footer inside mobile sheet */}
              <div className="border-t border-white/5 pt-4 text-left">
                <span className="text-[7.5px] font-mono font-bold text-slate-500 uppercase block tracking-widest leading-none mb-1">CREDITS & COURSE</span>
                <span className="text-[10px] text-slate-400 block font-semibold leading-tight">Universitas Muhammadiyah Yogyakarta</span>
                <span className="text-[8px] text-indigo-400 font-bold uppercase block mt-1">Zainproject core system</span>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

    </nav>
  );
}
