import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card, Button } from '@/components/UI/Card';

export function IntroScreen() {
  const setScreen = useAppStore((state) => state.setScreen);

  return (
    <div className="flex flex-col flex-1 p-4 pb-24 overflow-y-auto overflow-x-hidden relative">
      <div className="absolute w-[240px] h-[240px] rounded-full pointer-events-none blur-[10px] bg-[radial-gradient(circle,rgba(0,210,255,0.2),transparent_70%)] top-[-50px] right-[-60px]" />
      <div className="absolute w-[240px] h-[240px] rounded-full pointer-events-none blur-[10px] bg-[radial-gradient(circle,rgba(255,62,176,0.16),transparent_70%)] bottom-[80px] left-[-70px]" />

      <div className="flex justify-center items-center py-3.5 px-5 text-[18px] text-text-lo font-medium">
        <span>FLOW</span>
      </div>

      <div className="text-center my-5">
        <div className="font-montserrat font-extrabold text-[40px] bg-gradient-to-r from-electric to-plasma bg-clip-text text-transparent">
          FLOW
        </div>
        <div className="text-[18px] tracking-[0.25em] uppercase text-text-lo mt-1.5">
          by Ingresarios
        </div>
      </div>

      <div className="flex justify-center my-6">
        <div className="w-[74px] h-[74px] rounded-full shrink-0 relative flex items-center justify-center animate-[pulse_2.6s_ease-in-out_infinite] bg-[radial-gradient(circle_at_35%_30%,#7af0ff,#00D2FF_45%,#FF3EB0)] shadow-[0_0_18px_rgba(0,210,255,0.5)]">
          <span className="text-white/90 text-[26px]">✦</span>
        </div>
      </div>

      <div className="font-montserrat font-extrabold text-[23px] leading-[1.15] text-center px-1.5 mb-3 text-text-hi">
        Hola, soy <span className="bg-gradient-to-r from-electric to-plasma bg-clip-text text-transparent">Geny</span>.<br />
        Aprendamos a operar <span className="bg-gradient-to-r from-electric to-plasma bg-clip-text text-transparent">haciendo</span>.
      </div>

      <p className="text-[18px] text-text-lo leading-[1.6] text-center px-2 mb-4">
        Practicas en un simulador sin riesgo y yo te corrijo en el momento. Me adapto a tu horario y a tus rachas: tú pones los minutos, yo pongo el sistema.
      </p>

      <Card className="flex gap-3 items-center mb-2">
        <div className="text-[22px]">⏱️</div>
        <div>
          <b className="text-[18px] text-text-hi">Se adapta a tu tiempo</b>
          <span className="block text-[18px] text-text-lo">¿5 min o 30? Geny arma la sesión</span>
        </div>
      </Card>
      
      <Card className="flex gap-3 items-center mb-2">
        <div className="text-[22px]">🔥</div>
        <div>
          <b className="text-[18px] text-text-hi">Crece con tu racha</b>
          <span className="block text-[18px] text-text-lo">Sube la dificultad cuando estás listo</span>
        </div>
      </Card>

      <Card className="flex gap-3 items-center mb-auto">
        <div className="text-[22px]">🎯</div>
        <div>
          <b className="text-[18px] text-text-hi">Te corrige y te acompaña</b>
          <span className="block text-[18px] text-text-lo">Feedback en cada trade, todos los días</span>
        </div>
      </Card>

      <div className="mt-4 flex flex-col gap-3">
        <Button onClick={() => setScreen('signup')}>
          Crear cuenta nueva →
        </Button>

        <button 
          onClick={() => setScreen('login')}
          className="w-full h-[52px] bg-white/5 border border-white/10 rounded-xl px-4 text-[18px] text-text-hi font-medium outline-none transition-all active:scale-[0.98] hover:bg-white/10 flex items-center justify-center gap-2"
        >
          Ya tengo cuenta, iniciar sesión
        </button>
      </div>

      <p className="text-[18px] text-text-lo text-center mt-4">
        Gratis · sin tarjeta · primer trade en 60 seg
      </p>
    </div>
  );
}
