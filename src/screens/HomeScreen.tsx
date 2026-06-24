import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/UI/Card';
import { GenyBubble } from '@/components/UI/GenyBubble';
import { modules } from '@/data/modules';
import { cn } from '@/components/UI/Card';

export function HomeScreen() {
  const setScreen = useAppStore((state) => state.setScreen);
  const user = useAppStore((state) => state.user);
  const streak = useAppStore((state) => state.streak);
  
  const completedLessons = useAppStore((state) => state.completedLessons);
  const setActiveLessonIndex = useAppStore((state) => state.setActiveLessonIndex);
  
  const [activeTab, setActiveTab] = useState<'basico' | 'avanzado'>('basico');
  const mod = modules[activeTab];
  
  // Calculate done based on the active tab. For now we assume linear progression.
  // We'll just map completedLessons to the linear sequence of all lessons.
  // Since 'basico' has 8 lessons, if completedLessons < 8, all 'avanzado' are locked.
  let startIdx = activeTab === 'basico' ? 0 : modules.basico.lessons.length;
  
  // To keep it simple, let's just compute status per lesson index globally.
  const getStatus = (globalIndex: number) => {
    if (globalIndex < completedLessons) return 'done';
    if (globalIndex === completedLessons) return 'current';
    return 'lock';
  };

  const doneInTab = mod.lessons.filter((_, i) => getStatus(startIdx + i) === 'done').length;
  const tot = mod.lessons.length;
  const prog = Math.round((doneInTab / tot) * 100);

  return (
    <div className="flex flex-col flex-1 p-4 pb-[90px] overflow-y-auto overflow-x-hidden relative">
      <div className="absolute w-[240px] h-[240px] rounded-full pointer-events-none blur-[10px] bg-[radial-gradient(circle,rgba(0,210,255,0.14),transparent_70%)] top-[-50px] left-1/2 -translate-x-1/2" />
      
      <div className="flex justify-center items-center py-3.5 px-5 text-[18px] text-text-lo font-medium">
        <span>Aprende</span>
      </div>

      <div className="flex justify-between items-center my-2 mb-3.5">
        <div className="font-montserrat font-extrabold text-[18px] bg-gradient-to-r from-electric to-plasma bg-clip-text text-transparent">
          FLOW
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a2030] to-[#0d1018] border border-border flex items-center justify-center text-[18px] font-bold text-electric">
          {user?.name?.charAt(0).toUpperCase() || 'J'}
        </div>
      </div>

      <GenyBubble>
        <span className="font-semibold text-text-hi">Buenas, {user?.name || 'Juan'}.</span> Detecté que sueles practicar a esta hora. Tu racha va fuerte 🔥 — preparé una sesión corta de <b>7 min</b> y subí un poco la dificultad.
      </GenyBubble>

      <Card className="flex gap-4 items-center">
        <div className="w-[120px] h-[120px] relative shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9"/>
            <circle cx="60" cy="60" r="50" fill="none" stroke="url(#gr)" strokeWidth="9" strokeLinecap="round" strokeDasharray="314" strokeDashoffset="64" transform="rotate(-90 60 60)"/>
            <defs>
              <linearGradient id="gr" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#FFD93D"/>
                <stop offset="1" stopColor="#FF3EB0"/>
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <b className="font-montserrat text-[36px] leading-none text-flash">{streak}</b>
            <small className="text-[18px] tracking-[0.18em] uppercase text-text-lo mt-[3px]">🔥 días</small>
          </div>
        </div>
        <div>
          <div className="font-montserrat font-bold text-[18px] mb-1.5">Tu racha de práctica</div>
          <div className="inline-flex items-center gap-1.5 text-[18px] font-semibold tracking-[0.04em] px-[11px] py-1.5 rounded-full bg-[rgba(255,217,61,0.1)] text-flash border border-[rgba(255,217,61,0.25)]">
            Récord: 21 días
          </div>
          <div className="inline-flex items-center gap-1.5 text-[18px] font-semibold tracking-[0.04em] px-[11px] py-1.5 rounded-full bg-[rgba(0,210,255,0.1)] text-electric border border-[rgba(0,210,255,0.25)] mt-1.5">
            Nivel 4 · Disciplinado
          </div>
        </div>
      </Card>

      <div className="font-montserrat font-bold text-[18px] my-1.5 mb-3">Ruta de Opciones</div>
      
      <div className="flex gap-2 my-1.5 mb-3">
        <button 
          onClick={() => setActiveTab('basico')}
          className={cn(
            "flex-1 p-[10px_6px] rounded-[11px] border text-[18px] font-bold font-montserrat cursor-pointer tracking-[0.01em]",
            activeTab === 'basico' ? "border-electric bg-[rgba(0,210,255,0.1)] text-electric" : "border-border/50 bg-surface text-text-lo"
          )}
        >
          ⚡ Básico
        </button>
        <button 
          onClick={() => setActiveTab('avanzado')}
          className={cn(
            "flex-1 p-[10px_6px] rounded-[11px] border text-[18px] font-bold font-montserrat cursor-pointer tracking-[0.01em]",
            activeTab === 'avanzado' ? "border-electric bg-[rgba(0,210,255,0.1)] text-electric" : "border-border/50 bg-surface text-text-lo"
          )}
        >
          🚀 Avanzado
        </button>
      </div>

      <Card className="flex justify-between items-center mb-0">
        <div>
          <div className="font-montserrat font-bold text-[18px]">{mod.name}</div>
          <div className="text-[18px] text-text-lo mt-0.5">{mod.sub}</div>
          <div className="h-[7px] rounded-full bg-white/5 overflow-hidden mt-2 w-[150px]">
            <i className="block h-full rounded-full bg-gradient-to-r from-electric to-profit" style={{ width: `${prog}%` }} />
          </div>
        </div>
        <div className="text-right">
          <div className="font-montserrat font-extrabold text-[18px] text-flash">⭐ {doneInTab}/{tot}</div>
          <div className="text-[18px] text-text-lo">corona</div>
        </div>
      </Card>

      <div className="flex flex-col items-center gap-6 py-4 px-0 relative">
        {mod.lessons.map((l, i) => {
          const globalIndex = startIdx + i;
          const st = getStatus(globalIndex);
          const face = st === 'done' ? '✓' : (st === 'lock' ? '🔒' : l.ic);
          
          const handleLessonClick = () => {
            if (st === 'lock') return;
            if ('sim' in l && l.sim) {
              setScreen('sim');
            } else {
              setActiveLessonIndex(globalIndex);
              setScreen('lesson');
            }
          };

          return (
            <div key={i} className={cn("relative flex flex-col items-center cursor-pointer group", st)} onClick={handleLessonClick}>
              {i !== 0 && (
                <div className="absolute top-[-24px] left-1/2 w-0 h-[24px] border-l-[3px] border-dashed border-white/10" />
              )}
              {st === 'current' && (
                <span className="absolute top-[-15px] left-1/2 -translate-x-1/2 text-[18px] font-bold tracking-[0.1em] bg-electric text-[#04210f] px-2 py-0.5 rounded-full whitespace-nowrap font-montserrat z-10">
                  EMPIEZA
                </span>
              )}
              <div className={cn(
                "w-[60px] h-[60px] rounded-full flex items-center justify-center text-[23px] border-2 transition-transform group-active:scale-95",
                st === 'done' ? "bg-[rgba(0,255,148,0.14)] border-profit text-profit" : 
                st === 'current' ? "bg-[rgba(0,210,255,0.16)] border-electric shadow-[0_0_18px_rgba(0,210,255,0.4)] animate-[pulse_2.2s_infinite]" : 
                "opacity-40 border-border bg-surface text-text-lo"
              )}>
                {face}
              </div>
              <div className={cn("text-[18px] mt-1.5 text-center max-w-[160px] font-medium leading-[1.25]", st === 'lock' ? "text-text-lo" : "text-text-hi")}>
                {l.t}
              </div>
              {st !== 'lock' && (
                <div className="text-[18px] text-flash font-semibold mt-0.5">+{l.xp} XP</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
