import React from 'react';
import { ImageIcon, MapPin, Heart, Sparkles, CheckCircle, Check, Trash2 } from 'lucide-react';
import { Post } from '../../../types';

interface FeedModerationScreenProps {
  posts: Post[];
  approvePost: (id: string) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  boostingPostId: string | null;
  setBoostingPostId: (id: string | null) => void;
  boostedText: string;
  improvePostDescriptionDesc: (post: Post) => void;
  acceptBoostedDescription: (postId: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function FeedModerationScreen({
  posts,
  approvePost,
  deletePost,
  boostingPostId,
  setBoostingPostId,
  boostedText,
  improvePostDescriptionDesc,
  acceptBoostedDescription,
  showToast,
}: FeedModerationScreenProps) {
  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-500" />
            <span>Descubrimientos de Viajeros y Control Ético</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Inspección de fotografías, descripciones reales y etiquetas de localidades.</p>
        </div>
        <div className="bg-rose-50 border border-rose-100 text-rose-700 font-bold font-mono text-[10px] py-1.5 px-3 rounded-full animate-pulse uppercase">
          {posts.filter(p => p.status === 'Pendiente').length} posts pendientes de revisión
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
          <ImageIcon className="w-12 h-12 text-slate-350 mx-auto mb-4" />
          <h4 className="font-bold text-slate-800 text-sm mb-1">Bandeja Vacía</h4>
          <p className="text-xs text-slate-550">Todavía no hay publicaciones reales para moderar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(p => (
            <div key={p.id} className="bg-white border border-slate-250/70 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="relative h-44 bg-slate-100">
                  <img referrerPolicy="no-referrer" src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-lg text-[9px] font-bold text-white flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                    <span>{p.location}</span>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded-full text-white border ${
                      p.status === 'Aprobado' ? 'bg-emerald-500/90 border-emerald-400' : 'bg-amber-500/90 text-slate-900 border-amber-400 animate-pulse'
                    }`}>{p.status}</span>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-white/70 backdrop-blur text-slate-800 py-1 px-2.5 rounded-lg font-mono text-[9px] font-bold flex items-center gap-1 shadow-sm">
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500 shrink-0" />
                    <span>{p.likesCount} me gusta</span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 font-bold text-[10px] flex items-center justify-center font-display">{p.authorName[0]}</div>
                    <span className="text-[10px] font-bold text-slate-600">{p.authorName}</span>
                    <span className="bg-slate-100 text-slate-500 text-[8px] font-bold py-0.5 px-2 rounded border uppercase font-mono ml-auto">{p.tag}</span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed italic border-l-2 border-slate-200 pl-2">
                    "{p.title}"
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-50 flex flex-col gap-2.5">
                {boostingPostId === p.id && (
                  <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3 shrink-0">
                    <span className="text-[9px] font-mono font-bold text-teal-800 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" /> Boost IA Generado de Copys
                    </span>
                    <p className="text-[10px] text-teal-900 leading-relaxed italic mt-1 bg-white p-2 border border-teal-100 rounded-lg">{boostedText}</p>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => acceptBoostedDescription(p.id)} className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[9px] rounded-lg cursor-pointer">✓ Reemplazar</button>
                      <button onClick={() => setBoostingPostId(null)} className="py-1 px-2 border hover:bg-slate-50 text-[9px] font-bold rounded-lg cursor-pointer">Descartar</button>
                    </div>
                  </div>
                )}

                <div className="flex gap-1.5">
                  {p.status === 'Pendiente' ? (
                    <button onClick={() => approvePost(p.id)} className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold rounded-xl flex items-center justify-center gap-1 shadow shadow-emerald-500/10 cursor-pointer">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Aprobar Publicación</span>
                    </button>
                  ) : (
                    <div className="flex-1 py-1.5 bg-slate-50 text-slate-450 text-[9px] font-bold text-center border rounded-xl select-none flex items-center justify-center gap-1">
                      <Check className="w-3 h-3 text-emerald-500" /> Aprobado por Control
                    </div>
                  )}
                  
                  <button onClick={() => improvePostDescriptionDesc(p)} className="px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 border hover:border-teal-200 rounded-xl font-bold text-[10px] flex items-center gap-1 cursor-pointer">
                    <Sparkles className="w-3 h-3 text-teal-600" />
                    <span>SEO Boost</span>
                  </button>

                  <button onClick={() => deletePost(p.id)} className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 rounded-xl cursor-pointer" title="Bloquear / Eliminar"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
