import React, { useState } from 'react';
import { Card } from '@react-mono/ui-controls';
import { useGlobalToast } from './hooks/useGlobalToast';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  displayKey: string;
  created: string;
  lastUsed: string;
  status: 'active' | 'revoked' | 'expired';
  expiresAt: string;
  permissions: string[];
  usageCount: number;
}

interface CreateKeyForm {
  name: string;
  expiresIn: string;
  permissions: string[];
}

interface ApiKeyManagementProps {
  isDarkMode?: boolean;
}

const ApiKeyManagement: React.FC<ApiKeyManagementProps> = ({ isDarkMode = false }) => {
  const { addToast } = useGlobalToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: 'key_1',
      name: 'Production API',
      key: 'sk_test_51234567890abcdefghijklmnopqrstuvwxyz',
      displayKey: 'sk_test_...opqr',
      created: '2024-01-15',
      lastUsed: '2024-02-26 14:32',
      status: 'active',
      expiresAt: '2025-01-15',
      permissions: ['read', 'write', 'delete'],
      usageCount: 2845,
    },
    {
      id: 'key_2',
      name: 'Development API',
      key: 'sk_dev_98765432109876543210987654321098765432',
      displayKey: 'sk_dev_...8765',
      created: '2024-02-01',
      lastUsed: '2024-02-26 09:15',
      status: 'active',
      expiresAt: '2024-08-01',
      permissions: ['read', 'write'],
      usageCount: 1234,
    },
    {
      id: 'key_3',
      name: 'Testing API',
      key: 'sk_test_55555555555555555555555555555555555555',
      displayKey: 'sk_test_...5555',
      created: '2024-01-20',
      lastUsed: '2024-02-20 18:45',
      status: 'active',
      expiresAt: '2024-07-20',
      permissions: ['read'],
      usageCount: 567,
    },
    {
      id: 'key_4',
      name: 'Old Integration',
      key: 'sk_old_11111111111111111111111111111111111111',
      displayKey: 'sk_old_...1111',
      created: '2023-06-10',
      lastUsed: '2023-12-15 10:20',
      status: 'revoked',
      expiresAt: '2024-06-10',
      permissions: ['read', 'write'],
      usageCount: 5432,
    },
    {
      id: 'key_5',
      name: 'Analytics Key',
      key: 'sk_test_77777777777777777777777777777777777777',
      displayKey: 'sk_test_...7777',
      created: '2024-02-10',
      lastUsed: 'Never',
      status: 'active',
      expiresAt: '2025-02-10',
      permissions: ['read'],
      usageCount: 0,
    },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateKeyForm>({
    name: '',
    expiresIn: '1year',
    permissions: ['read'],
  });
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);

  const stats = [
    { label: 'Active Keys', value: apiKeys.filter(k => k.status === 'active').length.toString(), color: 'green' },
    { label: 'Total Usage', value: apiKeys.reduce((sum, k) => sum + k.usageCount, 0).toString(), color: 'blue' },
    { label: 'Revoked', value: apiKeys.filter(k => k.status === 'revoked').length.toString(), color: 'red' },
    { label: 'Expired/Expiring', value: apiKeys.filter(k => k.status === 'expired').length.toString(), color: 'amber' },
  ];

  const permissionOptions = [
    { value: 'read', label: 'Read (GET requests)' },
    { value: 'write', label: 'Write (POST/PUT requests)' },
    { value: 'delete', label: 'Delete (DELETE requests)' },
    { value: 'admin', label: 'Admin (Full access)' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'revoked':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'expired':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'border-l-4 border-green-500';
      case 'blue':
        return 'border-l-4 border-blue-500';
      case 'red':
        return 'border-l-4 border-red-500';
      case 'amber':
        return 'border-l-4 border-amber-500';
      default:
        return 'border-l-4 border-gray-500';
    }
  };

  const copyToClipboard = (key: string, keyId: string) => {
    navigator.clipboard
      .writeText(key)
      .then(() => {
        setShowCopyNotification(keyId);
        addToast({ type: 'success', message: 'API key copied to clipboard.' });
        setTimeout(() => setShowCopyNotification(null), 2000);
      })
      .catch(() => {
        addToast({ type: 'error', message: 'Could not copy API key. Try selecting it manually.' });
      });
  };

  const handleCreateKey = () => {
    if (!formData.name.trim()) {
      addToast({ type: 'warning', message: 'Add a key name before creating the API key.' });
      return;
    }

    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      name: formData.name,
      key: `sk_test_${Math.random().toString(36).substring(2)}`,
      displayKey: `sk_test_...${Math.random().toString(36).substring(2, 6)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      status: 'active',
      expiresAt: formData.expiresIn === 'never' ? 'Never' : '2025-02-27',
      permissions: formData.permissions,
      usageCount: 0,
    };
    setApiKeys([newKey, ...apiKeys]);
    setFormData({ name: '', expiresIn: '1year', permissions: ['read'] });
    setShowCreateForm(false);
    addToast({ type: 'success', message: `${newKey.name} API key created.` });
  };

  const revokeKey = (id: string) => {
    const apiKey = apiKeys.find((key) => key.id === id);
    setApiKeys(apiKeys.map(k => k.id === id ? { ...k, status: 'revoked' as const } : k));
    setSelectedKey(null);
    addToast({ type: 'warning', message: apiKey ? `${apiKey.name} API key revoked.` : 'API key revoked.' });
  };

  const deleteKey = (id: string) => {
    const apiKey = apiKeys.find((key) => key.id === id);
    setApiKeys(apiKeys.filter(k => k.id !== id));
    setSelectedKey(null);
    addToast({ type: 'info', message: apiKey ? `${apiKey.name} API key deleted.` : 'API key deleted.' });
  };

  return (
    <div className={`flex-1 p-6 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold mb-1.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              API Key Management
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Create, manage, and revoke API keys for system integrations
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            + Create New Key
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          {stats.map((stat, idx) => (
            <Card key={idx} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} ${getStatColor(stat.color)}`}>
              <div>
                <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Create Key Form */}
        {showCreateForm && (
          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} mb-6`}>
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Create New API Key
              </h3>

              <div className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Key Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Production API, Mobile App"
                    className={`w-full px-3 py-2 rounded border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:border-blue-500`}
                  />
                </div>

                {/* Expiration */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Expires In
                  </label>
                  <select
                    value={formData.expiresIn}
                    onChange={(e) => setFormData({ ...formData, expiresIn: e.target.value })}
                    className={`w-full px-3 py-2 rounded border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:border-blue-500`}
                  >
                    <option value="3months">3 months</option>
                    <option value="6months">6 months</option>
                    <option value="1year">1 year</option>
                    <option value="2years">2 years</option>
                    <option value="never">Never expires</option>
                  </select>
                </div>

                {/* Permissions */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Permissions
                  </label>
                  <div className="space-y-2">
                    {permissionOptions.map((perm) => (
                      <label key={perm.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(perm.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                permissions: [...formData.permissions, perm.value],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                permissions: formData.permissions.filter(p => p !== perm.value),
                              });
                            }
                          }}
                          className="w-4 h-4 rounded"
                        />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {perm.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleCreateKey}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Create Key
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className={`px-4 py-2 rounded border transition-colors ${
                      isDarkMode
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* API Keys List */}
        <Card title="API Keys" className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <div className="space-y-3">
            {apiKeys.length === 0 ? (
              <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No API keys created yet
              </p>
            ) : (
              apiKeys.map((key) => (
                <div
                  key={key.id}
                  className={`p-4 rounded border ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'} hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {key.name}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded font-medium ${getStatusColor(key.status)}`}>
                          {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                        </span>
                      </div>

                      <div className={`flex items-center gap-2 mb-3 p-2 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <code className={`flex-1 text-sm font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {key.displayKey}
                        </code>
                        <button
                          onClick={() => copyToClipboard(key.key, key.id)}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            showCopyNotification === key.id
                              ? 'bg-green-600 text-white'
                              : isDarkMode
                              ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {showCopyNotification === key.id ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                        <div>
                          <p className={`text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Created
                          </p>
                          <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {key.created}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Last Used
                          </p>
                          <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {key.lastUsed}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Expires
                          </p>
                          <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {key.expiresAt}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Usage
                          </p>
                          <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {key.usageCount} calls
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Permissions:
                        </span>
                        {key.permissions.map((perm) => (
                          <span
                            key={perm}
                            className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'}`}
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <button
                        onClick={() => setSelectedKey(key)}
                        className={`px-3 py-2 text-sm rounded transition-colors ${
                          isDarkMode
                            ? 'bg-yellow-900 text-yellow-200 hover:bg-yellow-800'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        More
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Key Details Modal */}
        {selectedKey && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} max-w-md`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedKey.name}
                  </h3>
                  <button
                    onClick={() => setSelectedKey(null)}
                    className={`text-2xl leading-none ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div>
                    <p className={`text-xs uppercase tracking-wider mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Full Key
                    </p>
                    <p className={`font-mono text-xs break-all ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {selectedKey.key}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wider mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Status
                    </p>
                    <p className={`text-sm capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {selectedKey.status}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wider mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Created Date
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {selectedKey.created}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wider mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Total Usage
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {selectedKey.usageCount} API calls
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedKey(null)}
                    className={`flex-1 px-4 py-2 rounded border transition-colors ${
                      isDarkMode
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Close
                  </button>
                  {selectedKey.status === 'active' && (
                    <button
                      onClick={() => revokeKey(selectedKey.id)}
                      className={`flex-1 px-4 py-2 rounded transition-colors ${
                        isDarkMode
                          ? 'bg-yellow-900 text-yellow-200 hover:bg-yellow-800'
                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      }`}
                    >
                      Revoke
                    </button>
                  )}
                  <button
                    onClick={() => deleteKey(selectedKey.id)}
                    className={`flex-1 px-4 py-2 rounded transition-colors ${
                      isDarkMode
                        ? 'bg-red-900 text-red-200 hover:bg-red-800'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiKeyManagement;
