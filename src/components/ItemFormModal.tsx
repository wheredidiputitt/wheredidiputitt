import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Key, Zap, FileText, Camera, Hammer, ShieldAlert, Heart, Luggage, Database, HelpCircle } from 'lucide-react';
import { Item, MoveHistory } from '../types';
import { CATEGORIES, DEFAULT_SPACES } from '../data/sampleData';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Item, moveNote?: string) => void;
  itemToEdit?: Item | null;
}

const ICON_OPTIONS = [
  { name: 'FileText', label: 'Document', icon: FileText },
  { name: 'Key', label: 'Key', icon: Key },
  { name: 'Zap', label: 'Charger / Power', icon: Zap },
  { name: 'Camera', label: 'Camera / Gear', icon: Camera },
  { name: 'Hammer', label: 'Tool', icon: Hammer },
  { name: 'ShieldAlert', label: 'Warranty / Tax', icon: ShieldAlert },
  { name: 'Heart', label: 'Medicine', icon: Heart },
  { name: 'Luggage', label: 'Travel Pack', icon: Luggage },
  { name: 'Database', label: 'Storage Box', icon: Database },
  { name: 'HelpCircle', label: 'General Object', icon: HelpCircle },
];

const PRESET_GRADIENTS = [
  'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', // Blue
  'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)', // Teal
  'linear-gradient(135deg, #9a3412 0%, #ea580c 100%)', // Orange/Amber
  'linear-gradient(135deg, #3730a3 0%, #6366f1 100%)', // Indigo/Purple
  'linear-gradient(135deg, #111827 0%, #4b5563 100%)', // Charcoal
  'linear-gradient(135deg, #065f46 0%, #10b981 100%)', // Emerald
  'linear-gradient(135deg, #831843 0%, #db2777 100%)', // Rose
];

