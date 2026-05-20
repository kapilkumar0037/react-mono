import { useState, useEffect } from 'react';

export interface FilterPreset {
  id: string;
  name: string;
  filters: Record<string, any>;
  createdAt: number;
  isDefault?: boolean;
}

const STORAGE_KEY = 'filter-presets';

export const useFilterPresets = (pageKey: string) => {
  const [presets, setPresets] = useState<FilterPreset[]>([]);

  // Load presets from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY}:${pageKey}`);
    if (stored) {
      try {
        setPresets(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse filter presets:', e);
      }
    }
  }, [pageKey]);

  // Save preset
  const savePreset = (name: string, filters: Record<string, any>) => {
    const newPreset: FilterPreset = {
      id: `preset-${Date.now()}`,
      name,
      filters,
      createdAt: Date.now(),
    };
    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem(`${STORAGE_KEY}:${pageKey}`, JSON.stringify(updated));
    return newPreset;
  };

  // Load preset
  const loadPreset = (id: string): Record<string, any> | null => {
    const preset = presets.find(p => p.id === id);
    return preset ? preset.filters : null;
  };

  // Delete preset
  const deletePreset = (id: string) => {
    const updated = presets.filter(p => p.id !== id);
    setPresets(updated);
    localStorage.setItem(`${STORAGE_KEY}:${pageKey}`, JSON.stringify(updated));
  };

  // Rename preset
  const renamePreset = (id: string, newName: string) => {
    const updated = presets.map(p =>
      p.id === id ? { ...p, name: newName } : p
    );
    setPresets(updated);
    localStorage.setItem(`${STORAGE_KEY}:${pageKey}`, JSON.stringify(updated));
  };

  // Set as default
  const setAsDefault = (id: string) => {
    const updated = presets.map(p => ({
      ...p,
      isDefault: p.id === id,
    }));
    setPresets(updated);
    localStorage.setItem(`${STORAGE_KEY}:${pageKey}`, JSON.stringify(updated));
  };

  // Get default preset
  const getDefaultPreset = () => {
    return presets.find(p => p.isDefault) || null;
  };

  return {
    presets,
    savePreset,
    loadPreset,
    deletePreset,
    renamePreset,
    setAsDefault,
    getDefaultPreset,
  };
};
