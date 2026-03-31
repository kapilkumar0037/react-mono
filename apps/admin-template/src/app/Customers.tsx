import React, { useMemo, useState } from 'react';
import { Badge, Button, Card, Modal, useToast } from '@react-mono/ui-controls';
import { useSyncedSearchQuery } from './useSyncedSearchQuery';

type CustomerStatus = 'Active' | 'At Risk' | 'VIP' | 'Dormant';
type LifecycleStage = 'New' | 'Engaged' | 'Loyal' | 'Churn Risk';
type AcquisitionChannel = 'Organic' | 'Paid Search' | 'Referral' | 'Marketplace';

interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  region: string;
  status: CustomerStatus;
  stage: LifecycleStage;
  channel: AcquisitionChannel;
  lifetimeValue: number;
  orders: number;
  openTickets: number;
  lastOrderAt: string;
  owner: string;
}

interface CustomersProps {
  isDarkMode?: boolean;
}

const initialCustomers: Customer[] = [
  {
    id: 'CUS-2084',
    name: 'Ava Thompson',
    email: 'ava.thompson@example.com',
    company: 'Northwind Studio',
    region: 'North America',
    status: 'VIP',
    stage: 'Loyal',
    channel: 'Referral',
    lifetimeValue: 8420,
    orders: 24,
    openTickets: 1,
    lastOrderAt: '2026-03-30',
    owner: 'Maya Singh',
  },
  {
    id: 'CUS-2083',
    name: 'Liam Carter',
    email: 'liam.carter@example.com',
    company: 'Carter Commerce',
    region: 'Europe',
    status: 'Active',
    stage: 'Engaged',
    channel: 'Organic',
    lifetimeValue: 3940,
    orders: 12,
    openTickets: 0,
    lastOrderAt: '2026-03-28',
    owner: 'Rahul Verma',
  },
  {
    id: 'CUS-2082',
    name: 'Sophia Patel',
    email: 'sophia.patel@example.com',
    company: 'Patel Retail',
    region: 'Asia Pacific',
    status: 'At Risk',
    stage: 'Churn Risk',
    channel: 'Marketplace',
    lifetimeValue: 5215,
    orders: 17,
    openTickets: 2,
    lastOrderAt: '2026-03-24',
    owner: 'Aditi Rao',
  },
  {
    id: 'CUS-2081',
    name: 'Noah Reed',
    email: 'noah.reed@example.com',
    company: 'Reed Supply Co.',
    region: 'North America',
    status: 'Dormant',
    stage: 'Churn Risk',
    channel: 'Paid Search',
    lifetimeValue: 2140,
    orders: 8,
    openTickets: 1,
    lastOrderAt: '2026-02-11',
    owner: 'Maya Singh',
  },
  {
    id: 'CUS-2080',
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@example.com',
    company: 'Nguyen Market',
    region: 'Asia Pacific',
    status: 'Active',
    stage: 'Loyal',
    channel: 'Organic',
    lifetimeValue: 6730,
    orders: 19,
    openTickets: 0,
    lastOrderAt: '2026-03-29',
    owner: 'Rahul Verma',
  },
  {
    id: 'CUS-2079',
    name: 'Mia Gonzalez',
    email: 'mia.gonzalez@example.com',
    company: 'Gonzalez Home',
    region: 'Latin America',
    status: 'VIP',
    stage: 'Loyal',
    channel: 'Referral',
    lifetimeValue: 9150,
    orders: 31,
    openTickets: 0,
    lastOrderAt: '2026-03-27',
    owner: 'Aditi Rao',
  },
];

