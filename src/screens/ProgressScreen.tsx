import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/UI/Card';

export function ProgressScreen() {
  const user = useAppStore((state) => state.user);
  const streak = useAppStore((state) => state.streak);
  const xp = useAppStore((state) => state.xp);
  
  return (
    <div className="flex flex-col flex-1 p-4 pb-[90px] overflow-y-auto overflow-x-hidden relative">
      <div className="flex justify-center items-center py-3.5 px-5 text-[18px] text-text-lo font-medium">
        <span>Tu Progreso</span>
      </div>

      <div className="flex justify-center my-6">
        <div className="w-[84px] h-[84px] rounded-full border border-border flex items-center justify-center text-[34px] font-bold text-white bg-gradient-to-br from-[#1a2030] to-[#0d1018]">
          {user?.name?.charAt(0).toUpperCase() || 'J'}
        </div>
      </div>
      <div className="text-center font-montserrat font-bold text-[24px] mb-6">{user?.name || 'Juan'}</div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="flex flex-col items-center justify-center p-6 mb-0">
          <div className="text-[28px] mb-2">🔥</div>
          <div className="font-montserrat font-extrabold text-[24px] text-flash">{streak}</div>
          <div className="text-[18px] text-text-lo uppercase tracking-[0.1em] mt-1">Días Seguidos</div>
        </Card>
        <Card className="flex flex-col items-center justify-center p-6 mb-0">
          <div className="text-[28px] mb-2">⚡</div>
          <div className="font-montserrat font-extrabold text-[24px] text-electric">{xp}</div>
          <div className="text-[18px] text-text-lo uppercase tracking-[0.1em] mt-1">Total XP</div>
        </Card>
      </div>

      <div className="font-montserrat font-bold text-[18px] mb-3">Tus Insignias</div>
      <Card className="flex gap-4 items-center">
        <div className="w-12 h-12 rounded-full bg-[rgba(0,255,148,0.1)] border border-[rgba(0,255,148,0.3)] flex items-center justify-center text-[22px]">
          🎯
        </div>
        <div>
          <div className="font-bold text-[18px] text-text-hi mb-0.5">Primer Trade</div>
          <div className="text-[18px] text-text-lo">Completaste tu primera simulación.</div>
        </div>
      </Card>
      <Card className="flex gap-4 items-center opacity-50">
        <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-[22px] grayscale">
          🏆
        </div>
        <div>
          <div className="font-bold text-[18px] text-text-hi mb-0.5">Racha de 30 días</div>
          <div className="text-[18px] text-text-lo">Aún en progreso (14/30).</div>
        </div>
      </Card>
    </div>
  );
}
