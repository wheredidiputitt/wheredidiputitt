import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Plus, Sparkles, ShieldCheck, HelpCircle, FileText, Zap, Key, 
  Trash2, Edit, X, ChevronRight, Lock, BookOpen, Info, Settings, Eye, 
  Activity, ArrowRight, ShieldAlert, Heart, Luggage, Camera, CornerDownRight, Check
} from 'lucide-react';
import { Item, Space } from './types';
import { DEFAULT_SPACES, SAMPLE_ITEMS, CATEGORIES } from './data/sampleData';
import { parseNaturalLanguageQuery } from './utils/searchParser';
import Navbar from './components/Navbar';
import ItemFormModal from './components/ItemFormModal';
import ItemCard from './components/ItemCard';
import SpacesBrowser from './components/SpacesBrowser';
import MovedHistoryModal from './components/MovedHistoryModal';
import BackupManager from './components/BackupManager';
import LucideIcon from './components/LucideIcon';

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals / Editing state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const [viewingHistoryItem, setViewingHistoryItem] = useState<Item | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Category & tag filters in workspace
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('wheredidiputit_memories');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          setViewMode('app'); // Jump directly if they already have items
        }
      }
    } catch (e) {
      console.error('Error reading localStorage cache:', e);
    }
  }, []);

  // Save to local storage
  const saveItemsToLocalStorage = (newItems: Item[]) => {
    try {
      localStorage.setItem('wheredidiputit_memories', JSON.stringify(newItems));
    } catch (e) {
      console.error('Error writing localStorage cache:', e);
    }
  };

  // Populate sample items
  const handleLoadSampleData = () => {
    setItems(SAMPLE_ITEMS);
    saveItemsToLocalStorage(SAMPLE_ITEMS);
    setViewMode('app');
    setSelectedRoom(null);
    setSelectedCategory('All');
    setSelectedTag(null);
    setSearchQuery('');
  };

  // Clear all items / restore clean slate
  const handleWipeCache = () => {
    if (window.confirm('Are you sure you want to forget all memorised items? This deletes your local device cache.')) {
      setItems([]);
      localStorage.removeItem('wheredidiputit_memories');
      setViewMode('landing');
      setSelectedRoom(null);
      setSelectedCategory('All');
      setSelectedTag(null);
      setSearchQuery('');
    }
  };

  // Add or Edit save callback
  const handleSaveItem = (itemPayload: Item, relocationNote?: string) => {
    let updatedItems: Item[];
    const isEdit = items.some(i => i.id === itemPayload.id);

    if (isEdit) {
      updatedItems = items.map(i => i.id === itemPayload.id ? itemPayload : i);
    } else {
      updatedItems = [itemPayload, ...items];
    }

    setItems(updatedItems);
    saveItemsToLocalStorage(updatedItems);
    setIsFormOpen(false);
    setItemToEdit(null);
  };

  // Delete callback
  const handleDeleteItem = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    saveItemsToLocalStorage(updated);
    
    // If deleted last item, go back to landing
    if (updated.length === 0) {
      setViewMode('landing');
    }
  };

  // Open modal for editing
  const handleTriggerEdit = (item: Item) => {
    setItemToEdit(item);
    setIsFormOpen(true);
  };

  // View item history timeline modal
  const handleViewHistory = (item: Item) => {
    setViewingHistoryItem(item);
    setIsHistoryOpen(true);
  };

  // Dynamic search analysis using natural-language parsing heuristic
  const searchResult = useMemo(() => {
    return parseNaturalLanguageQuery(searchQuery, items);
  }, [searchQuery, items]);

  // Combined filtration logic: Search Results + Room Selection + Category + Tag selection
  const filteredItems = useMemo(() => {
    let results = searchResult.matchedItems;

    // Filter by selected room folder
    if (selectedRoom) {
      results = results.filter(item => item.room.toLowerCase() === selectedRoom.toLowerCase());
    }

    // Filter by selected category dropdown
    if (selectedCategory !== 'All') {
      results = results.filter(item => item.category === selectedCategory);
    }

    // Filter by tag badge selection
    if (selectedTag) {
      results = results.filter(item => item.tags.includes(selectedTag));
    }

    return results;
  }, [searchResult, selectedRoom, selectedCategory, selectedTag]);

  // Extract all tags in dataset dynamically for quick filter chips
  const dynamicTagsList = useMemo(() => {
    const setOfTags = new Set<string>();
    items.forEach(item => {
      item.tags?.forEach(tag => {
        if (tag.trim()) setOfTags.add(tag.trim().toLowerCase());
      });
    });
    return Array.from(setOfTags);
  }, [items]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* Dynamic Navbar */}
      <Navbar 
        itemCount={items.length} 
        onResetToSample={handleLoadSampleData}
        onClearAll={handleWipeCache}
      />

      {/* RENDER VIEW 1: PREMIUM EXPLANATORY LANDING HOMEPAGE */}
      {viewMode === 'landing' ? (
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 md:py-16 space-y-20 animate-fade-in">
          
          {/* Hero Section Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left intro details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-550/20 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold font-mono tracking-wide uppercase">
                🔒 Privacy First • Offline Built
              </div>
              
              <h2 className="font-display font-medium text-4xl md:text-6xl text-white tracking-tight leading-tight">
                Never lose 20 minutes looking for something <span className="text-emerald-400 select-none underline decoration-emerald-500/60 decoration-wavy underline-offset-8">you own.</span>
              </h2>
              
              <p className="text-slate-300 font-sans text-base leading-relaxed max-w-xl">
                WhereDidIPutIt is a free, ultra-lightweight memory assistant for real-world physical belongings. Rather than filing insurance values or receipts, it answers one simple daily question details: <strong className="text-white italic font-normal bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">&ldquo;Where did I put that key?&rdquo;</strong>
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-md pt-2">
                <div className="bg-slate-900/50 p-3.5 border border-slate-800/60 rounded-xl space-y-1">
                  <span className="text-emerald-450 font-bold block text-sm">💡 Quick Add</span>
                  <p className="text-[11px] text-slate-400">Log object coordinates inside drawers, rooms or key racks in seconds.</p>
                </div>
                <div className="bg-slate-900/50 p-3.5 border border-slate-800/60 rounded-xl space-y-1">
                  <span className="text-emerald-450 font-bold block text-sm">🔍 Search Naturally</span>
                  <p className="text-[11px] text-slate-400">Search like you ask questions: &ldquo;Where is my passport?&rdquo; or keyword query tags.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                <button
                  onClick={() => {
                    setViewMode('app');
                    setIsFormOpen(true);
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold px-6 py-3.5 rounded-xl transition-all duration-300 shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/25 active:scale-[0.98] text-sm cursor-pointer"
                >
                  Start Remembering Things
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={handleLoadSampleData}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white font-medium px-6 py-3.5 rounded-xl transition border border-slate-850 hover:border-slate-800 cursor-pointer"
                >
                  Try with Sample Data
                </button>
              </div>

              {/* Subtitle list check */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-400 font-sans">
                <span className="flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-400" /> No cloud login required
                </span>
                <span className="flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-400" /> Data stays securely on your device
                </span>
              </div>
            </div>

            {/* Right Interactive Mockup Showcase */}
            <div className="lg:col-span-5 relative flex justify-center py-6">
              
              {/* Outer decorative ambient glows */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
              
              {/* Phone Container frame representing mock dashboard */}
              <div className="w-full max-w-[340px] bg-slate-950 border-8 border-slate-900 rounded-[36px] shadow-2xl shadow-slate-950 overflow-hidden relative flex flex-col h-[520px]">
                
                {/* Speaker pill notch */}
                <div className="absolute top-0 inset-x-0 h-5 bg-slate-900 flex justify-center items-end pb-1 z-30">
                  <div className="w-16 h-3.5 bg-black rounded-full" />
                </div>

                {/* Simulated Screen */}
                <div className="flex-1 bg-slate-900/95 overflow-y-auto px-4 pt-8 pb-4 space-y-4">
                  
                  {/* Notch-header mock */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>9:41</span>
                    <span className="text-emerald-500 font-bold">WhereDidIPutIt</span>
                    <span>100% Secure</span>
                  </div>

                  {/* Header mock Title */}
                  <div className="flex items-center justify-between mt-1">
                    <h5 className="font-display font-semibold text-white text-sm">Memorised objects</h5>
                    <button 
                      onClick={handleLoadSampleData}
                      className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-emerald-300"
                    >
                      +
                    </button>
                  </div>

                  {/* Mock search container */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-2 flex items-center gap-2">
                    <Search size={14} className="text-slate-400" />
                    <span className="text-[11px] text-slate-400">Where is my passport?</span>
                  </div>

                  {/* Interactive Mock Card */}
                  <div className="border border-slate-850 bg-slate-950/40 p-3 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono text-slate-500 py-0.5 px-1.5 rounded bg-slate-900">
                        Documents
                      </span>
                      <span className="text-[9px] text-emerald-400 font-mono">12 days ago</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-white text-xs font-semibold">
                      <span>📘</span>
                      <h6>Passport (US - Dark Blue)</h6>
                    </div>
                    
                    {/* Location trail */}
                    <div className="text-[10px] bg-slate-900 p-2 rounded border border-slate-850 flex items-center gap-1">
                      <span className="text-slate-400">Bedroom</span>
                      <span className="text-slate-600">➔</span>
                      <span className="text-slate-200 font-semibold">Blue drawer</span>
                    </div>
                    
                    <p className="text-[9px] text-slate-400 italic">
                      &ldquo;Under the travel organizer bag with currencies.&rdquo;
                    </p>
                  </div>

                  {/* Sample buttons prompt */}
                  <div className="pt-2 text-center">
                    <button
                      onClick={handleLoadSampleData}
                      className="text-[10px] w-full text-center text-slate-400 hover:text-emerald-400 border border-slate-800 hover:border-slate-700 bg-slate-950/50 py-2.5 rounded-xl cursor-pointer transition font-medium"
                    >
                      💡 Click here to load 6 mock items now
                    </button>
                  </div>

                </div>

              </div>
            </div>

          </div>

          <hr className="border-slate-900" />

          {/* Examples section */}
          <div className="space-y-6">
            <div className="text-center max-w-lg mx-auto space-y-2">
              <h3 className="font-display font-semibold text-2xl text-white">Examples of what people remember</h3>
              <p className="text-xs text-slate-400">Never experience the daily headache of looking for hidden objects when urgent times hit.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { name: 'Passport', icon: 'FileText', room: 'Bedroom', cont: 'Blue drawer', emoji: 'Passport' },
                { name: 'Spare charger', icon: 'Zap', room: 'Laptop bag', cont: 'Front pocket', emoji: 'Charger' },
                { name: 'Spare key', icon: 'Key', room: 'Kitchen', cont: 'Top cabinet', emoji: 'House key' },
                { name: 'Tax documents', icon: 'ShieldAlert', room: 'Office', cont: 'File box', emoji: 'Warranties' },
                { name: 'Camera', icon: 'Camera', room: 'Closet', cont: 'Shelf bin', emoji: 'DSLR Gear' }
              ].map((ex, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800/80 p-4.5 rounded-xl flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs text-emerald-400 font-semibold font-mono block">#{ex.emoji}</span>
                    <h5 className="font-display font-medium text-white text-sm">{ex.name}</h5>
                  </div>
                  
                  <div className="bg-slate-950/80 p-2 border border-slate-800/60 rounded-lg text-[11px] font-sans">
                    <div className="text-slate-450 flex items-center justify-between">
                      <span>Primary:</span>
                      <strong className="text-slate-205">{ex.room}</strong>
                    </div>
                    <div className="text-slate-450 flex items-center justify-between mt-1">
                      <span>Specific:</span>
                      <strong className="text-slate-205">{ex.cont}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core instructions panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            
            {/* How it works */}
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-5">
              <h4 className="font-display font-semibold text-lg text-white">How it works</h4>
              
              <div className="space-y-4 text-xs font-sans">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center shrink-0">1</span>
                  <div>
                    <h5 className="font-bold text-white text-sm">Save in seconds</h5>
                    <p className="text-slate-400 mt-0.5">Simply log the name of the item, select a room, and list what container it is inside.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center shrink-0">2</span>
                  <div>
                    <h5 className="font-bold text-white text-sm">Find instantly</h5>
                    <p className="text-slate-400 mt-0.5">Search naturally mock queries inside the app. The matching engine maps locations instantly.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center shrink-0">3</span>
                  <div>
                    <h5 className="font-bold text-white text-sm">Track changes</h5>
                    <p className="text-slate-400 mt-0.5">Every time you move an item, we record relocation archives to remind you later.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Helps in moments that matter */}
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <h4 className="font-display font-semibold text-lg text-white">Helps in the moments that matter</h4>
                <p className="text-xs text-slate-400">Save mental stamina from looking for things of rare usage but crucial values:</p>
                
                <ul className="space-y-2 text-xs font-sans pl-1">
                  <li className="flex items-center gap-2 text-slate-300">
                    <span className="text-emerald-500">✓</span> Your passport before an urgent flight
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <span className="text-emerald-500">✓</span> An appliance manufacturer warranty during a repair claim
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <span className="text-emerald-500">✓</span> The specific vehicle title or registration folder
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <span className="text-emerald-500">✓</span> Spare remote batteries or camera gear before travel
                  </li>
                </ul>
              </div>

              <div className="bg-slate-950 p-4 border border-slate-850 text-slate-400 text-[11px] rounded-xl flex items-center gap-3">
                <span className="text-2xl filter drop-shadow">❤️</span>
                <p className="leading-normal">
                  Designed specifically offline-safe: perfect for busy parents, elders, travelers, and people with ADHD.
                </p>
              </div>

            </div>

          </div>

          {/* Privacy pledge */}
          <div className="bg-slate-900/60 border border-slate-800 p-6.5 rounded-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-1 border border-emerald-500/20">
              <ShieldCheck size={24} />
            </div>
            <h4 className="font-display font-semibold text-lg text-white">Your data stays completely yours</h4>
            <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
              We do not track you, run advertisements, or harvest location coordinates. All stored properties are encrypted directly on your browser local storage cache. You can completely backup and carry your data away as JSON anytime.
            </p>
          </div>

        </main>
      ) : (
        
        // RENDER VIEW 2: ACTIVE SECURE PHYSICAL STORAGE CATALOG WORKSPACE
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:py-8 space-y-8 animate-fade-in">
          
          {/* Quick Toggle back to details guide */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs text-slate-200">
                You are searching in your <strong className="text-emerald-400 font-semibold">Active Secure Offline Memory</strong>.
              </p>
            </div>
            <button
              onClick={() => setViewMode('landing')}
              className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer hover:no-underline"
            >
              ← Back to Overview Cover Page
            </button>
          </div>

          {/* Search bar & Query analysis panel */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-xl md:text-2xl text-white">Seek Memorised Belonging</h2>
                <p className="text-xs text-slate-400">Type natural questions or keyword coordinates below</p>
              </div>
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-emerald-500/5 hover:shadow-emerald-500/15 cursor-pointer"
              >
                <Plus size={14} className="stroke-[3]" /> Add New Object
              </button>
            </div>

            {/* Input search box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Where is my passport?  /  What is in the Kitchen?  /  Search cables or tags..."
                value={searchQuery}
                aria-label="Keyword or natural language search"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800/80 rounded-2xl pl-12 pr-10 py-3.5 text-sm md:text-base text-white placeholder-slate-500 focus:outline-none focus:border-emerald-505 focus:ring-1 focus:ring-emerald-500/20 transition-all font-sans"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-505 select-none">
                <Search size={18} className="text-slate-400" />
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear filter search query"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Dynamic Search analysis bubble suggestion */}
            {searchQuery && (
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 flex items-center justify-between text-xs gap-3 font-sans animate-fade-in select-none">
                <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{searchResult.explanation}</span>
                </div>
                {searchResult.matchedItems.length > 0 && (
                  <span className="text-slate-500 text-[10px] font-mono shrink-0">
                    Found {searchResult.matchedItems.length} matched folders
                  </span>
                )}
              </div>
            )}

            {/* Quick helper tag list prompts */}
            {!searchQuery && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-550 font-mono text-[11px] mr-1">Helper Prompts:</span>
                <button 
                  onClick={() => setSearchQuery("Where is my passport?")}
                  className="bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-white px-2.5 py-1 rounded-lg transition text-[11px]"
                >
                  &ldquo;Where is my passport?&rdquo;
                </button>
                <button 
                  onClick={() => setSearchQuery("What is in the Kitchen?")}
                  className="bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-white px-2.5 py-1 rounded-lg transition text-[11px]"
                >
                  &ldquo;What's in Kitchen?&rdquo;
                </button>
                <button 
                  onClick={() => setSearchQuery("tag travel")}
                  className="bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-white px-2.5 py-1 rounded-lg transition text-[11px]"
                >
                  &ldquo;View Travel tags&rdquo;
                </button>
              </div>
            )}
          </div>

          <hr className="border-slate-900" />

          {/* Spaces Browser hierarchical directory */}
          <SpacesBrowser 
            spaces={DEFAULT_SPACES} 
            items={items} 
            selectedRoom={selectedRoom}
            onSelectRoom={(room) => setSelectedRoom(room)}
          />

          <hr className="border-slate-900" />

          {/* Main items panel layout */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-semibold text-lg text-white">Memorised Belongings Catalog</h3>
                <p className="text-xs text-slate-400">Showing filtered physical cards securely registered</p>
              </div>

              {/* Dynamic Categories selection dropdown */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 font-mono">Category:</span>
                <select
                  value={selectedCategory}
                  aria-label="Filter items by category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500/40 cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Tag summary bubble filter */}
            {(selectedRoom || selectedCategory !== 'All' || selectedTag) && (
              <div className="bg-slate-950/40 border border-slate-800/80 px-4 py-2.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-500 font-mono text-[11px]">Applied filters:</span>
                  {selectedRoom && (
                    <span className="bg-slate-900 text-emerald-450 border border-slate-800 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                      Room: <strong>{selectedRoom}</strong>
                      <button onClick={() => setSelectedRoom(null)} className="text-slate-500 hover:text-white">×</button>
                    </span>
                  )}
                  {selectedCategory !== 'All' && (
                    <span className="bg-slate-900 text-emerald-450 border border-slate-800 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                      Category: <strong>{selectedCategory}</strong>
                      <button onClick={() => setSelectedCategory('All')} className="text-slate-500 hover:text-white">×</button>
                    </span>
                  )}
                  {selectedTag && (
                    <span className="bg-slate-900 text-emerald-450 border border-slate-800 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                      Tag: <strong>#{selectedTag}</strong>
                      <button onClick={() => setSelectedTag(null)} className="text-slate-500 hover:text-white">×</button>
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => {
                    setSelectedRoom(null);
                    setSelectedCategory('All');
                    setSelectedTag(null);
                    setSearchQuery('');
                  }}
                  className="text-[11px] font-mono text-rose-450 hover:text-rose-400 underline cursor-pointer"
                >
                  Reset Filtration Defaults
                </button>

              </div>
            )}

            {/* Dynamic visual tag chips directory */}
            {dynamicTagsList.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 text-xs">
                <span className="text-slate-500 font-mono text-[11px] mr-1.5">Filter with tags:</span>
                {dynamicTagsList.map(tag => {
                  const isActive = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(isActive ? null : tag)}
                      className={`px-2.5 py-1 text-xs rounded-lg transition duration-200 border cursor-pointer font-mono ${
                        isActive 
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-450 font-semibold' 
                          : 'bg-slate-950 border-slate-850 hover:border-slate-800 text-slate-400 hover:text-slate-205'
                      }`}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Search list display */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {filteredItems.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onEdit={handleTriggerEdit}
                    onDelete={handleDeleteItem}
                    onViewHistory={handleViewHistory}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center bg-slate-900/30 border border-slate-800/80 rounded-2xl py-12 px-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center mx-auto text-slate-505 text-lg">
                  🗄️
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-display font-medium text-white text-base">No matches found in physical storage</h4>
                  <p className="text-xs text-slate-450 max-w-sm mx-auto leading-relaxed">
                    We couldn't trace any stored belongings corresponding to your query parameters. Try choosing different filtration tags or rooms folder above.
                  </p>
                </div>
                
                <div className="flex justify-center gap-2 pt-2">
                  <button 
                    onClick={() => {
                      setSelectedRoom(null);
                      setSelectedCategory('All');
                      setSelectedTag(null);
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl cursor-pointer"
                  >
                    Clear filtration tags
                  </button>
                  <button 
                    onClick={() => setIsFormOpen(true)}
                    className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl cursor-pointer"
                  >
                    Add new item here
                  </button>
                </div>
              </div>
            )}

          </div>

          <hr className="border-slate-900" />

          {/* Elegant Export/Import System Panel */}
          <BackupManager 
            items={items} 
            onImportBackup={(imported) => {
              setItems(imported);
              saveItemsToLocalStorage(imported);
            }} 
          />

        </main>
      )}

      {/* Footer Branding Credit */}
      <footer className="border-t border-slate-900 py-8 px-4 text-center mt-12 bg-slate-950">
        <p className="text-xs text-slate-500 font-mono">
          Made to be simple. Made to be useful. Made for real life offline.
        </p>
        <p className="text-[10px] text-slate-600 font-mono mt-1">
          WhereDidIPutIt is a 100% serverless, private open memory utility. All records remain safe inside your browser cache.
        </p>
      </footer>

      {/* Item Relocate & Log New modal overlay */}
      <ItemFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setItemToEdit(null);
        }}
        onSave={handleSaveItem}
        itemToEdit={itemToEdit}
      />

      {/* Change Logs Archive History timeline overlay */}
      <MovedHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => {
          setIsHistoryOpen(false);
          setViewingHistoryItem(null);
        }}
        item={viewingHistoryItem}
      />

    </div>
  );
}
