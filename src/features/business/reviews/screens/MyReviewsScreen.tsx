/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Star, MessageSquare, AlertTriangle, CheckCircle, ShieldAlert, Award, Calendar 
} from 'lucide-react';
import { formatDate } from '../../../../shared/utils/formatDate';

interface MyReviewsScreenProps {
  reviews: any[];
  services: any[];
}

export default function MyReviewsScreen({ reviews, services }: MyReviewsScreenProps) {
  // Buscar nombre de servicio por ID
  const getServiceName = (serviceId: string) => {
    const s = services.find(item => item.id === serviceId);
    return s ? s.name : 'Servicio Desconocido';
  };

  // Cálculos de métricas
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews 
    : 0;

  const fiveStarsCount = reviews.filter(r => r.rating === 5).length;
  const criticalCount = reviews.filter(r => r.rating <= 3).length;

  // Distribución de estrellas (1 a 5)
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter(r => r.rating === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  if (totalReviews === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm my-8 flex flex-col items-center space-y-4 animate-fade-in font-sans">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
          <MessageSquare className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-black text-slate-800 uppercase">Aún no tienes reseñas</h3>
          <p className="text-xs text-slate-500 font-medium">
            Tus clientes podrán calificar tus servicios después de reservar y completar sus experiencias.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-slate-900 uppercase">Reseñas y Control de Calidad</h2>
        <p className="text-xs text-slate-500 font-medium">Analiza las opiniones y valoraciones dejadas por los viajeros en tus tours y hospedajes.</p>
      </div>

      {/* Metrics Summary Row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric: Average */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">Calificación General</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-850">{averageRating.toFixed(1)}</span>
              <span className="text-xs text-slate-400">/ 5.0</span>
            </div>
            <div className="flex items-center gap-0.5 mt-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  className={`w-3.5 h-3.5 ${
                    s <= Math.round(averageRating) 
                      ? 'text-amber-500 fill-amber-500' 
                      : 'text-slate-200'
                  }`} 
                />
              ))}
            </div>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Metric: Total Reviews */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">Total de Reseñas</span>
            <h3 className="text-3xl font-black text-slate-850 mt-1">{totalReviews}</h3>
            <p className="text-[10px] text-slate-500 mt-1">Opiniones de viajeros</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Metric: 5 Stars */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">Excelente (5 Estrellas)</span>
            <h3 className="text-3xl font-black text-slate-850 mt-1">{fiveStarsCount}</h3>
            <p className="text-[10px] text-slate-500 mt-1">
              {totalReviews > 0 ? ((fiveStarsCount / totalReviews) * 100).toFixed(0) : 0}% de satisfacción total
            </p>
          </div>
          <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Metric: Criticals */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">Reseñas Críticas (≤ 3★)</span>
            <h3 className="text-3xl font-black text-rose-600 mt-1">{criticalCount}</h3>
            <p className="text-[10px] text-slate-500 mt-1">Requieren atención rápida</p>
          </div>
          <div className={`p-3 rounded-xl ${criticalCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-400'}`}>
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Split Layout: Ratings Graph and Feedback Feed */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Rating Breakdown Graph */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm md:text-base border-b border-slate-100 pb-3 uppercase tracking-wider">
            Distribución de Opiniones
          </h3>
          <div className="space-y-3">
            {distribution.map((d) => (
              <div key={d.stars} className="flex items-center gap-3 text-xs font-semibold">
                <span className="w-8 text-right font-mono flex items-center justify-end gap-1">
                  {d.stars} <Star className="w-3 h-3 text-amber-500 fill-amber-500 inline" />
                </span>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 rounded-full" 
                    style={{ width: `${d.percentage}%` }}
                  />
                </div>
                <span className="w-10 text-slate-400 text-right font-mono">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Feed */}
        <div className="lg:col-span-8 space-y-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm md:text-base border-b border-slate-100 pb-3 uppercase tracking-wider">
            Lista de Comentarios
          </h3>

          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
            {reviews.map((r) => {
              const serviceName = getServiceName(r.serviceId);
              const isCritical = r.rating <= 3;
              return (
                <div 
                  key={r.id} 
                  className={`p-4 rounded-2xl border transition-colors flex flex-col gap-3 ${
                    isCritical ? 'bg-rose-50/20 border-rose-100/60' : 'bg-slate-50 border-slate-200/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    {/* User and Service info */}
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        {r.authorName}
                        {isCritical && (
                          <span className="inline-flex items-center gap-0.5 text-[8px] font-black uppercase text-rose-700 bg-rose-100 border border-rose-200/40 px-1.5 py-0.5 rounded">
                            <AlertTriangle className="w-2.5 h-2.5" /> Alerta
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Servicio: <span className="text-emerald-700 font-bold">{serviceName}</span>
                      </p>
                    </div>

                    {/* Rating and date */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            className={`w-3 h-3 ${
                              s <= r.rating 
                                ? 'text-amber-500 fill-amber-500' 
                                : 'text-slate-200'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(r.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-slate-650 font-light leading-relaxed">
                    {r.comment || <span className="text-slate-400 italic">El viajero no dejó ningún comentario escrito.</span>}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
