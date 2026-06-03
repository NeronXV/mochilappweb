/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Toast } from '../../../../types';
import Toasts from '../../../../shared/components/Toasts';

interface BusinessLoginScreenProps {
  loginEmail: string;
  setLoginEmail: (email: string) => void;
  loginPassword: string;
  setLoginPassword: (password: string) => void;
  loginError: string;
  signingIn: boolean;
  firebaseEnabled: boolean;
  toasts: Toast[];
  onSubmit: (e: React.FormEvent) => void;
}

export default function BusinessLoginScreen({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  loginError,
  signingIn,
  firebaseEnabled,
  toasts,
  onSubmit,
}: BusinessLoginScreenProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.15]" />
      
      {/* Alerts stack */}
      <Toasts toasts={toasts} />

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 grid md:grid-cols-12 overflow-hidden relative z-10">
        <div className="hidden md:flex md:col-span-5 relative bg-emerald-950 flex-col justify-end p-8 text-white">
          <img 
            referrerPolicy="no-referrer" 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=600" 
            alt="Viajeros y naturaleza" 
            className="absolute inset-0 w-full h-full object-cover opacity-50" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/40 to-transparent" />
          <div className="relative z-10 space-y-4">
            <span className="bg-emerald-400/20 border border-emerald-400/30 text-emerald-300 text-xs font-mono py-1 px-3 rounded-full uppercase">Prestador Turístico</span>
            <h1 className="text-3xl font-black tracking-tight leading-tight">MOCHILAPP BUSINESS</h1>
            <p className="text-xs text-slate-200 font-light leading-relaxed">
              Administra tus servicios, controla tus reservas en tiempo real y conecta de forma directa con viajeros de todo el mundo.
            </p>
          </div>
        </div>

        <div className="col-span-12 md:col-span-7 p-8 md:p-12 flex flex-col justify-between">
          <div className="max-w-md w-full mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center p-1.5 shadow-lg">
                <img src="/logocolor.png" alt="Mochilapp Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 leading-none">Mochilapp</h2>
                <span className="text-[9px] font-mono tracking-widest text-emerald-600 font-bold">BUSINESS PANEL</span>
              </div>
            </div>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Ingreso de Socios</h2>
            <p className="text-xs text-slate-500 mb-6">Accede para gestionar tus itinerarios, reservas y ver estadísticas de ventas.</p>

            {loginError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs flex gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">E-mail de Prestador</label>
                <input 
                  type="email" 
                  required 
                  placeholder="socio@tuempresa.com" 
                  value={loginEmail} 
                  onChange={e => setLoginEmail(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-xs outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Contraseña</label>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••••••" 
                  value={loginPassword} 
                  onChange={e => setLoginPassword(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-xs outline-none transition-all" 
                />
              </div>

              <button 
                type="submit" 
                disabled={signingIn} 
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 text-white text-xs font-bold font-display rounded-xl shadow-lg shadow-emerald-600/10 transition-all cursor-pointer font-sans"
              >
                {signingIn ? 'Iniciando sesión...' : 'Ingresar al Panel de Negocios'}
              </button>
            </form>
          </div>

          <div className="text-[10px] text-slate-400 font-mono flex justify-between mt-8 border-t pt-4">
            <span>Mochilapp LatinAmerica © 2026</span>
            <span>v1.0-mvp</span>
          </div>
        </div>
      </div>
    </div>
  );
}
