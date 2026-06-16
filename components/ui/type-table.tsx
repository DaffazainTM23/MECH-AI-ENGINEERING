"use client"

import * as React from "react"
import { InfoIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface TypeTableProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  type: Record<string, {
    description?: React.ReactNode
    type: string
    typeDescription?: React.ReactNode
    typeDescriptionLink?: string
    default?: string
  }>
}

function Info({ children }: { children: React.ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="inline-flex items-center text-muted-foreground/60 hover:text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 rounded p-0.5">
          <InfoIcon className="size-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="prose max-h-[400px] min-w-[220px] max-w-[400px] overflow-auto text-sm bg-neutral-900 border border-white/10 text-white rounded-lg p-3 shadow-2xl">
        {children}
      </PopoverContent>
    </Popover>
  )
}

export function TypeTable({ type, className, ...props }: TypeTableProps) {
  return (
    <div 
      className={cn(
        "my-6 overflow-x-auto rounded-xl border border-white/10 bg-black/60 backdrop-blur-md",
        className
      )}
      {...props}
    >
      <table className="w-full min-w-[500px] whitespace-nowrap text-xs text-slate-300">
        <thead className="border-b border-white/10 bg-white/5 font-mono text-[10px] uppercase tracking-wider">
          <tr>
            <th className="w-[45%] p-4 text-left font-bold text-white">Prop / Feature</th>
            <th className="w-[30%] p-4 text-left border-l border-white/10 font-bold text-white">Target Type</th>
            <th className="w-1/4 p-4 text-left border-l border-white/10 font-bold text-white">Default / Option</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 font-sans">
          {Object.entries(type).map(([key, value]) => (
            <tr key={key} className="hover:bg-white/[0.02] transition-colors">
              <td className="p-4">
                <div className="inline-flex flex-row items-center gap-2">
                  <code className="rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-blue-400 font-mono text-xs font-bold">
                    {key}
                  </code>
                  {value.description && <Info>{value.description}</Info>}
                </div>
              </td>
              <td className="p-4 border-l border-white/10">
                <div className="inline-flex flex-row items-center gap-2">
                  <code className="rounded-md bg-white/5 px-2 py-0.5 text-slate-250 font-mono text-xs">
                    {value.type}
                  </code>
                  {value.typeDescription && <Info>{value.typeDescription}</Info>}
                  {value.typeDescriptionLink && (
                    <a href={value.typeDescriptionLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                      <InfoIcon className="size-4" />
                    </a>
                  )}
                </div>
              </td>
              <td className="p-4 border-l border-white/10">
                {value.default ? (
                  <code className="rounded-md bg-white/5 px-2 py-0.5 text-indigo-300 font-mono text-xs">
                    {value.default}
                  </code>
                ) : (
                  <span className="text-slate-500 font-mono">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
