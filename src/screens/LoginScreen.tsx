import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/UI/Card';

export function LoginScreen() {
  const setScreen = useAppStore((state) => state.setScreen);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Ingresa tu correo y contraseña para continuar.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      useAppStore.setState({ 
        user: { name: data.user.name, email: data.user.email, phone: data.user.phone },
        streak: data.user.streak,
        xp: data.user.xp,
        completedLessons: Math.floor(data.user.xp / 25) // Simple heuristic, ideally stored in DB
      });
      
      setScreen('home');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-4 pb-[90px] overflow-y-auto overflow-x-hidden relative">
      <div className="absolute w-[300px] h-[300px] rounded-full pointer-events-none blur-[40px] bg-[radial-gradient(circle,rgba(255,217,61,0.08),transparent_70%)] top-[-100px] left-[-100px]" />
      
      <div className="mt-8 mb-6 relative">
        <h1 className="font-montserrat font-extrabold text-[32px] leading-[1.1] tracking-[-0.02em] bg-gradient-to-r from-electric to-profit bg-clip-text text-transparent">
          Bienvenido<br/>de vuelta
        </h1>
        <p className="text-[18px] text-text-lo mt-2 leading-[1.4] font-medium max-w-[280px]">
          Ingresa tu correo para recuperar tu progreso.
        </p>
      </div>

      <div className="flex flex-col gap-3 relative z-10">
        <input 
          type="email" 
          placeholder="Correo electrónico" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[52px] bg-white/5 border border-white/10 rounded-xl px-4 text-[18px] text-text-hi font-medium outline-none transition-all focus:border-electric focus:bg-white/10 placeholder:text-text-lo/50"
        />

        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-[52px] bg-white/5 border border-white/10 rounded-xl px-4 text-[18px] text-text-hi font-medium outline-none transition-all focus:border-electric focus:bg-white/10 placeholder:text-text-lo/50"
        />

        {errorMsg && (
          <div className="text-plasma text-[18px] mt-1 font-bold text-center">
            {errorMsg}
          </div>
        )}

        <Button className="mt-4 mb-2" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? 'Cargando...' : 'Entrar →'}
        </Button>

        <button 
          onClick={() => setScreen('signup')}
          className="w-full h-[52px] bg-white/5 border border-white/10 rounded-xl px-4 text-[18px] text-text-hi font-medium outline-none transition-all active:scale-[0.98] hover:bg-white/10 flex items-center justify-center gap-2"
        >
          No tengo cuenta, registrarme gratis
        </button>
      </div>
    </div>
  );
}