export default function ItemFormModal({ isOpen, onClose, onSave, itemToEdit }: ItemFormModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Documents');
  const [room, setRoom] = useState('Bedroom');
  const [container, setContainer] = useState('');
  const [subLocation, setSubLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [iconName, setIconName] = useState('FileText');
  const [imagePlaceholder, setImagePlaceholder] = useState(PRESET_GRADIENTS[0]);
  
  // Tag handling
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  // Relocation tracking
  const [hasMoved, setHasMoved] = useState(false);
  const [relocationNote, setRelocationNote] = useState('');

  // Repopulate if editing
  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setCategory(itemToEdit.category);
      setRoom(itemToEdit.room);
      setContainer(itemToEdit.container || '');
      setSubLocation(itemToEdit.subLocation || '');
      setNotes(itemToEdit.notes || '');
      setTags(itemToEdit.tags || []);
      setIconName(itemToEdit.iconName || 'FileText');
      setImagePlaceholder(itemToEdit.imagePlaceholder || PRESET_GRADIENTS[0]);
      setHasMoved(false);
      setRelocationNote('');
    } else {
      // Clear all
      setName('');
      setCategory('Documents');
      setRoom('Bedroom');
      setContainer('');
      setSubLocation('');
      setNotes('');
      setTags([]);
      setIconName('FileText');
      setImagePlaceholder(PRESET_GRADIENTS[Math.floor(Math.random() * PRESET_GRADIENTS.length)]);
      setHasMoved(false);
      setRelocationNote('');
    }
  }, [itemToEdit, isOpen]);

  // Track if location indices differ from original on edit
  useEffect(() => {
    if (itemToEdit) {
      const locationChanged = 
        itemToEdit.room !== room || 
        itemToEdit.container !== container || 
        itemToEdit.subLocation !== subLocation;
      setHasMoved(locationChanged);
    }
  }, [room, container, subLocation, itemToEdit]);

  if (!isOpen) return null;

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTag = tagInput.trim().toLowerCase();
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const timestamp = new Date().toISOString();
    
    let history: MoveHistory[] = itemToEdit ? [...itemToEdit.history] : [];
    
    // If we're editing and the user moved the item, write a move history record
    if (itemToEdit && hasMoved) {
      const fromLoc = `${itemToEdit.room} ➔ ${itemToEdit.container}${itemToEdit.subLocation ? ` (${itemToEdit.subLocation})` : ''}`;
      const toLoc = `${room} ➔ ${container}${subLocation ? ` (${subLocation})` : ''}`;
      history.push({
        id: `h-${Date.now()}`,
        itemId: itemToEdit.id,
        fromLocation: fromLoc,
        toLocation: toLoc,
        timestamp: timestamp,
        notes: relocationNote.trim() || 'Location relocated safely.'
      });
    }

    const payload: Item = {
      id: itemToEdit ? itemToEdit.id : `item-${Date.now()}`,
      name: name.trim(),
      category,
      room,
      container: container.trim(),
      subLocation: subLocation.trim(),
      notes: notes.trim(),
      tags,
      lastMoved: hasMoved || !itemToEdit ? timestamp : (itemToEdit.lastMoved || timestamp),
      createdAt: itemToEdit ? itemToEdit.createdAt : timestamp,
      history,
      iconName,
      imagePlaceholder,
    };

    onSave(payload, relocationNote);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col my-8">
        
        {/* Header decor */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50">
          <div>
            <h3 className="font-display font-semibold text-lg text-white">
              {itemToEdit ? `Update Location & Details` : 'Securely Memorise New Object'}
            </h3>
            <p className="text-xs text-slate-400">
              {itemToEdit ? 'Keep your physical storage memory up to date' : 'Log a physical object to find it in seconds later'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          
          {/* Item Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Object Name <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Passport, Car battery charger, Spare back door keys..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition"
            />
          </div>

          {/* Core Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 transition cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                ))}
              </select>
            </div>

            {/* Room / Physical Space Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Primary Room / Area <span className="text-emerald-400">*</span>
              </label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 transition cursor-pointer"
              >
                {DEFAULT_SPACES.map(space => (
                  <option key={space.roomName} value={space.roomName} className="bg-slate-900">
                    {space.roomName}
                  </option>
                ))}
                {/* Fallback space option */}
                {!DEFAULT_SPACES.some(s => s.roomName === room) && (
                  <option value={room} className="bg-slate-900">{room}</option>
                )}
                <option value="Attic" className="bg-slate-900">Attic</option>
                <option value="Basement" className="bg-slate-900">Basement</option>
                <option value="Yard / Shed" className="bg-slate-900">Yard / Shed</option>
                <option value="Backpack / Pocket" className="bg-slate-900">Backpack / Portable Pocket</option>
              </select>
            </div>
          </div>

          {/* Location Hierarchy Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/30 p-4 border border-slate-800/80 rounded-xl">
            {/* Storage Container */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Specific Container / Cabinet <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Blue storage box, laptop pouch..."
                value={container}
                onChange={(e) => setContainer(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition"
              />
            </div>

            {/* Sub location / Drawer */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Sub-location / Pocket (Optional)</span>
                <span className="text-[10px] font-sans text-slate-500 normal-case font-normal">Level 3 detail</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Front zip compartment, top shelf corner..."
                value={subLocation}
                onChange={(e) => setSubLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition"
              />
            </div>
          </div>

          {/* Relocation Move Logging System */}
          {itemToEdit && hasMoved && (
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl animate-fade-in space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-xs text-emerald-400 font-bold mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-400">Relocation detected!</h4>
                  <p className="text-[11px] text-slate-300">
                    You relocated this from <strong className="text-slate-200">{itemToEdit.room} ➔ {itemToEdit.container}</strong>. We will archive this move in memory.
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-emerald-300 uppercase tracking-wide mb-1">
                  Why are you moving this?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tidying up, getting ready for summer travels..."
                  value={relocationNote}
                  onChange={(e) => setRelocationNote(e.target.value)}
                  className="w-full bg-slate-950 border border-emerald-500/30 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>
          )}

          {/* Custom Description & Storage Clues */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Specific Clues / Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Inside a yellow pocket alongside spare keys. Batteries are kept separate."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition resize-none"
            />
          </div>

          {/* Visual Identity Decorator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Choose Representative Icon */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Representative Icon
              </label>
              <div className="grid grid-cols-5 gap-2 bg-slate-950/40 p-2.5 border border-slate-800 rounded-xl">
                {ICON_OPTIONS.map(opt => {
                  const Icon = opt.icon;
                  const isSelected = iconName === opt.name;
                  return (
                    <button
                      key={opt.name}
                      type="button"
                      title={opt.label}
                      onClick={() => setIconName(opt.name)}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all border cursor-pointer ${
                        isSelected 
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' 
                          : 'bg-slate-900 border-transparent hover:bg-slate-850 hover:border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon size={18} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Choose Representative Color Theme */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Representative Theme Colors
              </label>
              <div className="grid grid-cols-4 gap-2.5 bg-slate-950/40 p-3 h-[74px] overflow-hidden border border-slate-800 rounded-xl items-center">
                {PRESET_GRADIENTS.map((gradient, idx) => {
                  const isSelected = imagePlaceholder === gradient;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImagePlaceholder(gradient)}
                      className="w-full h-8 rounded-lg relative overflow-hidden flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                      style={{ background: gradient }}
                    >
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-slate-950/80 border border-emerald-400 flex items-center justify-center text-[10px] text-emerald-400 font-bold">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive Tag addition */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Refined Search Tags / Labels
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type and press space / add..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
                    e.preventDefault();
                    handleAddTag(e);
                  }
                }}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-medium border border-slate-700 cursor-pointer flex items-center gap-1"
              >
                <Plus size={14} /> Add
              </button>
            </div>
            
            {/* Tag Badges wrapper */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {tags.map((tag, idx) => (
                  <span
                    key={tag + idx}
                    className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 text-[11px] text-emerald-400 font-mono px-2.5 py-1 rounded-full"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(idx)}
                      className="text-slate-500 hover:text-rose-450 focus:outline-none cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submitting button */}
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700/60 rounded-xl cursor-pointer"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] transition cursor-pointer"
            >
              {itemToEdit ? 'Save Changes' : 'Memorise Object Location'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
