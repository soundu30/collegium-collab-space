
/**
 * A simple utility to use localStorage as a database for offline functionality
 */

// Define collection types
type Collection = 'resources' | 'messages' | 'conversations' | 'events' | 'eventParticipants';

// Generic function to get items from a collection
export function getCollection<T>(collection: Collection): T[] {
  try {
    const items = localStorage.getItem(`collegium_${collection}`);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error(`Error retrieving ${collection} from localStorage:`, error);
    return [];
  }
}

// Generic function to save items to a collection
export function saveCollection<T>(collection: Collection, items: T[]): void {
  try {
    localStorage.setItem(`collegium_${collection}`, JSON.stringify(items));
  } catch (error) {
    console.error(`Error saving ${collection} to localStorage:`, error);
  }
}

// Generic function to add an item to a collection
export function addItem<T extends { id: string }>(collection: Collection, item: T): T {
  const items = getCollection<T>(collection);
  items.push(item);
  saveCollection(collection, items);
  return item;
}

// Generic function to update an item in a collection
export function updateItem<T extends { id: string }>(collection: Collection, id: string, updates: Partial<T>): T | null {
  const items = getCollection<T>(collection);
  const index = items.findIndex(item => item.id === id);
  
  if (index !== -1) {
    const updatedItem = { ...items[index], ...updates };
    items[index] = updatedItem;
    saveCollection(collection, items);
    return updatedItem;
  }
  
  return null;
}

// Generic function to delete an item from a collection
export function deleteItem<T extends { id: string }>(collection: Collection, id: string): boolean {
  const items = getCollection<T>(collection);
  const filteredItems = items.filter(item => item.id !== id);
  
  if (filteredItems.length !== items.length) {
    saveCollection(collection, filteredItems);
    return true;
  }
  
  return false;
}

// Generate a simple UUID for local usage
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