const Customers: React.FC<CustomersProps> = ({ isDarkMode = false }) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useSyncedSearchQuery();
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | 'all'>('all');
  const [stageFilter, setStageFilter] = useState<LifecycleStage | 'all'>('all');
  const [channelFilter, setChannelFilter] = useState<AcquisitionChannel | 'all'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        query === '' ||
        customer.id.toLowerCase().includes(query) ||
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.company.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      const matchesStage = stageFilter === 'all' || customer.stage === stageFilter;
      const matchesChannel = channelFilter === 'all' || customer.channel === channelFilter;

      return matchesSearch && matchesStatus && matchesStage && matchesChannel;
    });
  }, [channelFilter, customers, searchQuery, stageFilter, statusFilter]);

  const stats = useMemo(
    () => [
      { label: 'Active Customers', value: customers.filter((customer) => customer.status === 'Active' || customer.status === 'VIP').length.toString(), tone: 'border-blue-500' },
      { label: 'VIP Accounts', value: customers.filter((customer) => customer.status === 'VIP').length.toString(), tone: 'border-purple-500' },
      { label: 'At Risk', value: customers.filter((customer) => customer.status === 'At Risk' || customer.stage === 'Churn Risk').length.toString(), tone: 'border-amber-500' },
      { label: 'Lifetime Value', value: `$${customers.reduce((sum, customer) => sum + customer.lifetimeValue, 0).toLocaleString()}`, tone: 'border-green-500' },
    ],
    [customers]
  );

  const getStatusVariant = (status: CustomerStatus) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'At Risk':
        return 'warning';
      case 'VIP':
        return 'primary';
      case 'Dormant':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStageClasses = (stage: LifecycleStage) => {
    switch (stage) {
      case 'New':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
      case 'Engaged':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200';
      case 'Loyal':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
      case 'Churn Risk':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getChannelClasses = (channel: AcquisitionChannel) => {
    switch (channel) {
      case 'Organic':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
      case 'Paid Search':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200';
      case 'Referral':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200';
      case 'Marketplace':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const updateCustomer = (customerId: string, updater: (customer: Customer) => Customer, message: string) => {
    setCustomers((currentCustomers) =>
      currentCustomers.map((customer) => (customer.id === customerId ? updater(customer) : customer))
    );
    setSelectedCustomer((currentCustomer) =>
      currentCustomer && currentCustomer.id === customerId ? updater(currentCustomer) : currentCustomer
    );
    showToast({
      message,
      variant: 'success',
    });
  };

  const flagForFollowUp = (customer: Customer) => {
    updateCustomer(
      customer.id,
      (currentCustomer) => ({ ...currentCustomer, status: 'At Risk', stage: 'Churn Risk' }),
      `${customer.name} moved into the retention queue.`
    );
  };

  const markVip = (customer: Customer) => {
    updateCustomer(
      customer.id,
      (currentCustomer) => ({ ...currentCustomer, status: 'VIP', stage: 'Loyal' }),
      `${customer.name} promoted to VIP coverage.`
    );
  };

  const assignSuccessOwner = (customer: Customer) => {
    updateCustomer(
      customer.id,
      (currentCustomer) => ({ ...currentCustomer, owner: 'Customer Success Pod' }),
      `${customer.name} assigned to the customer success pod.`
    );
  };

  return (
    <div className={`flex-1 p-6 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Customers CRM</h1>
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Track account health, customer value, and relationship ownership across your commerce base.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                showToast({
                  message: 'Customer export started for the current filtered segment.',
                  variant: 'info',
                })
              }
              className="bg-gray-700 text-white"
            >
              Export Segment
            </Button>
            <Button
              onClick={() =>
                showToast({
                  message: 'Customer health sync queued successfully.',
                  variant: 'success',
                })
              }
              className="bg-blue-600 text-white"
            >
              Sync Health Scores
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
                placeholder="Customer, company, ID, or email..."
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as CustomerStatus | 'all')}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All statuses</option>
                <option value="Active">Active</option>
                <option value="VIP">VIP</option>
                <option value="At Risk">At Risk</option>
                <option value="Dormant">Dormant</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Lifecycle</label>
              <select
                value={stageFilter}
                onChange={(event) => setStageFilter(event.target.value as LifecycleStage | 'all')}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All stages</option>
                <option value="New">New</option>
                <option value="Engaged">Engaged</option>
                <option value="Loyal">Loyal</option>
                <option value="Churn Risk">Churn Risk</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Channel</label>
              <select
                value={channelFilter}
                onChange={(event) => setChannelFilter(event.target.value as AcquisitionChannel | 'all')}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All channels</option>
                <option value="Organic">Organic</option>
                <option value="Paid Search">Paid Search</option>
                <option value="Referral">Referral</option>
                <option value="Marketplace">Marketplace</option>
              </select>
            </div>
          </div>
          <div className={`mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {filteredCustomers.length} customer{filteredCustomers.length === 1 ? '' : 's'} in the current segment.
          </div>
        </Card>

        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Customer</th>
                  <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                  <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Lifecycle</th>
                  <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Channel</th>
                  <th className={`px-3 py-2 text-right font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>LTV</th>
                  <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Owner</th>
                  <th className={`px-3 py-2 text-right font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className={`border-b transition-colors ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <td className="px-3 py-2 align-top">
                      <div className={`font-semibold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{customer.name}</div>
                      <div className={`mt-0.5 truncate max-w-[220px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{customer.company}</div>
                      <div className={`mt-0.5 whitespace-nowrap ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{customer.id} • {customer.region}</div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <Badge variant={getStatusVariant(customer.status)}>{customer.status}</Badge>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStageClasses(customer.stage)}`}>
                        {customer.stage}
                      </span>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getChannelClasses(customer.channel)}`}>
                        {customer.channel}
                      </span>
                    </td>
                    <td className={`px-3 py-2 align-top text-right font-semibold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${customer.lifetimeValue.toLocaleString()}
                      <div className={`mt-0.5 font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {customer.orders} orders
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className={`whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{customer.owner}</div>
                      <div className={`mt-0.5 whitespace-nowrap ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {customer.openTickets} open ticket{customer.openTickets === 1 ? '' : 's'}
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex justify-end gap-1.5">
                        <Button onClick={() => setSelectedCustomer(customer)} className="bg-gray-700 text-white text-xs px-2.5 py-1">
                          View
                        </Button>
                        {customer.status !== 'VIP' && (
                          <Button onClick={() => markVip(customer)} className="bg-purple-600 text-white text-xs px-2.5 py-1">
                            VIP
                          </Button>
                        )}
                        {customer.status !== 'At Risk' && (
                          <Button onClick={() => flagForFollowUp(customer)} className="bg-amber-600 text-white text-xs px-2.5 py-1">
                            Follow Up
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className={`px-4 py-10 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No customers match the current segment. Try clearing a filter to widen the view.
            </div>
          )}
        </Card>
      </div>

      <Modal
        isOpen={selectedCustomer !== null}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer ? `Customer ${selectedCustomer.id}` : 'Customer Details'}
        size="lg"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Account</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedCustomer.name}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedCustomer.email}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedCustomer.company}</p>
              </Card>
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Relationship</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedCustomer.owner}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedCustomer.region}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Last order {selectedCustomer.lastOrderAt}</p>
              </Card>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
                <div className="mt-2">
                  <Badge variant={getStatusVariant(selectedCustomer.status)}>{selectedCustomer.status}</Badge>
                </div>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Stage</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedCustomer.stage}</p>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>LTV</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${selectedCustomer.lifetimeValue.toLocaleString()}</p>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Orders</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedCustomer.orders}</p>
              </div>
            </div>

            <div className={`rounded-lg border p-4 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
              <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Relationship Notes</h3>
              <ul className={`mt-3 space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>Primary owner: {selectedCustomer.owner}</li>
                <li>Acquisition channel: {selectedCustomer.channel}</li>
                <li>Open tickets: {selectedCustomer.openTickets}</li>
                <li>Last order date: {selectedCustomer.lastOrderAt}</li>
              </ul>
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <Button onClick={() => setSelectedCustomer(null)} className="bg-gray-600 text-white">
                Close
              </Button>
              {selectedCustomer.owner !== 'Customer Success Pod' && (
                <Button onClick={() => assignSuccessOwner(selectedCustomer)} className="bg-blue-600 text-white">
                  Assign Success Pod
                </Button>
              )}
              {selectedCustomer.status !== 'VIP' && (
                <Button onClick={() => markVip(selectedCustomer)} className="bg-purple-600 text-white">
                  Mark VIP
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Customers;
