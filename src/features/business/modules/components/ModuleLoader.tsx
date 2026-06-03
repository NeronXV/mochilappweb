/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function ModuleLoader() {
  return (
    <div className="flex flex-col justify-center items-center py-24 text-center space-y-4 bg-white border border-slate-200 rounded-3xl p-12 shadow-sm animate-fade-in">
      <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      <div className="space-y-1">
        <p className="text-xs font-black text-slate-800 uppercase tracking-wider">Cargando módulo especial...</p>
        <p className="text-[10px] text-slate-500 font-medium">Preparando interfaz y analizando cupos en tiempo real</p>
      </div>
    </div>
  );
}
