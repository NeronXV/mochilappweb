import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Toast } from '../../types';

interface ToastsProps {
  toasts: Toast[];
}

export default function Toasts({ toasts }: ToastsProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`p-4 rounded-2xl shadow-xl w-72 flex gap-3 text-white pointer-events-auto backdrop-blur-md border animate-bounce ${
            t.type === 'success'
              ? 'bg-emerald-600/95 border-emerald-500'
              : 'bg-cyan-600/95 border-cyan-500'
          }`}
        >
          <CheckCircle className="w-5 h-5 shrink-0" />
          <p className="text-xs font-semibold leading-normal">{t.message}</p>
        </div>
      ))}
    </div>
  );
}
