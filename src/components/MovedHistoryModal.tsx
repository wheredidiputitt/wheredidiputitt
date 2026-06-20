import React from 'react';
import { X, Calendar, MapPin, History, Info } from 'lucide-react';
import { Item } from '../types';

interface MovedHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
}

export default function MovedHistoryModal({ isOpen, onClose, item }: MovedHistoryModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative flex flex-col">
        
        {/* Top brand header label */}
        <div className="h-1 w-full bg-emerald-400" />

        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={16} className="text-emerald-400" />
            <h3 className="font-display font-semibold text-base text-white">
              Relocation Memory Archive
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold block mb-1">
              Active Location Storage
            </span>
            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin size={12} className="text-emerald-500" />
                  <span>{item.room} ➔ {item.container}</span>
                </p>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20 rounded px-2 py-0.5 font-semibold">
                Current
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold block mb-1">
              Relocation Timelines ({item.history.length})
            </span>

            <div className="relative border-l border-slate-800 pl-4 ml-2.5 space-y-5 py-2">
              {item.history.map((log, index) => (
                <div key={log.id || index} className="relative">
                  
                  {/* Bullet indicator */}
                  <span className="absolute -left-[21.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-800 border-2 border-emerald-400 flex items-center justify-center" />

                  {/* History item body */}
                  <div className="space-y-1.5">
                    
                    {/* Timestamp */}
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                      <Calendar size={11} />
                      <span>{new Date(log.timestamp).toLocaleDateString()} at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {/* From / To paths */}
                    <div className="text-xs bg-slate-950/30 p-2.5 rounded-lg border border-slate-850 space-y-1">
                      <div className="flex items-center justify-between text-slate-450 text-[11px]">
                        <span>From:</span>
                        <span className="text-slate-500 line-through truncate max-w-[180px]">{log.fromLocation}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-200">
                        <span>To:</span>
                        <span className="text-emerald-400 font-medium truncate max-w-[180px]">{log.toLocation}</span>
                      </div>
                    </div>

                    {/* relocation notes */}
                    {log.notes && (
                      <p className="text-[11px] text-slate-400 font-sans italic pl-1 flex items-start gap-1">
                        <Info size={11} className="text-slate-500 shrink-0 mt-0.5" />
                        <span>&ldquo;{log.notes}&rdquo;</span>
                      </p>
                    )}

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/20 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-505 font-mono">
            Relocation histories logs are stored encrypted locally in your browser cache.
          </p>
        </div>

      </div>
    </div>
  );
}
