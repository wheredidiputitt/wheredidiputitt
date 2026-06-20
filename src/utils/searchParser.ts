import { Item } from '../types';

export interface ParseResult {
  queryType: 'all' | 'item' | 'location' | 'tag' | 'general';
  targetValue: string;
  matchedItems: Item[];
  explanation: string;
}

export function parseNaturalLanguageQuery(query: string, items: Item[]): ParseResult {
  const clean = query.trim().toLowerCase();
  
  if (!clean) {
    return {
      queryType: 'all',
      targetValue: '',
      matchedItems: items,
      explanation: 'Showing all items.'
    };
  }

  // Regex patterns
  const whereIsPattern = /^(where is my|where is|wheres|where's|find my|find)\s+(.+)$/i;
  const whatsInPattern = /^(what is in the|what is in|whats in the|whats in|what's in the|what's in|what is on the|what's on standard|show me things in|show me items in)\s+(.+)$/i;
  const tagPattern = /^(tag|tags|tagged with|category|labelled)\s+(.+)$/i;

  let queryType: ParseResult['queryType'] = 'general';
  let targetValue = '';
  let filtered: Item[] = [];
  let explanation = '';

  const matchWhere = clean.match(whereIsPattern);
  const matchWhats = clean.match(whatsInPattern);
  const matchTag = clean.match(tagPattern);

  if (matchWhere) {
    queryType = 'item';
    targetValue = matchWhere[2].trim();
    filtered = items.filter(item => 
      item.name.toLowerCase().includes(targetValue) ||
      item.category.toLowerCase().includes(targetValue) ||
      item.tags.some(t => t.toLowerCase() === targetValue)
    );
    explanation = filtered.length > 0
      ? `Looking for items matching "${targetValue}"`
      : `No items found matching "${targetValue}".`;
  } else if (matchWhats) {
    queryType = 'location';
    targetValue = matchWhats[2].trim();
    // Strip trailing question marks
    targetValue = targetValue.replace(/\?+$/, '');
    
    filtered = items.filter(item => 
      item.room.toLowerCase().includes(targetValue) ||
      item.container.toLowerCase().includes(targetValue) ||
      (item.subLocation && item.subLocation.toLowerCase().includes(targetValue))
    );
    explanation = filtered.length > 0
      ? `Showing items stored in or near "${targetValue}"`
      : `No items found currently matching location "${targetValue}".`;
  } else if (matchTag) {
    queryType = 'tag';
    targetValue = matchTag[2].trim();
    filtered = items.filter(item => 
      item.tags.some(t => t.toLowerCase().includes(targetValue)) ||
      item.category.toLowerCase().includes(targetValue)
    );
    explanation = `Showing stored items categorised as "${targetValue}"`;
  } else {
    // General keyword query
    targetValue = clean.replace(/\?+$/, '');
    queryType = 'general';
    filtered = items.filter(item => 
      item.name.toLowerCase().includes(targetValue) ||
      item.room.toLowerCase().includes(targetValue) ||
      item.container.toLowerCase().includes(targetValue) ||
      (item.subLocation && item.subLocation.toLowerCase().includes(targetValue)) ||
      item.category.toLowerCase().includes(targetValue) ||
      item.tags.some(t => t.toLowerCase().includes(targetValue)) ||
      (item.notes && item.notes.toLowerCase().includes(targetValue))
    );
    explanation = `Searching for keyword "${targetValue}" across your memories.`;
  }

  return {
    queryType,
    targetValue,
    matchedItems: filtered,
    explanation
  };
}
