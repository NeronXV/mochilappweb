/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Store, Star, MapPin, Eye, EyeOff, CheckCircle, Award, MessageSquare, Edit2, X 
} from 'lucide-react';
import { formatCurrency } from '../../../../shared/utils/formatCurrency';

interface MyServicesScreenProps {
  services: any[];
  onEditService: (serviceId: string, data: {
    price?: number;
    description?: string;
    isVisible?: boolean;
    name?: string;
    location?: string;
  }) => Promise<void>;
}

export default function MyServicesScreen({ services, onEditService }: MyServicesScreenProps) {
  const [editingService, setEditingService] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const handleOpenEdit = (service: any) => {
    setEditingService(service);
    setName(service.name || '');
    setLocation(service.location || '');
    setPrice(service.price || 0);
    setDescription(service.description || '');
    setIsVisible(service.isVisible !== false);
    setFormError('');
  };

  const handleCloseEdit = () => {
    setEditingService(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (price === '' || isNaN(Number(price)) || Number(price) < 0) {
      setFormError('El precio debe ser un número válido mayor o igual a 0.');
      return;
    }

    setSaving(true);
    try {
      await onEditService(editingService.id, {
        name,
        location,
        price: Number(price),
        description,
        isVisible
      });
      handleCloseEdit();
    } catch (err: any) {
      setFormError(err.message || 'Error al guardar los cambios del servicio.');
    } finally {
      setSaving(false);
    }
  };

  if (services.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm my-8 flex flex-col items-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
          <Store className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-black text-slate-800 uppercase">Aún no tienes servicios publicados</h3>
          <p className="text-xs text-slate-500 font-medium">
            Tus experiencias turísticas aparecerán aquí una vez creadas desde la aplicación móvil o autorizadas en la base de datos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase">Mis Servicios ({services.length})</h2>
          <p className="text-xs text-slate-500 font-medium">Lista de experiencias, tours u hospedajes publicados bajo tu cuenta.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          return (
            <div 
              key={service.id} 
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative group"
            >
              {/* Top Banner / Detail */}
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <span className="bg-emerald-50 text-emerald-700 text-[9px] font-extrabold uppercase py-0.5 px-2.5 rounded-full border border-emerald-100">
                    {service.type}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    {service.isRecommended && (
                      <span className="p-1 bg-amber-50 text-amber-600 rounded-lg border border-amber-100" title="Recomendado">
                        <Award className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {service.isVerified ? (
                      <span className="p-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100" title="Verificado">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-500 text-[8px] font-bold px-2 py-0.5 rounded uppercase">
                        Pendiente
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 min-h-[40px] leading-tight flex-1">
                      {service.name}
                    </h3>
                    <button 
                      onClick={() => handleOpenEdit(service)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Editar servicio"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 text-slate-450 text-[11px] font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{service.location}</span>
                  </div>
                </div>

                {service.description && (
                  <p className="text-slate-500 text-[11px] font-light leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                )}

                {/* Rating & reviews */}
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100/60">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{service.rating.toFixed(1)}</span>
                  </div>
                  <div className="w-px h-3.5 bg-slate-200" />
                  <div className="flex items-center gap-1 text-slate-500">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>{service.reviewCount} {service.reviewCount === 1 ? 'reseña' : 'reseñas'}</span>
                  </div>
                </div>
              </div>

              {/* Price and Visibility Footer */}
              <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider block">PRECIO BASE</span>
                  <span className="font-black text-slate-900 text-base">{formatCurrency(service.price)} MXN</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {service.isVisible ? (
                    <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold py-1 px-3 rounded-full">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Público</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-rose-100 text-rose-800 text-[10px] font-bold py-1 px-3 rounded-full">
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Oculto</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal (Glassmorphism + clean borders) */}
      {editingService && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wider">Editar Servicio</h3>
                  <span className="text-[9px] font-mono text-emerald-300">ID: {editingService.id}</span>
                </div>
              </div>
              <button 
                onClick={handleCloseEdit}
                className="p-1 bg-emerald-900 hover:bg-emerald-800 rounded-lg text-emerald-200 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-150 rounded-xl text-rose-800 text-xs font-semibold">
                  {formError}
                </div>
              )}

              {/* Editable Name */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase font-mono tracking-wider mb-1">
                  Nombre del Servicio
                </label>
                <input 
                  type="text" 
                  required
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-xs outline-none transition-all font-medium" 
                />
              </div>

              {/* Editable Location */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase font-mono tracking-wider mb-1">
                  Ubicación / Destino
                </label>
                <input 
                  type="text" 
                  required
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-xs outline-none transition-all font-medium" 
                />
              </div>

              {/* Editable Price */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase font-mono tracking-wider mb-1">
                  Precio Base (MXN)
                </label>
                <input 
                  type="number" 
                  required
                  min="0"
                  step="0.01"
                  value={price} 
                  onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))} 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-xs outline-none transition-all font-medium" 
                />
              </div>

              {/* Editable Description */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase font-mono tracking-wider mb-1">
                  Descripción de la Experiencia
                </label>
                <textarea 
                  rows={4}
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Detalla de qué trata la aventura, qué incluye y recomendaciones para los viajeros..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-xs outline-none transition-all font-medium resize-none" 
                />
              </div>

              {/* Editable Visibility Switch */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Visible en catálogo</span>
                  <span className="text-[10px] text-slate-500 font-medium">Permite que los viajeros vean y reserven este servicio.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    isVisible ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isVisible ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleCloseEdit}
                  className="px-4 py-2 text-xs font-bold text-slate-550 bg-slate-100 hover:bg-slate-200/60 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
