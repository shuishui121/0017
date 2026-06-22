import { OutfitScheme } from '@/types';

const STORAGE_KEY = 'outfit_schemes';
const MAX_SCHEMES = 20;

export function getAllSchemes(): OutfitScheme[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const schemes = JSON.parse(data);
    return Array.isArray(schemes) ? schemes : [];
  } catch (e) {
    console.error('Failed to load schemes:', e);
    return [];
  }
}

export function getSchemeCount(): number {
  return getAllSchemes().length;
}

export function canSaveScheme(): boolean {
  return getSchemeCount() < MAX_SCHEMES;
}

export function saveScheme(scheme: OutfitScheme): boolean {
  try {
    const schemes = getAllSchemes();
    
    if (schemes.length >= MAX_SCHEMES) {
      return false;
    }
    
    const existingIndex = schemes.findIndex(s => s.id === scheme.id);
    if (existingIndex >= 0) {
      schemes[existingIndex] = scheme;
    } else {
      schemes.unshift(scheme);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schemes));
    return true;
  } catch (e) {
    console.error('Failed to save scheme:', e);
    return false;
  }
}

export function deleteScheme(schemeId: string): boolean {
  try {
    const schemes = getAllSchemes();
    const filtered = schemes.filter(s => s.id !== schemeId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Failed to delete scheme:', e);
    return false;
  }
}

export function getSchemeById(schemeId: string): OutfitScheme | undefined {
  const schemes = getAllSchemes();
  return schemes.find(s => s.id === schemeId);
}

export function updateScheme(schemeId: string, updates: Partial<OutfitScheme>): boolean {
  try {
    const schemes = getAllSchemes();
    const index = schemes.findIndex(s => s.id === schemeId);
    if (index === -1) return false;
    
    schemes[index] = { ...schemes[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schemes));
    return true;
  } catch (e) {
    console.error('Failed to update scheme:', e);
    return false;
  }
}

export function clearAllSchemes(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error('Failed to clear schemes:', e);
    return false;
  }
}

export function generateSchemeId(): string {
  return `scheme_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export { MAX_SCHEMES };
