import React, { useState, useEffect } from 'react';

const COUNTRIES = [
  { code: 'MX', dial: '+52', flag: '🇲🇽', name: 'México' },
  { code: 'CO', dial: '+57', flag: '🇨🇴', name: 'Colombia' },
  { code: 'AR', dial: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: 'PE', dial: '+51', flag: '🇵🇪', name: 'Perú' },
  { code: 'CL', dial: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: 'EC', dial: '+593', flag: '🇪🇨', name: 'Ecuador' },
  { code: 'GT', dial: '+502', flag: '🇬🇹', name: 'Guatemala' },
  { code: 'CU', dial: '+53', flag: '🇨🇺', name: 'Cuba' },
  { code: 'BO', dial: '+591', flag: '🇧🇴', name: 'Bolivia' },
  { code: 'DO', dial: '+1', flag: '🇩🇴', name: 'República Dominicana' },
  { code: 'HN', dial: '+504', flag: '🇭🇳', name: 'Honduras' },
  { code: 'PY', dial: '+595', flag: '🇵🇾', name: 'Paraguay' },
  { code: 'SV', dial: '+503', flag: '🇸🇻', name: 'El Salvador' },
  { code: 'NI', dial: '+505', flag: '🇳🇮', name: 'Nicaragua' },
  { code: 'CR', dial: '+506', flag: '🇨🇷', name: 'Costa Rica' },
  { code: 'PA', dial: '+507', flag: '🇵🇦', name: 'Panamá' },
  { code: 'UY', dial: '+598', flag: '🇺🇾', name: 'Uruguay' },
  { code: 'VE', dial: '+58', flag: '🇻🇪', name: 'Venezuela' },
  { code: 'ES', dial: '+34', flag: '🇪🇸', name: 'España' },
  { code: 'US', dial: '+1', flag: '🇺🇸', name: 'Estados Unidos' },
];

interface PhoneInputProps {
  value: string;
  onChange: (fullNumber: string) => void;
  className?: string;
}

export function PhoneInput({ value, onChange, className = '' }: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState('MX');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Auto-detect country on mount
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.country_code && COUNTRIES.find(c => c.code === data.country_code)) {
          setCountryCode(data.country_code);
        }
      })
      .catch(() => { /* silently fail and keep default MX */ });
  }, []);

  // Update parent when country or number changes
  useEffect(() => {
    const selected = COUNTRIES.find(c => c.code === countryCode);
    if (selected && phoneNumber) {
      onChange(`${selected.dial} ${phoneNumber}`);
    } else {
      onChange(''); // Invalid/empty
    }
  }, [countryCode, phoneNumber, onChange]);

  const selectedCountry = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];

  return (
    <div className={`flex w-full h-[52px] bg-white/5 border border-white/10 rounded-xl transition-all focus-within:border-electric focus-within:bg-white/10 ${className}`}>
      {/* Country Selector */}
      <div className="relative flex items-center h-full border-r border-white/10">
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        >
          {COUNTRIES.map(c => (
            <option key={c.code} value={c.code}>
              {c.name} ({c.dial})
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1.5 px-3 pointer-events-none text-[18px]">
          <span className="text-lg leading-none">{selectedCountry.flag}</span>
          <span className="text-text-hi font-medium">{selectedCountry.dial}</span>
          <svg className="w-3 h-3 text-text-lo ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Phone Number Input */}
      <input
        type="tel"
        placeholder="Número de teléfono"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9\s-]/g, ''))} // only digits, spaces, hyphens
        className="flex-1 h-full bg-transparent px-3 text-[18px] text-text-hi font-medium outline-none placeholder:text-text-lo/50 rounded-r-xl"
      />
    </div>
  );
}
