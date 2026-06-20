export interface MoveHistory {
  id: string;
  itemId: string;
  fromLocation: string;
  toLocation: string;
  timestamp: string; // ISO string
  notes?: string;
}

export interface Item {
  id: string;
  name: string;
  category: string; // e.g. Documents, Electronics, Keys, Tools, Seasonal, etc.
  room: string;     // e.g. Bedroom, Kitchen, Living Room, Garage, Car, Office
  container: string;// e.g. Blue drawer, Laptop bag, Top cabinet, Hallway closet
  subLocation?: string; // e.g. Front pocket, Shelf bin, Top shelf, Left corner
  notes?: string;
  tags: string[];
  lastMoved: string; // ISO string
  createdAt: string; // ISO string
  history: MoveHistory[];
  imagePlaceholder?: string; // A gradient/icon preset style for visual representation
  iconName?: string; // Lucide icon alias
}

export interface Space {
  roomName: string;
  iconName: string;
  description: string;
}
