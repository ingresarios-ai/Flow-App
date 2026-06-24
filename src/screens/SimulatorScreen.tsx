import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { GenyBubble } from '@/components/UI/GenyBubble';
import { Chart } from '@/components/Simulator/Chart';
import { cn } from '@/components/UI/Card';

export function SimulatorScreen() {
  const balance = useAppStore((state) => state.balance);
  const openPosition = useAppStore((state) => state.openPosition);
  const setOpenPosition = useAppStore((state) => state.setOpenPosition);
  const updateBalance = useAppStore((state) => state.updateBalance);

  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const symbol = 'BTCUSDT'; // Binance symbol for Bitcoin

  const currentPL = openPosition
    ? (currentPrice - openPosition.entryPrice) * (openPosition.type === 'CALL' ? 100 : -100)
    : 0;

  const handleOpenPosition = (type: 'CALL' | 'PUT') => {
    if (currentPrice > 0 && !openPosition) {
      setOpenPosition({ type, entryPrice: currentPrice });
    }
  };

  const handleClosePosition = () => {
    if (openPosition && currentPrice > 0) {
      updateBalance(currentPL);
      setOpenPosition(null);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-0 pb-[90px] overflow-hidden relative bg-abyss">
      {/* Header Info */}
      <div className="flex justify-between items-end p-4 pb-2 z-10">
        <div>
          <div className="text-[18px] text-text-lo uppercase tracking-[0.1em] font-semibold mb-1">
            Simulador · {symbol.split(':')[1]}
          </div>
          <div className="font-montserrat font-bold text-[28px] leading-none">
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[18px] text-text-lo uppercase tracking-[0.1em] font-semibold mb-1">P&L Abierto</div>
          <div className={cn("font-montserrat font-bold text-[18px]", currentPL > 0 ? "text-profit" : currentPL < 0 ? "text-plasma" : "text-text-lo")}>
            {currentPL > 0 ? '+' : ''}{currentPL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 relative min-h-[300px]">
        <Chart symbol={symbol} onPriceUpdate={setCurrentPrice} />
        
        {/* Overlay Geny */}
        <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
          <GenyBubble>
            {openPosition 
              ? (currentPL > 0 ? "Buen timing. Mantén la calma y define tu salida." : "El mercado se movió en contra. ¿Cuál es tu límite de pérdida?")
              : "Analiza el gráfico de velas. Espera tu setup, no te apresures."
            }
          </GenyBubble>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 bg-surface border-t border-border/50">
        <div className="flex justify-between items-center mb-3">
          <div className="text-[18px] text-text-lo font-medium">Contratos: 100</div>
          <div className="text-[18px] text-text-hi font-medium font-montserrat">
            Precio: ${currentPrice > 0 ? currentPrice.toFixed(2) : '---'}
          </div>
        </div>
        
        {!openPosition ? (
          <div className="flex gap-3">
            <button
              onClick={() => handleOpenPosition('PUT')}
              className="flex-1 p-3.5 rounded-xl border-none cursor-pointer font-montserrat font-bold text-[18px] uppercase bg-[rgba(255,62,176,0.15)] text-plasma border border-[rgba(255,62,176,0.3)] transition-transform active:scale-95"
            >
              Comprar PUT
            </button>
            <button
              onClick={() => handleOpenPosition('CALL')}
              className="flex-1 p-3.5 rounded-xl border-none cursor-pointer font-montserrat font-bold text-[18px] uppercase bg-[rgba(0,255,148,0.15)] text-profit border border-[rgba(0,255,148,0.3)] transition-transform active:scale-95"
            >
              Comprar CALL
            </button>
          </div>
        ) : (
          <button
            onClick={handleClosePosition}
            className="w-full p-3.5 rounded-xl border-none cursor-pointer font-montserrat font-bold text-[18px] uppercase bg-flash text-[#111] transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,217,61,0.3)]"
          >
            Cerrar Posición ({currentPL > 0 ? '+' : ''}{currentPL.toFixed(2)})
          </button>
        )}
      </div>
    </div>
  );
}
