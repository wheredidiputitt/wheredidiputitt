import { Item, Space } from '../types';

// Helper to generate dynamic past ISO dates so relative times stay realistic
const getPastDateISO = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const DEFAULT_SPACES: Space[] = [
  { roomName: 'Bedroom', iconName: 'Bed', description: 'Closets, dressers, nightstands, and drawers' },
  { roomName: 'Kitchen', iconName: 'Soup', description: 'Cabinets, pantry, drawers, and counter storage' },
  { roomName: 'Office', iconName: 'Briefcase', description: 'Desk, files, bookshelves, and storage compartments' },
  { roomName: 'Living Room', iconName: 'Tv', description: 'Entertainment center, coffee table, and shelves' },
  { roomName: 'Garage / Storage', iconName: 'Warehouse', description: 'Large tool racks, storage bins, and seasonal gear' },
  { roomName: 'Car', iconName: 'Car', description: 'Glovebox, center console, and trunk organizers' },
];

export const SAMPLE_ITEMS: Item[] = [
  {
    id: 'sample-1',
    name: 'Passport (US - Dark Blue)',
    category: 'Documents',
    room: 'Bedroom',
    container: 'Blue drawer',
    subLocation: 'Under the travel organizer bag',
    notes: 'Required for all international trips. Keep alongside spare currency.',
    tags: ['travel', 'id', 'important'],
    lastMoved: getPastDateISO(12),
    createdAt: getPastDateISO(60),
    iconName: 'FileBadge',
    imagePlaceholder: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    history: [
      {
        id: 'h-1-1',
        itemId: 'sample-1',
        fromLocation: 'Office Drawer',
        toLocation: 'Bedroom -> Blue drawer',
        timestamp: getPastDateISO(12),
        notes: 'Moved here for easy access prior to planning summer holiday.',
      }
    ]
  },
  {
    id: 'sample-2',
    name: 'Spare laptop charger',
    category: 'Electronics',
    room: 'Office',
    container: 'Laptop bag',
    subLocation: 'Front zipper pocket',
    notes: 'USB-C 65W fast charger. Works for both phone and MacBook.',
    tags: ['power', 'tech', 'spare'],
    lastMoved: getPastDateISO(2),
    createdAt: getPastDateISO(45),
    iconName: 'Zap',
    imagePlaceholder: 'linear-gradient(135deg, #111827 0%, #4b5563 100%)',
    history: []
  },
  {
    id: 'sample-3',
    name: 'Spare house key set',
    category: 'Keys',
    room: 'Kitchen',
    container: 'Top cabinet drawer',
    subLocation: 'Inside the tiny wooden jar',
    notes: 'Includes back door key and garage padlock key. Has a brass tag.',
    tags: ['keys', 'security', 'emergency'],
    lastMoved: getPastDateISO(21),
    createdAt: getPastDateISO(120),
    iconName: 'Key',
    imagePlaceholder: 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)',
    history: []
  },
  {
    id: 'sample-4',
    name: 'Tax documents (2025 Filing)',
    category: 'Documents',
    room: 'Office',
    container: 'Metal filing box',
    subLocation: 'Folder labeled "TAX-2025"',
    notes: 'Physical receipts and signed return printout. Online copies are on Google Drive.',
    tags: ['taxes', 'financial', 'records'],
    lastMoved: getPastDateISO(116),
    createdAt: getPastDateISO(116),
    iconName: 'FileText',
    imagePlaceholder: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
    history: []
  },
  {
    id: 'sample-5',
    name: 'DSLR Camera & Lens',
    category: 'Electronics',
    room: 'Closet',
    container: 'Clear storage shelf bin',
    subLocation: 'Second shelf from the bottom',
    notes: 'Canon Rebel with 50mm lens. Battery charger is in the black camera bag next to it.',
    tags: ['hobby', 'gear', 'creative'],
    lastMoved: getPastDateISO(28),
    createdAt: getPastDateISO(90),
    iconName: 'Camera',
    imagePlaceholder: 'linear-gradient(135deg, #3730a3 0%, #6366f1 100%)',
    history: []
  },
  {
    id: 'sample-6',
    name: 'Car lease agreements',
    category: 'Documents',
    room: 'Office',
    container: 'Metal filing box',
    subLocation: 'Top suspension file',
    notes: 'Warranty files, registration copies and initial agreements.',
    tags: ['vehicle', 'contract', 'critical'],
    lastMoved: getPastDateISO(45),
    createdAt: getPastDateISO(45),
    iconName: 'FileText',
    imagePlaceholder: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
    history: []
  }
];

export const CATEGORIES = [
  'Documents',
  'Electronics',
  'Keys',
  'Tools',
  'Seasonal',
  'Cables & Chargers',
  'Medicines',
  'Travel Gear',
  'Valuables',
  'Other'
];
