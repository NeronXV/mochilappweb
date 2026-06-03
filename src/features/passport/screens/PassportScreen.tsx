import React from 'react';
import { Award } from 'lucide-react';
import { MochilaUser } from '../../../types';

interface PassportScreenProps {
  users: MochilaUser[];
  awardPoints: (userId: string, points: number) => void;
}

export default function PassportScreen({
  users,
  awardPoints,
}: PassportScreenProps) {
  return (
    <div className="space-y-6 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-gradient-to-r from-teal-600 to-cyan-600 p-6 rounded-3xl text-white">
        <div className="md:col-span-3">
          <h3 className="font-extrabold text-lg flex items-center gap-2">
            <Award className="w-6 h-6 animate-pulse" />
            <span>Estrategia de Fidelización Pasaporte Mochilapp</span>
          </h3>
          <p className="text-xs text-slate-100/90 leading-relaxed mt-2">
            Los mochileros ganan automáticamente MochiPuntos por registrar excursiones, dejar reseñas estructuradas a prestadores comunitarios, visitar localidades rurales o unirse a rutas coordinadas de temporada. Estos puntos financian incentivos de descuentos parciales en la próxima reserva.
          </p>
        </div>
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4 flex flex-col justify-center text-center shrink-0">
          <span className="text-[10px] font-mono tracking-widest font-bold text-cyan-200">Emitidos a la Fecha</span>
          <span className="text-2xl font-black mt-1">42,850 MochiPuntos</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Point attribution helper rulebox */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-widest font-mono mb-4">Reglas de Atribución (Puntos)</h4>
          <div className="space-y-3.5 text-xs">
            {[
              { rule: 'Reservar Aventura Turística', pts: '+100 puntos', desc: 'Por cada reservación exitosa' },
              { rule: 'Calificar Cabaña o Excursión', pts: '+30 puntos', desc: 'Reseña aprobada de prestador' },
              { rule: 'Subir post aprobado en Feed', pts: '+20 puntos', desc: 'Verificado por el administrador' },
              { rule: 'Recomendar Amigo Viajero', pts: '+150 puntos', desc: 'Al realizar su primer abono' },
              { rule: 'Completar Ruta Protegida', pts: '+300 puntos', desc: 'Incentivo extremo de localidades' }
            ].map((rule, idx) => (
              <div key={idx} className="border-b pb-2 flex justify-between items-start gap-4">
                <div>
                  <strong className="text-slate-800 font-semibold">{rule.rule}</strong>
                  <p className="text-[10px] text-slate-400 mt-0.5">{rule.rule === 'Completar Ruta Protegida' ? 'Fondo de conectividad turística' : rule.desc}</p>
                </div>
                <span className="bg-emerald-50 text-emerald-800 font-mono font-bold text-[10px] px-2 py-0.5 rounded-full shrink-0">{rule.pts}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Users point balances tables */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-4">Estados de Cuentas Fidelizadas de Viajeros</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                  <th className="py-3.5 px-4">Viajero</th>
                  <th className="py-3.5 px-4">Nivel Pasaporte</th>
                  <th className="py-3.5 px-4">Puntos Acumulados</th>
                  <th className="py-3.5 px-4 text-right">Incentivos Administrativos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-sans">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center font-bold text-cyan-800 text-xs uppercase">{u.name[0]}</div>
                        <span className="font-bold text-slate-800 text-sm">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-amber-50 text-amber-700 font-semibold py-1 px-2.5 rounded-full border border-amber-200 text-xs uppercase">{u.passportLevel}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-teal-700 text-sm">{u.mochiPuntos || 150} MochiPuntos</td>
                    <td className="py-3 px-4 text-right font-sans">
                      <div className="inline-flex gap-1.5">
                        <button 
                          onClick={() => awardPoints(u.id, 100)} 
                          className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 px-2 py-1.5 rounded text-xs font-bold cursor-pointer"
                        >
                          Bonificar +100
                        </button>
                        <button 
                          onClick={() => awardPoints(u.id, -100)} 
                          className="bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 px-2 py-1.5 rounded text-xs font-bold cursor-pointer"
                        >
                          Canjear Cupón -100
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
