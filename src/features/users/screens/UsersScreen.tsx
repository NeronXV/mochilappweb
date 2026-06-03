import React from 'react';
import { Search, UserPlus, Trash2, X, AlertTriangle } from 'lucide-react';
import { MochilaUser } from '../../../types';

interface UsersScreenProps {
  userQuery: string;
  setUserQuery: (query: string) => void;
  userRoleFilter: 'All' | 'Admin' | 'Viajero' | 'Proveedor' | 'Cliente destacado';
  setUserRoleFilter: (role: 'All' | 'Admin' | 'Viajero' | 'Proveedor' | 'Cliente destacado') => void;
  filteredUsersList: MochilaUser[];
  showAddAdmin: boolean;
  setShowAddAdmin: (show: boolean) => void;
  newAdminName: string;
  setNewAdminName: (name: string) => void;
  newAdminEmail: string;
  setNewAdminEmail: (email: string) => void;
  createAdmin: (e: React.FormEvent) => void;
  awardPoints: (userId: string, pts: number) => void;
  toggleUserStatus: (user: MochilaUser) => void;
  deleteUser: (uId: string) => void;
  usingLocalFallback: boolean;
}

export default function UsersScreen({
  userQuery,
  setUserQuery,
  userRoleFilter,
  setUserRoleFilter,
  filteredUsersList,
  showAddAdmin,
  setShowAddAdmin,
  newAdminName,
  setNewAdminName,
  newAdminEmail,
  setNewAdminEmail,
  createAdmin,
  awardPoints,
  toggleUserStatus,
  deleteUser,
  usingLocalFallback,
}: UsersScreenProps) {
  return (
    <div className="space-y-4 font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl p-4 md:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por Nombre, Email o Firebase UID..." 
              value={userQuery} 
              onChange={e => setUserQuery(e.target.value)} 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 text-sm outline-none" 
            />
          </div>

          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border">
            {(['All', 'Admin', 'Viajero', 'Proveedor', 'Cliente destacado'] as const).map(role => (
              <button 
                key={role} 
                onClick={() => setUserRoleFilter(role)} 
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${userRoleFilter === role ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
              >
                {role === 'All' ? 'Todos' : role}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => setShowAddAdmin(true)} 
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-md shadow-purple-600/10 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Registrar Administrador</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                <th className="py-3 px-5">Mochilero / Administrador</th>
                <th className="py-3 px-5">Correo Electrónico</th>
                <th className="py-3 px-5">Fidelización</th>
                <th className="py-3 px-5">Rango Pasaporte</th>
                <th className="py-3 px-5">Estado</th>
                <th className="py-3 px-5 text-right">Controles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredUsersList.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-cyan-50 text-cyan-800 font-bold flex items-center justify-center uppercase">
                        {u.name ? u.name[0] : 'U'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{u.name}</h4>
                        <span className="text-[11px] font-mono text-slate-400 block mt-0.5">ID: {u.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5 font-mono text-slate-500 text-xs">{u.email}</td>
                  <td className="py-3 px-5 font-mono">
                    <div className="flex items-center gap-2">
                      <strong className="text-teal-600 text-sm">{u.mochiPuntos || 0} pts</strong>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => awardPoints(u.id, 50)} className="bg-slate-100 hover:bg-slate-200 border px-1.5 py-0.5 rounded text-[11px] font-bold text-slate-700 cursor-pointer">+50</button>
                        <button onClick={() => awardPoints(u.id, -50)} className="bg-slate-100 hover:bg-slate-200 border px-1.5 py-0.5 rounded text-[11px] font-bold text-slate-700 cursor-pointer">-50</button>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <span className="bg-amber-50 text-amber-800 text-xs py-1 px-2.5 rounded-full border border-amber-200 font-medium">
                      {u.passportLevel || 'Explorador'}
                    </span>
                  </td>
                  <td className="py-3 px-5">
                    <span className={`w-2 h-2 rounded-full inline-block mr-1.5 ${u.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <span className="font-semibold inline-block text-xs uppercase tracking-wider">{u.status === 'active' ? 'Activo' : 'Suspendido'}</span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    {usingLocalFallback ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => toggleUserStatus(u)} 
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${u.status === 'active' ? 'bg-rose-50 border border-rose-100 text-rose-600' : 'bg-emerald-50 border border-emerald-100 text-emerald-700'}`}
                        >
                          {u.status === 'active' ? 'Suspender' : 'Activar'}
                        </button>
                        <button onClick={() => deleteUser(u.id)} className="p-1 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-slate-650"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-bold uppercase select-none">Solo Lectura (Producción)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddAdmin && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={createAdmin} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button type="button" onClick={() => setShowAddAdmin(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-605"><X className="w-4 h-4" /></button>
            <h3 className="text-base font-bold text-slate-800 mb-2">Registrar Nuevo Administrador</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">Otorgará permisos absolutos de control mercantil y moderación.</p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Nombre del Encargado</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Sandra Luz" 
                  value={newAdminName} 
                  onChange={e => setNewAdminName(e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">E-mail Corporativo</label>
                <input 
                  type="email" 
                  required 
                  placeholder="sandra@mochilapp.com" 
                  value={newAdminEmail} 
                  onChange={e => setNewAdminEmail(e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none" 
                />
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => setShowAddAdmin(false)} className="flex-1 py-2 border rounded-xl text-xs font-semibold text-slate-505 cursor-pointer">Cancelar</button>
              <button type="submit" className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer">Guardar Registro</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
