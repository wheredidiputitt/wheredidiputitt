import React, { useState } from 'react';
import { Edit2, Trash2, History, MapPin, Calendar, ClipboardList, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Item } from '../types';
import LucideIcon from './LucideIcon';
import { formatRelativeTime } from '../utils/dateFormatter';

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  onViewHistory: (item: Item) => void;
  key?: React.Key | null | undefined;
}

export default function ItemCard({ item, onEdit, onDelete, onViewHistory }: ItemCardProps): React.JSX.Element {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const confirmDelete = () => {
    onDelete(item.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700/80 transition-all duration-300 group shadow-md shadow-slate-950/20 flex flex-col h-full relative">
      
      {/* Decorative representative header gradient */}
      <div 
        className="h-16 w-full relative flex items-end px-4 py-2"
        style={{ background: item.imagePlaceholder || 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
      >
        <div className="absolute inset-0 bg-slate-950/20 mix-blend-overlay" />
        <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700/30 flex items-center justify-center text-white backdrop-blur-md absolute -bottom-4 left-4 shadow-lg group-hover:scale-105 transition-transform duration-300">
          <LucideIcon name={item.iconName || 'FileText'} size={18} className="text-emerald-400" />
        </div>
        
        {/* Category Badge on Top-Right */}
        <span className="absolute top-3 right-3 bg-slate-950/60 backdrop-blur-md text-[10px] font-semibold text-slate-350 px-2.5 py-0.5 rounded-full border border-slate-700/20 uppercase tracking-wider font-mono">
          {item.category}
        </span>
      </div>

      {/* Main details wrapper */}
      <div className="p-4 pt-6 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Title, Details and Tags */}
        <div className="space-y-2 flex-1">
          <div className="flex items-start justify-between gap-1">
            <h4 className="font-display font-semibold text-base text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
              {item.name}
            </h4>
          </div>

          {/* Location Description */}
          <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
            <div className="flex items-start gap-1.5">
              <MapPin size={13.5} className="text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="text-slate-400 font-sans font-medium">{item.room}</span>
                <span className="text-slate-600 mx-1">➔</span>
                <strong className="text-slate-200 font-semibold">{item.container}</strong>
              </div>
            </div>
            {item.subLocation && (
              <div className="text-[11px] text-slate-400 font-mono pl-5 flex items-center gap-1.5">
                <ArrowUpRight size={11} className="text-slate-600" />
                <span>{item.subLocation}</span>
              </div>
            )}
          </div>

          {/* Notes display */}
          {item.notes && (
            <p className="text-xs text-slate-400 line-clamp-2 pl-1 italic font-light">
              &ldquo;{item.notes}&rdquo;
            </p>
          )}

          {/* Tags wrap */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1.5">
              {item.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="bg-slate-950 px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-400 border border-slate-850 hover:border-emerald-500/20 hover:text-emerald-400 transition"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Date tracker with history and Actions header */}
        <div className="pt-3 border-t border-slate-850 flex items-center justify-between text-[11px]">
          
          {/* Moved timestamp description */}
          <div className="flex items-center gap-1 text-slate-400" title={`Last moved on: ${new Date(item.lastMoved).toLocaleString()}`}>
            <Calendar size={12} className="text-slate-500" />
            <span className="font-mono">
              Moved: {formatRelativeTime(item.lastMoved)}
            </span>
          </div>

          {/* Edit, Relocate / Delete Actions */}
          <div className="flex items-center gap-1">
            {/* View History triggers */}
            {item.history && item.history.length > 0 && (
              <button
                onClick={() => onViewHistory(item)}
                title={`View relocate history (${item.history.length} saves)`}
                className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 border border-slate-800 hover:border-slate-750 transition cursor-pointer"
              >
                <div className="relative">
                  <History size={13} />
                  <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-500 text-[8px] font-bold text-slate-950 flex items-center justify-center font-mono scale-90">
                    {item.history.length}
                  </span>
                </div>
              </button>
            )}

            <button
              onClick={() => onEdit(item)}
              title="Edit / Relocate item"
              className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-750 transition cursor-pointer"
            >
              <Edit2 size={13} />
            </button>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete memory"
              className="p-1.5 rounded-lg bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-transparent transition cursor-pointer"
            >
              <Trash2 size={13} />
            </button>
          </div>

        </div>

      </div>

      {/* Delete confirmation layer */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xs flex flex-col justify-center items-center p-4 text-center z-10 animate-fade-in">
          <AlertCircle className="text-rose-500 mb-2" size={32} />
          <h5 className="font-display font-medium text-sm text-white">Delete &ldquo;{item.name}&rdquo;?</h5>
          <p className="text-slate-400 text-xs mt-1.5 mb-4 max-w-[200px]">
            This physical memory will be permanently forgotten.
          </p>
          <div className="flex gap-2 w-full max-w-[180px]">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-xs text-slate-300 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 px-3 py-1.5 rounded-lg bg-rose-650 hover:bg-rose-500 text-xs text-white font-medium cursor-pointer"
            >
              Forget
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
