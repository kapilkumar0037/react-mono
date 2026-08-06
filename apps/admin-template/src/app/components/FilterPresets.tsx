import React, { useState } from 'react';
import { FilterPreset } from '../hooks/useFilterPresets';

interface FilterPresetsProps {
  presets: FilterPreset[];
  onLoadPreset: (id: string) => void;
  onDeletePreset: (id: string) => void;
  onRenamePreset: (id: string, newName: string) => void;
  onSetAsDefault: (id: string) => void;
  onSaveNew: (name: string, filters: Record<string, any>) => void;
  currentFilters: Record<string, any>;
}

export const FilterPresets: React.FC<FilterPresetsProps> = ({
  presets,
  onLoadPreset,
  onDeletePreset,
  onRenamePreset,
  onSetAsDefault,
  onSaveNew,
  currentFilters,
}) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const hasActiveFilters = Object.values(currentFilters).some(
    v => v !== undefined && v !== '' && v !== null && (!Array.isArray(v) || v.length > 0)
  );

  const handleSavePreset = () => {
    if (newPresetName.trim()) {
      onSaveNew(newPresetName, currentFilters);
      setNewPresetName('');
      setShowSaveDialog(false);
    }
  };

  const handleRenameComplete = (id: string) => {
    if (editingName.trim()) {
      onRenamePreset(id, editingName);
    }
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div className="space-y-3 border-b border-gray-200 dark:border-gray-700 pb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Filter Presets</h3>
        {hasActiveFilters && (
          <button
            onClick={() => setShowSaveDialog(true)}
            className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            Save Current
          </button>
        )}
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md border border-blue-200 dark:border-blue-800">
          <input
            type="text"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            placeholder="Enter preset name..."
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSavePreset()}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSavePreset}
              className="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowSaveDialog(false);
                setNewPresetName('');
              }}
              className="px-3 py-1 text-xs bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Presets List */}
      {presets.length > 0 ? (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                {editingId === preset.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => handleRenameComplete(preset.id)}
                    onKeyPress={(e) => e.key === 'Enter' && handleRenameComplete(preset.id)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                ) : (
                  <div
                    onClick={() => {
                      setEditingId(preset.id);
                      setEditingName(preset.name);
                    }}
                    className="text-xs font-medium text-gray-900 dark:text-white cursor-pointer hover:underline"
                  >
                    {preset.name}
                    {preset.isDefault && (
                      <span className="ml-2 inline-block px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onLoadPreset(preset.id)}
                  title="Load preset"
                  className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                >
                  Load
                </button>
                {!preset.isDefault && (
                  <button
                    onClick={() => onSetAsDefault(preset.id)}
                    title="Set as default"
                    className="px-2 py-1 text-xs bg-gray-400 hover:bg-gray-500 text-white rounded transition-colors"
                  >
                    Default
                  </button>
                )}
                <button
                  onClick={() => onDeletePreset(preset.id)}
                  title="Delete preset"
                  className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-500 dark:text-gray-400 py-2">No saved presets</p>
      )}
    </div>
  );
};
