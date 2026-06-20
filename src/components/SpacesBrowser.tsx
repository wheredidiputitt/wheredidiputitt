import { Space, Item } from '../types';
import LucideIcon from './LucideIcon';

interface SpacesBrowserProps {
  spaces: Space[];
  items: Item[];
  selectedRoom: string | null;
  onSelectRoom: (roomName: string | null) => void;
}

export default function SpacesBrowser({ spaces, items, selectedRoom, onSelectRoom }: SpacesBrowserProps) {
  
  // Calculate item counts per room
  const getItemCount = (roomName: string) => {
    return items.filter(item => item.room === roomName).length;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-lg text-white">Browse Physical Spaces</h3>
          <p className="text-xs text-slate-400">Select a room to reveal what containers and objects are stored inside</p>
        </div>
        {selectedRoom && (
          <button
            onClick={() => onSelectRoom(null)}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-mono font-medium underline cursor-pointer"
          >
            Clear Room Filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {spaces.map((space) => {
          const isSelected = selectedRoom === space.roomName;
          const count = getItemCount(space.roomName);
          
          return (
            <button
              key={space.roomName}
              onClick={() => onSelectRoom(isSelected ? null : space.roomName)}
              className={`flex flex-col text-left p-4.5 rounded-xl border transition-all duration-300 relative group cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                  : 'bg-slate-900 border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-850'
              }`}
            >
              {/* Item Count absolute indicator */}
              <span className={`absolute top-3.5 right-3.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : count > 0 
                    ? 'bg-slate-800 text-slate-350' 
                    : 'bg-slate-950 text-slate-600'
              }`}>
                {count}
              </span>

              {/* Room custom icon mapper */}
              <div className={`p-2 rounded-lg w-fit mb-3 transition ${
                isSelected 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-slate-950 text-slate-400 group-hover:text-slate-200'
              }`}>
                <LucideIcon name={space.iconName} size={18} />
              </div>

              {/* Text detail */}
              <div>
                <h4 className="font-display font-semibold text-sm text-white group-hover:text-emerald-400 transition-colors">
                  {space.roomName}
                </h4>
                <p className="text-[10px] text-slate-400 truncate mt-0.5" title={space.description}>
                  {space.description}
                </p>
              </div>

              {/* Neon bottom underline if active */}
              {isSelected && (
                <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-emerald-405 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
