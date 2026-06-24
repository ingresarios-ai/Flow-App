'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/components/UI/Card';

export function BottomNav() {
  const { currentScreen, setScreen } = useAppStore();

  const tabs = [
    { id: 'home', ic: '📚', l: 'Aprende' },
    { id: 'sim', ic: '📈', l: 'Simular' },
    { id: 'prog', ic: '📊', l: 'Progreso' },
  ] as const;

  // Only show navigation on main screens
  if (!['home', 'sim', 'prog'].includes(currentScreen)) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[72px] bg-abyss/90 backdrop-blur-md border-t border-border/50 flex justify-around items-center pb-2 z-40">
      {tabs.map((tb) => (
        <button
          key={tb.id}
          onClick={() => setScreen(tb.id)}
          className={cn(
            "bg-transparent border-none cursor-pointer flex flex-col items-center gap-[3px] text-[18px] font-medium tracking-[0.04em] transition-colors",
            currentScreen === tb.id ? "text-electric" : "text-text-lo"
          )}
        >
          <span className="text-lg leading-none">{tb.ic}</span>
          {tb.l}
        </button>
      ))}
    </div>
  );
}
