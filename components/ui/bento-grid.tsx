"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
    CheckCircle,
    Clock,
    Star,
    TrendingUp,
    Video,
    Globe,
    FileSpreadsheet,
    Database,
    ShieldAlert,
    Cpu,
    Zap,
    Scale,
    BarChart3
} from "lucide-react";

export interface BentoItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    status?: string;
    tags?: string[];
    meta?: string;
    cta?: string;
    colSpan?: number;
    hasPersistentHover?: boolean;
    onClick?: () => void;
}

interface BentoGridProps {
    items: BentoItem[];
}

export function BentoGrid({ items }: BentoGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-2 max-w-7xl mx-auto w-full">
            {items.map((item, index) => (
                <div
                    key={index}
                    onClick={item.onClick}
                    className={cn(
                        "group relative p-[1.5px] rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer bento-rainbow-wrapper",
                        item.colSpan === 2 ? "md:col-span-2" : "col-span-1",
                        item.hasPersistentHover && "bento-rainbow-active scale-[1.01]"
                    )}
                >
                    {/* Rainbow Border Pseudo-Elements */}
                    <div className="bento-rainbow-glow-border" />
                    
                    {/* Main Inner Card */}
                    <div className="relative rounded-2xl p-6 h-full flex flex-col justify-between bg-[#040407]/90 backdrop-blur-xl border border-white/[0.04] group-hover:bg-[#06060c]/90 transition-colors z-10 text-left">
                        
                        {/* Background Subtle Mesh pattern */}
                        <div className="absolute inset-0 transition-opacity duration-350 pointer-events-none opacity-0 group-hover:opacity-100">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06)_1px,transparent_1px)] bg-[length:14px_14px]" />
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] via-transparent to-transparent" />
                        </div>

                        <div>
                            <div className="flex items-center justify-between pointer-events-none">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/5 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/25 transition-all duration-300 shadow-inner">
                                    {item.icon}
                                </div>
                                <span
                                    className={cn(
                                        "text-[9px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-full",
                                        "bg-white/[0.03] border border-white/5 text-slate-300",
                                        "transition-colors duration-300 group-hover:bg-indigo-500/15 group-hover:text-indigo-200 group-hover:border-indigo-500/20"
                                    )}
                                >
                                    {item.status || "Active"}
                                </span>
                            </div>

                            <div className="space-y-2.5 mt-5 pointer-events-none">
                                <h3 className="font-extrabold text-white tracking-tight text-[16px] flex items-baseline">
                                    {item.title}
                                    {item.meta && (
                                        <span className="ml-2 text-[10px] text-slate-500 font-mono tracking-wider uppercase font-semibold">
                                            ({item.meta})
                                        </span>
                                    )}
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed font-sans font-medium">
                                    {item.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-5 border-t border-white/[0.05] pt-4 pointer-events-auto">
                            <div className="flex items-center space-x-1.5 text-[9px] font-mono text-slate-450">
                                {item.tags?.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-0.5 rounded-lg bg-white/[0.02] border border-white/[0.04] backdrop-blur-sm transition-all duration-200 hover:bg-indigo-500/10 hover:text-indigo-300 hover:border-indigo-500/10"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <span className="text-[10px] font-mono font-bold text-indigo-400 hover:text-indigo-300 group-hover:translate-x-1.5 transition-all flex items-center gap-1">
                                {item.cta || "Open →"}
                            </span>
                        </div>
                    </div>
                </div>
            ))}

            <style>{`
                .bento-rainbow-wrapper {
                    position: relative;
                }
                .bento-rainbow-glow-border {
                    position: absolute;
                    inset: 0;
                    border-radius: 1rem;
                    z-index: 1;
                    opacity: 0;
                    background: linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000);
                    background-size: 400%;
                    animation: rainbow-glow 15s linear infinite;
                    transition: opacity 0.4s ease;
                    pointer-events: none;
                }
                .bento-rainbow-wrapper:hover .bento-rainbow-glow-border,
                .bento-rainbow-active .bento-rainbow-glow-border {
                    opacity: 0.65;
                }
                @keyframes rainbow-glow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </div>
    );
}

export default BentoGrid;
