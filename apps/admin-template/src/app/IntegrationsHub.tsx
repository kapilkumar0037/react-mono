import React, { useMemo, useState } from 'react';
import { Badge, Button, Card, Modal, useToast } from '@react-mono/ui-controls';
import { useSyncedSearchQuery } from './useSyncedSearchQuery';

type IntegrationStatus = 'Connected' | 'Needs Attention' | 'Disconnected' | 'Syncing';
type IntegrationCategory = 'Payments' | 'Communication' | 'Commerce' | 'Analytics';
type SyncHealth = 'Healthy' | 'Delayed' | 'Error';

interface Integration {
  id: string;
  name: string;
  provider: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  syncHealth: SyncHealth;
  owner: string;
  lastSyncAt: string;
  events24h: number;
  failures24h: number;
  environment: 'Production' | 'Staging';
}

interface IntegrationsHubProps {
  isDarkMode?: boolean;
}

const initialIntegrations: Integration[] = [
  {
    id: 'INT-5101',
    name: 'Stripe Billing',
    provider: 'Stripe',
    category: 'Payments',
    status: 'Connected',
    syncHealth: 'Healthy',
    owner: 'Finance Ops',
    lastSyncAt: '2026-04-03 09:42',
    events24h: 482,
    failures24h: 0,
    environment: 'Production',
  },
  {
    id: 'INT-5100',
    name: 'Slack Alerts',
    provider: 'Slack',
    category: 'Communication',
    status: 'Needs Attention',
    syncHealth: 'Delayed',
    owner: 'Platform Ops',
    lastSyncAt: '2026-04-03 08:55',
    events24h: 136,
    failures24h: 4,
    environment: 'Production',
  },
  {
    id: 'INT-5099',
    name: 'Shopify Orders',
    provider: 'Shopify',
    category: 'Commerce',
    status: 'Syncing',
    syncHealth: 'Healthy',
    owner: 'Commerce Team',
    lastSyncAt: '2026-04-03 09:38',
    events24h: 924,
    failures24h: 2,
    environment: 'Production',
  },
  {
    id: 'INT-5098',
    name: 'Google Analytics',
    provider: 'Google',
    category: 'Analytics',
    status: 'Connected',
    syncHealth: 'Healthy',
    owner: 'Growth Team',
    lastSyncAt: '2026-04-03 09:30',
    events24h: 1520,
    failures24h: 0,
    environment: 'Production',
  },
  {
    id: 'INT-5097',
    name: 'Twilio Messaging',
    provider: 'Twilio',
    category: 'Communication',
    status: 'Disconnected',
    syncHealth: 'Error',
    owner: 'Support Ops',
    lastSyncAt: '2026-04-02 23:10',
    events24h: 18,
    failures24h: 11,
    environment: 'Staging',
  },
  {
    id: 'INT-5096',
    name: 'Warehouse Webhooks',
    provider: 'FulfillPro',
    category: 'Commerce',
    status: 'Needs Attention',
    syncHealth: 'Delayed',
    owner: 'Inventory Ops',
    lastSyncAt: '2026-04-03 07:48',
    events24h: 311,
    failures24h: 7,
    environment: 'Production',
  },
];

