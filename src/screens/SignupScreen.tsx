import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/UI/Card';
import { PhoneInput } from '@/components/UI/PhoneInput';
import { GenyBubble } from '@/components/UI/GenyBubble';

export function SignupScreen() {
  const setScreen = useAppStore((state) => state.setScreen);
  const setUser = useAppStore((state) => state.setUser);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    if (!name || !email || !password || !phone) {
      setErrorMsg('Todos los campos son obligatorios.');
      return;
    }

    // Validate password doesn't contain non-Latin1 characters (codes > 255)
    // Supabase Auth uses btoa() internally which only supports Latin-1
    for (let i = 0; i < password.length; i++) {
      if (password.charCodeAt(i) > 255) {
        setErrorMsg('La contraseña contiene caracteres especiales no soportados. Usa solo letras, números y símbolos del teclado.');
        return;
      }
    }

    // Also validate email for non-ASCII chars
    for (let i = 0; i < email.length; i++) {
      if (email.charCodeAt(i) > 127) {
        setErrorMsg('El correo electrónico contiene caracteres no válidos.');
        return;
      }
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al registrar');
      }

      // Supabase user returned
      useAppStore.setState({ 
        user: { name: data.user.name, email: data.user.email, phone: data.user.phone },
        streak: data.user.streak,
        xp: data.user.xp
      });
      
      setScreen('home');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-4 pb-24 overflow-y-auto overflow-x-hidden relative">
      <div className="absolute w-[240px] h-[240px] rounded-full pointer-events-none blur-[10px] bg-[radial-gradient(circle,rgba(0,210,255,0.18),transparent_70%)] top-[-50px] left-[-50px]" />
      
      <div className="flex justify-center items-center py-3.5 px-5 text-[18px] text-text-lo font-medium">
        <span>Crear cuenta</span>
      </div>

      <div className="flex justify-start my-1.5">
        <button onClick={() => setScreen('intro')} className="bg-transparent border-none text-text-lo text-[20px] cursor-pointer leading-none">
          ←
        </button>
      </div>

      <GenyBubble>
        Para acompañarte y guardar tu progreso necesito 3 datos. Te aviso por WhatsApp cuando sea tu hora de practicar. 🔔
      </GenyBubble>

      <div className="mb-3">
        <label className="text-[18px] tracking-[0.16em] uppercase text-text-lo font-semibold block mb-1.5">
          Nombre
        </label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="¿Cómo te llamo?" 
          className="w-full p-3.5 rounded-xl border border-border/50 bg-surface text-text-hi text-[18px] font-sans focus:outline-none focus:border-electric focus:bg-[rgba(0,210,255,0.05)] placeholder-white/30"
        />
      </div>

      <div className="mb-3">
        <label className="text-[18px] tracking-[0.16em] uppercase text-text-lo font-semibold block mb-1.5">
          Datos de acceso
        </label>
        <input 
          type="email" 
          placeholder="Correo electrónico" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[52px] bg-white/5 border border-white/10 rounded-xl px-4 text-[18px] text-text-hi font-medium outline-none transition-all focus:border-electric focus:bg-white/10 placeholder:text-text-lo/50 mb-2"
        />

        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-[52px] bg-white/5 border border-white/10 rounded-xl px-4 text-[18px] text-text-hi font-medium outline-none transition-all focus:border-electric focus:bg-white/10 placeholder:text-text-lo/50 mb-2"
        />

        <PhoneInput
          value={phone}
          onChange={(fullNumber) => setPhone(fullNumber)}
          className="mb-2"
        />
      </div>

      <label className="flex gap-2.5 items-start text-[18px] text-text-lo my-1 leading-[1.4] cursor-pointer">
        <input type="checkbox" defaultChecked className="accent-profit w-4 h-4 mt-[1px]" />
        Acepto recibir mis lecciones y recordatorios por email y WhatsApp.
      </label>

      {errorMsg && (
        <div className="text-plasma text-[18px] mt-2 font-bold text-center">
          {errorMsg}
        </div>
      )}

      <Button className="mt-3.5" onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Registrando...' : 'Crear mi cuenta y empezar →'}
      </Button>

      <div className="flex gap-2 items-center text-[18px] text-text-lo bg-[rgba(0,255,148,0.06)] border border-[rgba(0,255,148,0.18)] rounded-[9px] p-[9px_11px] mb-4 leading-[1.4]">
        <span>✓</span> Sin tarjeta de crédito. Progreso guardado 100% gratis.
      </div>

      <button 
        onClick={() => setScreen('login')}
        className="w-full h-[52px] bg-white/5 border border-white/10 rounded-xl px-4 text-[18px] text-text-hi font-medium outline-none transition-all active:scale-[0.98] hover:bg-white/10 flex items-center justify-center gap-2"
      >
        Ya tengo cuenta, iniciar sesión
      </button>
    </div>
  );
}
