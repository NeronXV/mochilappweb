/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Megaphone, Bell, Percent, Sparkles, Send, Clock, PlayCircle, Eye, Tag, Calendar
} from 'lucide-react';
import { formatDate } from '../../../../shared/utils/formatDate';

interface MyPromosScreenProps {
  promos: any[];
  services: any[];
  companyName: string;
  onCreatePromo: (
    content: string, 
    discount: string,
    serviceId: string,
    discountPercent: number,
    promoCode: string,
    expiresAt: number
  ) => Promise<void>;
}

export default function MyPromosScreen({ promos, services, companyName, onCreatePromo }: MyPromosScreenProps) {
  const [content, setContent] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number | ''>('');
  const [promoCode, setPromoCode] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!serviceId) {
      setErrorMsg('Por favor selecciona el servicio al que aplica la promoción.');
      return;
    }

    if (!content.trim()) {
      setErrorMsg('Por favor escribe el contenido de la promoción.');
      return;
    }

    if (
      discountPercent === '' || 
      isNaN(Number(discountPercent)) || 
      Number(discountPercent) < 1 || 
      Number(discountPercent) > 90
    ) {
      setErrorMsg('Especifica un porcentaje de descuento válido (entre 1% y 90%).');
      return;
    }

    setSubmitting(true);
    try {
      // Generar código promo automático si está vacío
      const code = promoCode.trim() 
        ? promoCode.toUpperCase().replace(/\s+/g, '') 
        : `FLASH${discountPercent}`;

      // Convertir fecha de expiración a epoch millisecond o 0 si no se selecciona
      const expiresAt = expiryDate ? new Date(expiryDate + 'T23:59:59').getTime() : 0;

      // El campo discount se guarda formateado como string con % para compatibilidad
      const discountStr = `${discountPercent}%`;

      await onCreatePromo(
        content, 
        discountStr,
        serviceId,
        Number(discountPercent),
        code,
        expiresAt
      );

      setContent('');
      setServiceId('');
      setDiscountPercent('');
      setPromoCode('');
      setExpiryDate('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al publicar la promoción.');
    } finally {
      setSubmitting(false);
    }
  };

  // Buscar servicio seleccionado para previsualización
  const selectedService = services.find(s => s.id === serviceId);

  // Previsualización dinámica de la notificación push
  const previewText = content.trim() || 'Ej: Disfruta de un tour guiado a mitad de precio este fin de semana...';
  const previewDiscount = discountPercent ? `${discountPercent}%` : 'XX%';

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      {/* Title Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Promociones y Ofertas Rápidas</h2>
        <p className="text-xs text-slate-500 font-medium">Publica descuentos flash vinculados a tus servicios que se notificarán de forma directa a los viajeros en la app.</p>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Live Preview */}
        <div className="md:col-span-6 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-800 text-sm md:text-base">Crear Nueva Oferta Relámpago</h3>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-150 rounded-xl text-rose-800 text-xs font-semibold animate-fade-in">
                {errorMsg}
              </div>
            )}

            {services.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-2">
                <p className="text-xs text-amber-800 font-bold">Primero publica un servicio para crear una oferta.</p>
              </div>
            ) : (
              <form onSubmit={handlePublish} className="space-y-4">
                {/* Service Selector */}
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-555 uppercase font-mono tracking-wider mb-1">
                    Servicio al que aplica *
                  </label>
                  <select
                    required
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-xs outline-none transition-all font-semibold text-slate-800 cursor-pointer"
                  >
                    <option value="">Selecciona un servicio</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.price ? `${s.price} MXN` : 'Precio no definido'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Content textarea */}
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-555 uppercase font-mono tracking-wider mb-1">
                    Mensaje / Contenido de la Promoción *
                  </label>
                  <textarea 
                    rows={3}
                    required
                    maxLength={180}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Redacta un mensaje atractivo para los viajeros. Máx. 180 caracteres."
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-xs outline-none transition-all font-medium resize-none text-slate-800" 
                  />
                </div>

                {/* Discount rate Input and Promo Code Input */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-555 uppercase font-mono tracking-wider mb-1">
                      Porcentaje Descuento *
                    </label>
                    <div className="relative">
                      <input 
                        type="number" 
                        required
                        min="1"
                        max="90"
                        placeholder="Ej: 15"
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full pl-4 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-xs outline-none transition-all font-semibold text-slate-800" 
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-450 pointer-events-none">
                        <Percent className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-555 uppercase font-mono tracking-wider mb-1">
                      Código Promo (Opcional)
                    </label>
                    <input 
                      type="text" 
                      placeholder="FLASH15"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-xs outline-none transition-all font-mono font-bold text-slate-800" 
                    />
                  </div>
                </div>

                {/* Expiry Date input */}
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-555 uppercase font-mono tracking-wider mb-1">
                    Vigencia / Fecha de Expiración (Opcional)
                  </label>
                  <input 
                    type="date" 
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-xs outline-none transition-all font-semibold text-slate-800 cursor-pointer" 
                  />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 text-white text-xs font-bold font-display rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Publicando...' : 'Publicar Promoción en Mochilapp'}
                </button>
              </form>
            )}
          </div>

          {/* Live Mobile Push Preview */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]" />
            <div className="flex items-center gap-2 justify-between border-b border-slate-800 pb-3">
              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                VISTA PREVIA MÓVIL (PUSH)
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Simulated Notification Bubble */}
            <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 space-y-2.5 relative backdrop-blur-md">
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-emerald-600 rounded-lg flex items-center justify-center p-0.5 text-white">
                    <Megaphone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-100 tracking-tight leading-none uppercase">{companyName}</h4>
                    <span className="text-[8px] text-slate-400">Notificación Mochilapp</span>
                  </div>
                </div>
                <span className="text-[8px] text-emerald-400 font-extrabold uppercase bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-900/30 shrink-0 font-mono">
                  {previewDiscount} OFF
                </span>
              </div>
              <p className="text-[10px] text-slate-200 leading-normal font-light line-clamp-2">
                {previewText}
              </p>
              {selectedService && (
                <div className="border-t border-slate-700/60 pt-2 flex items-center justify-between text-[8px] text-emerald-450 font-bold font-mono">
                  <span>VINCULADO A: {selectedService.name.toUpperCase()}</span>
                  <span>CÓDIGO: {promoCode.trim() ? promoCode.toUpperCase() : `FLASH${discountPercent || 'XX'}`}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Promos History */}
        <div className="md:col-span-6 space-y-5">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 shrink-0">
              <h3 className="font-bold text-slate-800 text-sm md:text-base">Historial de Promociones</h3>
              <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2.5 py-1 rounded-full border border-slate-200/40">
                {promos.length} creadas
              </span>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto max-h-[580px] pr-1">
              {promos.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center py-24 text-center space-y-3">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-350 shadow-sm">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-800 uppercase">Sin ofertas activas</p>
                    <p className="text-[10px] text-slate-500 font-medium max-w-[280px]">
                      Aún no has creado promociones. Completa el formulario de la izquierda para notificar ofertas a los usuarios.
                    </p>
                  </div>
                </div>
              ) : (
                promos.map((promo) => {
                  // Resolver compatibilidad de servicio vinculado
                  const linkedService = services.find(s => s.id === promo.serviceId);
                  
                  return (
                    <div 
                      key={promo.id} 
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex flex-col gap-3 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[8px] bg-emerald-100 text-emerald-800 font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-emerald-200/40 font-mono">
                          {promo.discount} Descuento
                        </span>

                        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[9px]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatDate(promo.timestamp)}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                        {promo.content}
                      </p>

                      {/* Servicio Vinculado */}
                      <div className="flex items-center gap-1 text-[9px] font-sans">
                        {linkedService ? (
                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Tag className="w-3 h-3 text-emerald-600" />
                            Aplica a: <strong>{linkedService.name}</strong>
                          </span>
                        ) : (
                          <span className="text-slate-550 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md italic">
                            Sin servicio vinculado (Informativa)
                          </span>
                        )}
                      </div>

                      {/* Código de promo y expiración */}
                      {(promo.promoCode || promo.expiresAt > 0) && (
                        <div className="flex flex-wrap items-center gap-2 border-t border-slate-200/40 pt-2.5">
                          {promo.promoCode && (
                            <span className="text-[8px] font-mono font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm">
                              CÓDIGO: {promo.promoCode}
                            </span>
                          )}
                          {promo.expiresAt > 0 && (
                            <span className="text-[8px] font-mono text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-rose-500" />
                              Expira: {formatDate(promo.expiresAt)}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 text-[8px] font-mono text-slate-400">
                        <span className="flex items-center gap-1 font-bold text-slate-450">
                          <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Push Activa
                        </span>
                        <span>{promo.source || 'business_dashboard'}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
