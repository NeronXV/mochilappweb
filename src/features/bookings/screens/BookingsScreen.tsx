import React from 'react';
import { CreditCard } from 'lucide-react';
import { calculateCommission, calculateIncentiveContribution, calculatePayoutNet } from '../../../shared/utils/commissionUtils';
import { getBookingStatusLabel, getBookingStatusColorClasses } from '../../../shared/utils/bookingUtils';
import { formatCurrency } from '../../../shared/utils/formatCurrency';
import { formatDate } from '../../../shared/utils/formatDate';

interface BookingsScreenProps {
  calculatedStats: {
    totalSales: number;
    totalComision: number;
    poolIncentivos: number;
  };
  mappedPayments: any[];
  releasePayment: (payId: string) => Promise<void>;
}

export default function BookingsScreen({
  calculatedStats,
  mappedPayments,
  releasePayment,
}: BookingsScreenProps) {
  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-teal-600" />
            <span>Control de Pagos, Comisiones e Intermediarios</span>
          </h3>
          <p className="text-xs text-slate-550 mt-1">
            Mochilapp cobra el <strong className="text-slate-800">15%</strong> de comisión por cada reserva. De este fee, el <strong className="text-slate-800">20%</strong> se asigna al Fondo de Incentivos Turísticos (Mochila Connect) para otorgar puntos y promociones en destinos rústicos.
          </p>
        </div>

        {/* Commission formulae representation banner */}
        <div className="bg-gradient-to-tr from-cyan-50 to-teal-50 border border-teal-200/50 p-4 rounded-2xl text-center text-xs w-full md:w-64">
          <span className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-wider">Mochilapp Intermediario</span>
          <h4 className="text-xl font-black text-slate-800 tracking-tight leading-none mt-1">15% Mochilapp Fee</h4>
          <span className="text-[9px] font-mono text-cyan-800 mt-1 block">Aporte a fondo: 20% del Fee generado</span>
        </div>
      </div>

      {/* Transactions lists table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                <th className="py-3.5 px-5">Comercio Socio</th>
                <th className="py-3.5 px-5">Servicio Contratado</th>
                <th className="py-3.5 px-5">Monto (MXN)</th>
                <th className="py-3.5 px-5">Comisión Mochilapp (15%)</th>
                <th className="py-3.5 px-5">Aporte Fondo (20% de Fee)</th>
                <th className="py-3.5 px-5">Pago Neto al Proveedor</th>
                <th className="py-3.5 px-5">Fecha</th>
                <th className="py-3.5 px-5">Estado</th>
                <th className="py-3.5 px-5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {mappedPayments.map(pay => {
                const computedFee = calculateCommission(pay.amount); // Comisión Mochilapp 15%
                const fundContribution = calculateIncentiveContribution(computedFee); // Aporte fondo
                const payoutProvider = calculatePayoutNet(pay.amount); // Pago Neto al Proveedor 85%
                const statusColors = getBookingStatusColorClasses(pay.status);
                return (
                  <tr key={pay.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-5 font-sans">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-600 uppercase text-xs shrink-0 font-display">
                          {pay.merchantName[0] || 'S'}
                        </div>
                        <span className="font-bold text-slate-800 text-sm truncate w-28 block">{pay.merchantName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-650 font-medium font-sans italic truncate max-w-[120px] text-xs">
                      "{pay.serviceName}"
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-slate-800 text-sm">{formatCurrency(pay.amount)}</td>
                    <td className="py-3.5 px-5 text-cyan-700 font-bold bg-cyan-50/20 text-sm">{formatCurrency(computedFee)}</td>
                    <td className="py-3.5 px-5 text-emerald-700 font-bold bg-emerald-50/20 text-sm">{formatCurrency(fundContribution)}</td>
                    <td className="py-3.5 px-5 text-indigo-700 font-black text-sm">{formatCurrency(payoutProvider)}</td>
                    <td className="py-3.5 px-5 text-xs text-slate-400">
                      {formatDate(pay.createdAt || new Date().toISOString())}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`w-2 h-2 rounded-full inline-block mr-1.5 ${statusColors.dot}`} />
                      <span className={`font-sans font-semibold text-xs ${statusColors.text}`}>
                        {getBookingStatusLabel(pay.status)}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right font-sans">
                      {pay.status === 'PENDING' || pay.status === 'Pendiente' ? (
                        <button onClick={() => releasePayment(pay.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1 px-2.5 rounded transition-colors cursor-pointer">Liberar Pago</button>
                      ) : (
                        <span className="bg-slate-100 border text-slate-400 font-bold px-2 py-1 rounded text-xs select-none uppercase">
                          {pay.status === 'PAID' || pay.status === 'Completado' ? 'Liquidado ✓' : 'Cancelado ✗'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
