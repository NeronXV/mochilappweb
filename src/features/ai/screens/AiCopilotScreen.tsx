import React from 'react';
import { Sparkles, Send } from 'lucide-react';
import { AiMessage } from '../../../types';

interface AiCopilotScreenProps {
  aiMessages: AiMessage[];
  chatIn: string;
  setChatIn: (value: string) => void;
  runAiCommand: (cmd: string) => Promise<void>;
  handleCreatePackage: (e?: React.FormEvent) => Promise<void>;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function AiCopilotScreen({
  aiMessages,
  chatIn,
  setChatIn,
  runAiCommand,
  handleCreatePackage,
  showToast,
}: AiCopilotScreenProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[550px] font-sans">
      {/* Copilot Chat Screen */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col justify-between overflow-hidden">
        <div className="p-4 border-b flex items-center gap-2 bg-gradient-to-r from-teal-50 to-cyan-50">
          <Sparkles className="w-5 h-5 text-teal-600 animate-spin" />
          <div>
            <h3 className="font-bold text-sm text-slate-800">MochiCopilot Inteligente V2</h3>
            <span className="text-[10px] text-teal-700 font-mono font-bold">Offline Generative Sandbox • Pedro Super Admin</span>
          </div>
        </div>

        {/* Chat Flow Container scrollable block */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {aiMessages.map(msg => (
            <div key={msg.id} className={`flex gap-3 max-w-xl ${msg.sender === 'admin' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center uppercase shrink-0 ${
                msg.sender === 'admin' ? 'bg-indigo-600 text-white' : 'bg-gradient-to-tr from-cyan-400 to-emerald-500 text-white shadow'
              }`}>{msg.sender === 'admin' ? 'P' : 'M'}</div>
              
              <div className={`p-4 rounded-3xl ${
                msg.sender === 'admin' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-none leading-relaxed'
              }`}>
                <p className="text-xs whitespace-pre-line font-medium">{msg.text}</p>
                
                {msg.text.includes('La Paz Salvaje') && (
                  <div className="mt-3 p-3 bg-white border rounded-2xl flex items-center justify-between text-[11px] font-semibold text-slate-700">
                    <span>¿Inyectar este itinerario sugerido?</span>
                    <button 
                      onClick={() => { handleCreatePackage(); showToast("¡Paquete inyectado con IA!", "success"); }} 
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
                    >
                      Inyectar Pack
                    </button>
                  </div>
                )}

                <span className={`text-[8px] font-mono block mt-1.5 ${msg.sender === 'admin' ? 'text-white/60 text-right' : 'text-slate-400'}`}>{msg.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input section bar */}
        <div className="p-4 border-t bg-slate-50 flex gap-2">
          <input 
            type="text" 
            placeholder="Pregúntale a MochiCopilot Ej: 'Diseña un itinerario en La Paz', 'Sugiéreme copies'..." 
            value={chatIn} 
            onChange={e => setChatIn(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && runAiCommand(chatIn)} 
            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-teal-500/20" 
          />
          <button 
            onClick={() => runAiCommand(chatIn)} 
            className="p-2.5 bg-teal-600 text-white hover:bg-teal-700 rounded-2xl shadow transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Helper presets sidebar (4 cols) */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-widest font-mono mb-4">Comandos Rápidos Admin</h4>
          <div className="space-y-2">
            {[
              { label: '🧗‍♂️ Crear Itinerario La Paz', text: 'Dame sugerencia de itinerario para La Paz' },
              { label: '🎯 Sugerir Campaña de Cashback', text: 'Planea una promocion para mochileros frecuentes' },
              { label: '⚡ Crear copys de Instagram', text: 'Escribe copys para redes sociales sobre sustentabilidad' },
              { label: '⛽ Ideas de apoyo y subsidio', text: 'Sugiéreme cómo gastar el Fondo de Incentivos Turísticos' }
            ].map((preset, id) => (
              <button 
                key={id} 
                onClick={() => runAiCommand(preset.text)} 
                className="w-full text-left p-3 border border-slate-100 hover:border-teal-300 hover:bg-teal-50/20 rounded-xl transition-all font-semibold text-[11px] text-slate-700 block cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[10px] text-slate-400 leading-snug bg-slate-50 rounded-2xl border border-slate-100 p-3 mt-4">
          <p><strong>Nota:</strong> Todas las llamadas a IA están simuladas de forma local por motivos de seguridad en desarrollo. Listas e itinerarios son inyectables a la base en tiempo real.</p>
        </div>
      </div>
    </div>
  );
}