const IntegrationsHub: React.FC<IntegrationsHubProps> = ({ isDarkMode = false }) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useSyncedSearchQuery();
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [statusFilter, setStatusFilter] = useState<IntegrationStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<IntegrationCategory | 'all'>('all');
  const [healthFilter, setHealthFilter] = useState<SyncHealth | 'all'>('all');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const filteredIntegrations = useMemo(() => {
    return integrations.filter((integration) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        query === '' ||
        integration.id.toLowerCase().includes(query) ||
        integration.name.toLowerCase().includes(query) ||
        integration.provider.toLowerCase().includes(query) ||
        integration.owner.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || integration.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || integration.category === categoryFilter;
      const matchesHealth = healthFilter === 'all' || integration.syncHealth === healthFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesHealth;
    });
  }, [categoryFilter, healthFilter, integrations, searchQuery, statusFilter]);

  const stats = useMemo(
    () => [
      { label: 'Connected', value: integrations.filter((integration) => integration.status === 'Connected').length.toString(), tone: 'border-green-500' },
      { label: 'Needs Attention', value: integrations.filter((integration) => integration.status === 'Needs Attention').length.toString(), tone: 'border-amber-500' },
      { label: 'Errors', value: integrations.filter((integration) => integration.syncHealth === 'Error').length.toString(), tone: 'border-red-500' },
      { label: 'Events / 24h', value: integrations.reduce((sum, integration) => sum + integration.events24h, 0).toLocaleString(), tone: 'border-blue-500' },
    ],
    [integrations]
  );

  const getStatusVariant = (status: IntegrationStatus) => {
    switch (status) {
      case 'Connected':
        return 'success';
      case 'Needs Attention':
        return 'warning';
      case 'Disconnected':
        return 'secondary';
      case 'Syncing':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const getCategoryClasses = (category: IntegrationCategory) => {
    switch (category) {
      case 'Payments':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
      case 'Communication':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
      case 'Commerce':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200';
      case 'Analytics':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getHealthClasses = (health: SyncHealth) => {
    switch (health) {
      case 'Healthy':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
      case 'Delayed':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200';
      case 'Error':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const updateIntegration = (
    integrationId: string,
    updater: (integration: Integration) => Integration,
    message: string
  ) => {
    setIntegrations((currentIntegrations) =>
      currentIntegrations.map((integration) =>
        integration.id === integrationId ? updater(integration) : integration
      )
    );
    setSelectedIntegration((currentIntegration) =>
      currentIntegration && currentIntegration.id === integrationId
        ? updater(currentIntegration)
        : currentIntegration
    );
    showToast({
      message,
      variant: 'success',
    });
  };

  const reconnectIntegration = (integration: Integration) => {
    updateIntegration(
      integration.id,
      (currentIntegration) => ({
        ...currentIntegration,
        status: 'Connected',
        syncHealth: 'Healthy',
        failures24h: 0,
        lastSyncAt: '2026-04-03 09:58',
      }),
      `${integration.name} reconnected successfully.`
    );
  };

  const runSync = (integration: Integration) => {
    updateIntegration(
      integration.id,
      (currentIntegration) => ({
        ...currentIntegration,
        status: 'Syncing',
        syncHealth: 'Healthy',
        lastSyncAt: '2026-04-03 10:00',
      }),
      `${integration.name} sync started successfully.`
    );
  };

  const pauseIntegration = (integration: Integration) => {
    updateIntegration(
      integration.id,
      (currentIntegration) => ({
        ...currentIntegration,
        status: 'Disconnected',
      }),
      `${integration.name} paused for manual review.`
    );
  };

  return (
    <div className={`flex-1 p-6 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Integrations Hub</h1>
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Monitor external systems, connection health, and operational sync risk across your stack.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                showToast({
                  message: 'Integration audit export started for the current view.',
                  variant: 'info',
                })
              }
              className="bg-gray-700 text-white"
            >
              Export Audit
            </Button>
            <Button
              onClick={() =>
                showToast({
                  message: 'Global connection test queued successfully.',
                  variant: 'success',
                })
              }
              className="bg-blue-600 text-white"
            >
              Run Health Check
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-3 border-l-4 ${stat.tone}`}
            >
              <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs font-medium`}>
                {stat.label}
              </div>
              <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            <div className="xl:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Integration, provider, owner, or ID..."
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as IntegrationStatus | 'all')}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All statuses</option>
                <option value="Connected">Connected</option>
                <option value="Needs Attention">Needs Attention</option>
                <option value="Disconnected">Disconnected</option>
                <option value="Syncing">Syncing</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value as IntegrationCategory | 'all')}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All categories</option>
                <option value="Payments">Payments</option>
                <option value="Communication">Communication</option>
                <option value="Commerce">Commerce</option>
                <option value="Analytics">Analytics</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sync Health</label>
              <select
                value={healthFilter}
                onChange={(event) => setHealthFilter(event.target.value as SyncHealth | 'all')}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All health states</option>
                <option value="Healthy">Healthy</option>
                <option value="Delayed">Delayed</option>
                <option value="Error">Error</option>
              </select>
            </div>
          </div>
          <div className={`mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {filteredIntegrations.length} integration{filteredIntegrations.length === 1 ? '' : 's'} in the current view.
          </div>
        </Card>

        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Integration</th>
                  <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                  <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</th>
                  <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Health</th>
                  <th className={`px-3 py-2 text-right font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Events</th>
                  <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Last Sync</th>
                  <th className={`px-3 py-2 text-right font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIntegrations.map((integration) => (
                  <tr
                    key={integration.id}
                    className={`border-b transition-colors ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <td className="px-3 py-2 align-top">
                      <div className={`font-semibold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{integration.name}</div>
                      <div className={`mt-0.5 truncate max-w-[220px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{integration.provider} • {integration.owner}</div>
                      <div className={`mt-0.5 whitespace-nowrap ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{integration.id} • {integration.environment}</div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <Badge variant={getStatusVariant(integration.status)}>{integration.status}</Badge>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getCategoryClasses(integration.category)}`}>
                        {integration.category}
                      </span>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getHealthClasses(integration.syncHealth)}`}>
                        {integration.syncHealth}
                      </span>
                    </td>
                    <td className={`px-3 py-2 align-top text-right font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {integration.events24h.toLocaleString()}
                      <div className={`mt-0.5 font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {integration.failures24h} failed
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{integration.lastSyncAt}</div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex justify-end gap-1.5">
                        <Button onClick={() => setSelectedIntegration(integration)} className="bg-gray-700 text-white text-xs px-2.5 py-1">
                          View
                        </Button>
                        {integration.status !== 'Connected' && (
                          <Button onClick={() => reconnectIntegration(integration)} className="bg-blue-600 text-white text-xs px-2.5 py-1">
                            Reconnect
                          </Button>
                        )}
                        {integration.status !== 'Syncing' && (
                          <Button onClick={() => runSync(integration)} className="bg-indigo-600 text-white text-xs px-2.5 py-1">
                            Sync
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredIntegrations.length === 0 && (
            <div className={`px-4 py-10 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No integrations match the current filters. Try clearing a health or status filter.
            </div>
          )}
        </Card>
      </div>

      <Modal
        isOpen={selectedIntegration !== null}
        onClose={() => setSelectedIntegration(null)}
        title={selectedIntegration ? `Integration ${selectedIntegration.id}` : 'Integration Details'}
        size="lg"
      >
        {selectedIntegration && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Integration</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedIntegration.name}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedIntegration.provider}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedIntegration.environment}</p>
              </Card>
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ownership</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedIntegration.owner}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedIntegration.category}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Last sync {selectedIntegration.lastSyncAt}</p>
              </Card>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
                <div className="mt-2">
                  <Badge variant={getStatusVariant(selectedIntegration.status)}>{selectedIntegration.status}</Badge>
                </div>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Health</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedIntegration.syncHealth}</p>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Events / 24h</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedIntegration.events24h.toLocaleString()}</p>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Failures / 24h</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedIntegration.failures24h}</p>
              </div>
            </div>

            <div className={`rounded-lg border p-4 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
              <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Operational Notes</h3>
              <ul className={`mt-3 space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>Integration ID: {selectedIntegration.id}</li>
                <li>Provider: {selectedIntegration.provider}</li>
                <li>Owner: {selectedIntegration.owner}</li>
                <li>Environment: {selectedIntegration.environment}</li>
              </ul>
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <Button onClick={() => setSelectedIntegration(null)} className="bg-gray-600 text-white">
                Close
              </Button>
              {selectedIntegration.status !== 'Connected' && (
                <Button onClick={() => reconnectIntegration(selectedIntegration)} className="bg-blue-600 text-white">
                  Reconnect
                </Button>
              )}
              {selectedIntegration.status !== 'Disconnected' && (
                <Button onClick={() => pauseIntegration(selectedIntegration)} className="bg-gray-700 text-white">
                  Pause
                </Button>
              )}
              {selectedIntegration.status !== 'Syncing' && (
                <Button onClick={() => runSync(selectedIntegration)} className="bg-indigo-600 text-white">
                  Run Sync
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default IntegrationsHub;
