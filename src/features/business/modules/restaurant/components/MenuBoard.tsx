/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Utensils, Star, AlertTriangle, Coffee, Compass } from 'lucide-react';
import { formatCurrency } from '../../../../../shared/utils/formatCurrency';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  isAvailable: boolean;
  category: 'Entrada' | 'Platillo Fuerte' | 'Bebida' | 'Postre' | 'Especial';
}

interface MenuBoardProps {
  serviceMenu?: any[];
  serviceName: string;
  serviceDescription: string;
  servicePrice: number;
  isFoodStand: boolean;
}

export default function MenuBoard({
  serviceMenu,
  serviceName,
  serviceDescription,
  servicePrice,
  isFoodStand,
}: MenuBoardProps) {
  // 1. Resolver el Menú Digital
  const menuItems: MenuItem[] = React.useMemo(() => {
    // Si el servicio ya trae un menú en Firestore, lo usamos
    if (serviceMenu && serviceMenu.length > 0) {
      return serviceMenu.map((m, index) => ({
        id: m.id || String(index + 1),
        name: m.name || 'Platillo sin nombre',
        price: Number(m.price || 0),
        description: m.description || '',
        isAvailable: m.isAvailable !== false,
        category: m.category || 'Platillo Fuerte'
      }));
    }

    // Fallback MVP: Generar menú visual usando datos del servicio y stubs realistas
    return [
      {
        id: 'special-day',
        name: serviceName,
        price: servicePrice,
        description: serviceDescription || 'Nuestra especialidad de la casa preparada al momento.',
        isAvailable: true,
        category: 'Especial'
      },
      // Stubs adicionales para enriquecer el menú de forma visual
      {
        id: 'stub-starter',
        name: isFoodStand ? 'Tacos de Cortesía' : 'Entrada Típica del Puerto',
        price: Math.round(servicePrice * 0.3) || 45,
        description: 'Perfecto para empezar mientras se prepara tu orden.',
        isAvailable: true,
        category: 'Entrada'
      },
      {
        id: 'stub-drink',
        name: 'Agua Fresca del Día',
        price: 30,
        description: 'Frutas tropicales de temporada e ingredientes 100% locales.',
        isAvailable: true,
        category: 'Bebida'
      },
      {
        id: 'stub-out-of-stock',
        name: 'Postre Casero de Guayaba',
        price: Math.round(servicePrice * 0.4) || 60,
        description: 'Delicioso dulce tradicional cocinado a fuego lento.',
        isAvailable: false, // Opcional agotado para validar la visualización
        category: 'Postre'
      }
    ];
  }, [serviceMenu, serviceName, serviceDescription, servicePrice, isFoodStand]);

  // Agrupar platillos por categoría para restaurantes
  const categorizedMenu = React.useMemo(() => {
    const groups: { [key: string]: MenuItem[] } = {
      'Especial': [],
      'Entrada': [],
      'Platillo Fuerte': [],
      'Postre': [],
      'Bebida': []
    };

    menuItems.forEach(item => {
      if (groups[item.category]) {
        groups[item.category].push(item);
      } else {
        if (!groups['Platillo Fuerte']) groups['Platillo Fuerte'] = [];
        groups['Platillo Fuerte'].push(item);
      }
    });

    return groups;
  }, [menuItems]);

  return (
    <div className="space-y-6">
      {isFoodStand ? (
        // Modo Simplificado para FOOD_STAND (Puestos de comida callejera / rápidos)
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <Coffee className="w-4 h-4 text-cyan-600 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">
              MENÚ RÁPIDO DE COMIDA
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {menuItems.map(item => {
              const isSpecial = item.category === 'Especial';
              const isAvailable = item.isAvailable;

              return (
                <div 
                  key={item.id} 
                  className={`p-4 border rounded-2xl flex flex-col justify-between gap-3 relative overflow-hidden transition-all duration-300 hover:shadow-md ${
                    isSpecial ? 'bg-amber-50/50 border-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.15)]' :
                    !isAvailable ? 'bg-slate-50 border-slate-205/60 opacity-70' :
                    'bg-white border-slate-200'
                  }`}
                >
                  {isSpecial && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-amber-950 text-[7px] font-black uppercase px-2 py-0.5 rounded-bl-lg font-mono flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      RECOMENDADO
                    </div>
                  )}

                  <div>
                    <h4 className={`font-black text-xs ${isSpecial ? 'text-amber-900' : 'text-slate-800'}`}>
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100/80 pt-2 text-[10px] font-bold">
                    <span className={isSpecial ? 'text-amber-700' : 'text-emerald-700 font-black'}>
                      {formatCurrency(item.price)} MXN
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono ${
                      isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isAvailable ? 'Disponible' : 'Agotado'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Modo Elegante para RESTAURANT (Menú categorizado)
        <div className="space-y-6">
          {Object.keys(categorizedMenu).map(categoryName => {
            const items = categorizedMenu[categoryName];
            if (items.length === 0) return null;

            return (
              <div key={categoryName} className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-widest font-mono pb-1 border-b border-slate-100 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{categoryName === 'Especial' ? 'Especialidades de la Casa' : categoryName}</span>
                </h4>

                <div className="grid sm:grid-cols-2 gap-4">
                  {items.map(item => {
                    const isSpecial = item.category === 'Especial';
                    const isAvailable = item.isAvailable;

                    return (
                      <div 
                        key={item.id} 
                        className={`p-4 border rounded-2xl flex flex-col justify-between gap-3 relative overflow-hidden transition-all duration-300 hover:shadow-md ${
                          isSpecial ? 'bg-gradient-to-br from-amber-50 to-white border-amber-300 shadow-sm' :
                          !isAvailable ? 'bg-slate-50 border-slate-200/60 text-slate-450 opacity-60' :
                          'bg-white border-slate-200'
                        }`}
                      >
                        {isSpecial && (
                          <div className="absolute top-0 right-0 bg-amber-500 text-amber-950 text-[7px] font-black uppercase px-2.5 py-0.5 rounded-bl-lg font-mono flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            DESTACADO
                          </div>
                        )}

                        <div className="space-y-1">
                          <h5 className={`font-extrabold text-xs ${isSpecial ? 'text-amber-900' : 'text-slate-800'}`}>
                            {item.name}
                          </h5>
                          <p className="text-[10px] text-slate-500 leading-normal font-light">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-50 text-[10px] font-bold">
                          <span className={isSpecial ? 'text-amber-700 font-extrabold' : 'text-emerald-700 font-black'}>
                            {formatCurrency(item.price)} MXN
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono ${
                            isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {isAvailable ? 'Disponible' : 'Agotado'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
