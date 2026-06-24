import React from 'react';
import { cn } from './Card';

interface GenyBubbleProps {
  children: React.ReactNode;
  smallAvatar?: boolean;
}

export function GenyBubble({ children, smallAvatar = true }: GenyBubbleProps) {
  return (
    <div className="flex gap-2.5 items-start mb-3.5">
      <div
        className={cn(
          "rounded-full shrink-0 relative flex items-center justify-center animate-[pulse_2.6s_ease-in-out_infinite]",
          "bg-[radial-gradient(circle_at_35%_30%,#7af0ff,#00D2FF_45%,#FF3EB0)]",
          "shadow-[0_0_18px_rgba(0,210,255,0.5)]",
          smallAvatar ? "w-[34px] h-[34px]" : "w-[46px] h-[46px]"
        )}
      >
        <span className={cn("text-white/90", smallAvatar ? "text-xs" : "text-base")}>
          ✦
        </span>
      </div>
      <div className="bg-surface border border-border/50 rounded-2xl rounded-tl-sm p-3 px-3.5 text-[18px] leading-relaxed text-text-hi">
        <span className="text-[18px] tracking-[0.18em] uppercase text-electric font-semibold mb-1 block">
          Geny
        </span>
        {children}
      </div>
    </div>
  );
}
