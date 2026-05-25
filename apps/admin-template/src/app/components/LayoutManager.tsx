import React, { useState } from 'react';
import { Modal, Button, InputGroup, InputGroupInput } from '@react-mono/ui-controls';
import { DashboardLayout } from '../types/dashboard';

interface LayoutManagerProps {
  isOpen: boolean;
  onClose: () => void;
  layouts: DashboardLayout[];
  activeLayoutId: string;
  onSwitchLayout: (layoutId: string) => void;
  onCreateLayout: (name: string, description?: string) => void;
  onDeleteLayout: (layoutId: string) => void;
  isDarkMode?: boolean;
}

export const LayoutManager: React.FC<LayoutManagerProps> = ({
  isOpen,
  onClose,
  layouts,
  activeLayoutId,
  onSwitchLayout,
  onCreateLayout,
  onDeleteLayout,
  isDarkMode = false,
}) => {
  const [newLayoutName, setNewLayoutName] = useState('');
  const [newLayoutDesc, setNewLayoutDesc] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateLayout = () => {
    if (!newLayoutName.trim()) return;

    onCreateLayout(newLayoutName, newLayoutDesc);
    setNewLayoutName('');
    setNewLayoutDesc('');
    setShowCreateForm(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Dashboard Layouts" size="md">
      <div className={`space-y-4 max-h-96 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Create New Layout */}
        {!showCreateForm && (
          <Button
            onClick={() => setShowCreateForm(true)}
            className="w-full bg-blue-600 text-white"
          >
            + Create New Layout
          </Button>
        )}

        {showCreateForm && (
          <div className={`rounded-lg p-4 space-y-3 border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Layout Name
              </label>
              <InputGroup>
                <InputGroupInput
                  placeholder="e.g., Sales Dashboard"
                  value={newLayoutName}
                  onChange={(e) => setNewLayoutName(e.target.value)}
                />
              </InputGroup>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Description (optional)
              </label>
              <textarea
                placeholder="Describe this layout..."
                value={newLayoutDesc}
                onChange={(e) => setNewLayoutDesc(e.target.value)}
                className={`w-full rounded-lg px-3 py-2 text-sm border ${
                  isDarkMode
                    ? 'border-gray-600 bg-gray-700 text-white'
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCreateLayout}
                disabled={!newLayoutName.trim()}
                className="flex-1 bg-green-600 text-white disabled:bg-gray-400"
              >
                Create
              </Button>
              <Button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-gray-500 text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Layout List */}
        <div className="space-y-2">
          <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Your Layouts
          </h3>

          {layouts.length === 0 ? (
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No layouts yet
            </p>
          ) : (
            layouts.map((layout) => (
              <div
                key={layout.id}
                className={`rounded-lg p-3 border-2 transition-colors cursor-pointer ${
                  activeLayoutId === layout.id
                    ? `${isDarkMode ? 'border-blue-500 bg-blue-900 bg-opacity-30' : 'border-blue-500 bg-blue-50'}`
                    : `${isDarkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'}`
                }`}
              >
                <div className="flex items-start justify-between">
                  <button
                    onClick={() => onSwitchLayout(layout.id)}
                    className="flex-1 text-left"
                  >
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {layout.name}
                      {layout.isDefault && (
                        <span className={`ml-2 text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                          Default
                        </span>
                      )}
                      {activeLayoutId === layout.id && (
                        <span className={`ml-2 text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-900'}`}>
                          Active
                        </span>
                      )}
                    </p>
                    {layout.description && (
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {layout.description}
                      </p>
                    )}
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {layout.widgets.length} widget{layout.widgets.length !== 1 ? 's' : ''}
                    </p>
                  </button>

                  {!layout.isDefault && (
                    <button
                      onClick={() => onDeleteLayout(layout.id)}
                      className={`text-xs font-medium px-2 py-1 rounded ml-2 ${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-2 justify-end border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <Button onClick={onClose} className="bg-gray-500 text-white">
          Close
        </Button>
      </div>
    </Modal>
  );
};
