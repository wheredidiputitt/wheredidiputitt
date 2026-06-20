import { ShieldCheck, CloudOff, Database, RotateCcw, Sparkles } from 'lucide-react';

interface NavbarProps {
  itemCount: number;
  onResetToSample: () => void;
  onClearAll: () => void;
}

export default function Navbar({ itemCount, onResetToSample, onClearAll }: NavbarProps) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <span className="font-display font-bold text-lg text-slate-950">🔍</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                WhereDidIPutIt
              </h1>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded border border-emerald-500/20">
                Free & Private
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium font-sans">
              Your search engine for real-world physical objects
            </p>
          </div>
        </div>

        {/* Security & Privacy Badges */}
        <div className="hidden lg:flex items-center gap-5">
          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/40 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span className="font-medium">100% Private</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/40 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <CloudOff size={14} className="text-emerald-400" />
            <span className="font-medium">Works Offline</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/40 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <Database size={14} className="text-emerald-400" />
            <span className="font-medium">{itemCount} Objects Stored</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onResetToSample}
            title="Repopulates the database with default test objects for demonstration"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition border border-slate-700/50 cursor-pointer"
          >
            <Sparkles size={13} className="text-emerald-400" />
            Sample Data
          </button>
          <button
            onClick={onClearAll}
            title="Deletes all memories stored in local state"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/5 hover:bg-rose-500/10 rounded-lg transition border border-rose-500/20 cursor-pointer"
          >
            <RotateCcw size={13} />
            Wipe Cache
          </button>
        </div>

      </div>
    </header>
  );
}
