import React, { useMemo, useState } from 'react';
import { Badge, Button, Card, Modal, useToast } from '@react-mono/ui-controls';
import { useNavigate } from 'react-router-dom';
import { useSyncedSearchQuery } from './useSyncedSearchQuery';
import AdminActionConfirm from './AdminActionConfirm';
import AdminTableSortHeader from './AdminTableSortHeader';
import {
  AdminEmptyState,
  AdminFilterFooter,
  AdminMetricCards,
  AdminRelatedLinks,
} from './AdminPageSections';
import { useSortableData } from './useSortableData';

type SubscriptionStatus = 'Active' | 'Trial' | 'Past Due' | 'Cancelled';
type BillingPlan = 'Starter' | 'Growth' | 'Enterprise';
type PaymentHealth = 'Healthy' | 'Attention' | 'Failed';

interface SubscriptionAccount {
  id: string;
  accountName: string;
  owner: string;
  email: string;
  plan: BillingPlan;
  status: SubscriptionStatus;
  paymentHealth: PaymentHealth;
  monthlyRevenue: number;
  renewalDate: string;
  seats: number;
  invoicesDue: number;
  region: string;
}

interface BillingSubscriptionsProps {
  isDarkMode?: boolean;
}

const initialAccounts: SubscriptionAccount[] = [
  {
    id: 'SUB-6401',
    accountName: 'Northwind Studio',
    owner: 'Ava Thompson',
    email: 'ava.thompson@example.com',
    plan: 'Enterprise',
    status: 'Active',
    paymentHealth: 'Healthy',
    monthlyRevenue: 2499,
    renewalDate: '2026-04-20',
    seats: 48,
    invoicesDue: 0,
    region: 'North America',
  },
  {
    id: 'SUB-6400',
    accountName: 'Carter Commerce',
    owner: 'Liam Carter',
    email: 'liam.carter@example.com',
    plan: 'Growth',
    status: 'Trial',
    paymentHealth: 'Attention',
    monthlyRevenue: 499,
    renewalDate: '2026-04-08',
    seats: 14,
    invoicesDue: 1,
    region: 'Europe',
  },
  {
    id: 'SUB-6399',
    accountName: 'Patel Retail',
    owner: 'Sophia Patel',
    email: 'sophia.patel@example.com',
    plan: 'Growth',
    status: 'Past Due',
    paymentHealth: 'Failed',
    monthlyRevenue: 799,
    renewalDate: '2026-04-05',
    seats: 19,
    invoicesDue: 2,
    region: 'Asia Pacific',
  },
  {
    id: 'SUB-6398',
    accountName: 'Reed Supply Co.',
    owner: 'Noah Reed',
    email: 'noah.reed@example.com',
    plan: 'Starter',
    status: 'Cancelled',
    paymentHealth: 'Healthy',
    monthlyRevenue: 149,
    renewalDate: '2026-03-28',
    seats: 6,
    invoicesDue: 0,
    region: 'North America',
  },
  {
    id: 'SUB-6397',
    accountName: 'Nguyen Market',
    owner: 'Isabella Nguyen',
    email: 'isabella.nguyen@example.com',
    plan: 'Enterprise',
    status: 'Active',
    paymentHealth: 'Healthy',
    monthlyRevenue: 3199,
    renewalDate: '2026-04-18',
    seats: 62,
    invoicesDue: 0,
    region: 'Asia Pacific',
  },
  {
    id: 'SUB-6396',
    accountName: 'Gonzalez Home',
    owner: 'Mia Gonzalez',
    email: 'mia.gonzalez@example.com',
    plan: 'Growth',
    status: 'Active',
    paymentHealth: 'Attention',
    monthlyRevenue: 899,
    renewalDate: '2026-04-11',
    seats: 22,
    invoicesDue: 1,
    region: 'Latin America',
  },
];

const BillingSubscriptions: React.FC<BillingSubscriptionsProps> = ({ isDarkMode = false }) => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useSyncedSearchQuery();
  const [accounts, setAccounts] = useState<SubscriptionAccount[]>(initialAccounts);
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | 'all'>('all');
  const [planFilter, setPlanFilter] = useState<BillingPlan | 'all'>('all');
  const [paymentFilter, setPaymentFilter] = useState<PaymentHealth | 'all'>('all');
  const [selectedAccount, setSelectedAccount] = useState<SubscriptionAccount | null>(null);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [pendingAction, setPendingAction] = useState<{
    title: string;
    message: string;
    confirmLabel: string;
    confirmClassName: string;
    run: () => void;
  } | null>(null);

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        query === '' ||
        account.id.toLowerCase().includes(query) ||
        account.accountName.toLowerCase().includes(query) ||
        account.owner.toLowerCase().includes(query) ||
        account.email.toLowerCase().includes(query) ||
        account.region.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
      const matchesPlan = planFilter === 'all' || account.plan === planFilter;
      const matchesPayment = paymentFilter === 'all' || account.paymentHealth === paymentFilter;

      return matchesSearch && matchesStatus && matchesPlan && matchesPayment;
    });
  }, [accounts, paymentFilter, planFilter, searchQuery, statusFilter]);

  const { items: sortedAccounts, requestSort, sortConfig } = useSortableData(filteredAccounts, {
    key: 'monthlyRevenue',
    direction: 'desc',
  });

  const stats = useMemo(
    () => [
      { label: 'Active MRR', value: `$${accounts.filter((account) => account.status === 'Active').reduce((sum, account) => sum + account.monthlyRevenue, 0).toLocaleString()}`, tone: 'border-green-500' },
      { label: 'Trials Ending', value: accounts.filter((account) => account.status === 'Trial').length.toString(), tone: 'border-blue-500' },
      { label: 'Past Due', value: accounts.filter((account) => account.status === 'Past Due').length.toString(), tone: 'border-red-500' },
      { label: 'Invoices Due', value: accounts.reduce((sum, account) => sum + account.invoicesDue, 0).toString(), tone: 'border-amber-500' },
    ],
    [accounts]
  );

  const activeFilterCount =
    (searchQuery !== '' ? 1 : 0) +
    (statusFilter !== 'all' ? 1 : 0) +
    (planFilter !== 'all' ? 1 : 0) +
    (paymentFilter !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPlanFilter('all');
    setPaymentFilter('all');
  };

  const toggleAccountSelection = (accountId: string) => {
    setSelectedAccountIds((currentIds) =>
      currentIds.includes(accountId)
        ? currentIds.filter((id) => id !== accountId)
        : [...currentIds, accountId]
    );
  };

  const toggleSelectAllFiltered = () => {
    const filteredIds = sortedAccounts.map((account) => account.id);
    setSelectedAccountIds((currentIds) =>
      filteredIds.every((id) => currentIds.includes(id))
        ? currentIds.filter((id) => !filteredIds.includes(id))
        : Array.from(new Set([...currentIds, ...filteredIds]))
    );
  };

  const selectedAccounts = accounts.filter((account) => selectedAccountIds.includes(account.id));
  const allFilteredSelected =
    sortedAccounts.length > 0 && sortedAccounts.every((account) => selectedAccountIds.includes(account.id));

  const getStatusVariant = (status: SubscriptionStatus) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Trial':
        return 'info';
      case 'Past Due':
        return 'danger';
      case 'Cancelled':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getPlanClasses = (plan: BillingPlan) => {
    switch (plan) {
      case 'Starter':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
      case 'Growth':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
      case 'Enterprise':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getPaymentClasses = (paymentHealth: PaymentHealth) => {
    switch (paymentHealth) {
      case 'Healthy':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
      case 'Attention':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200';
      case 'Failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const updateAccount = (
    accountId: string,
    updater: (account: SubscriptionAccount) => SubscriptionAccount,
    message: string
  ) => {
    setAccounts((currentAccounts) =>
      currentAccounts.map((account) => (account.id === accountId ? updater(account) : account))
    );
    setSelectedAccount((currentAccount) =>
      currentAccount && currentAccount.id === accountId ? updater(currentAccount) : currentAccount
    );
    showToast({
      message,
      variant: 'success',
    });
  };

  const retryPayment = (account: SubscriptionAccount) => {
    updateAccount(
      account.id,
      (currentAccount) => ({
        ...currentAccount,
        paymentHealth: 'Healthy',
        status: currentAccount.status === 'Past Due' ? 'Active' : currentAccount.status,
        invoicesDue: 0,
      }),
      `${account.accountName} payment retry succeeded and billing is back in good standing.`
    );
  };

  const upgradePlan = (account: SubscriptionAccount) => {
    updateAccount(
      account.id,
      (currentAccount) => ({
        ...currentAccount,
        plan: currentAccount.plan === 'Starter' ? 'Growth' : 'Enterprise',
        monthlyRevenue: currentAccount.plan === 'Starter' ? 499 : currentAccount.monthlyRevenue + 900,
      }),
      `${account.accountName} upgraded successfully.`
    );
  };

  const extendTrial = (account: SubscriptionAccount) => {
    updateAccount(
      account.id,
      (currentAccount) => ({
        ...currentAccount,
        renewalDate: '2026-04-15',
        paymentHealth: 'Healthy',
      }),
      `${account.accountName} trial extended through April 15, 2026.`
    );
  };

  const requestRetryPayment = (account: SubscriptionAccount) => {
    setPendingAction({
      title: 'Retry Payment',
      message: `Retry payment collection for ${account.accountName}? This will attempt to recover ${account.invoicesDue} due invoice${account.invoicesDue === 1 ? '' : 's'}.`,
      confirmLabel: 'Retry Payment',
      confirmClassName: 'bg-red-600 text-white',
      run: () => retryPayment(account),
    });
  };

  const requestUpgradePlan = (account: SubscriptionAccount) => {
    const nextPlan = account.plan === 'Starter' ? 'Growth' : 'Enterprise';
    setPendingAction({
      title: 'Upgrade Subscription',
      message: `Upgrade ${account.accountName} from ${account.plan} to ${nextPlan}? This will update the mock monthly revenue and plan state immediately.`,
      confirmLabel: 'Upgrade Plan',
      confirmClassName: 'bg-purple-600 text-white',
      run: () => upgradePlan(account),
    });
  };

  const requestExtendTrial = (account: SubscriptionAccount) => {
    setPendingAction({
      title: 'Extend Trial',
      message: `Extend the trial for ${account.accountName} through April 15, 2026?`,
      confirmLabel: 'Extend Trial',
      confirmClassName: 'bg-blue-600 text-white',
      run: () => extendTrial(account),
    });
  };

  const retryPaymentBulk = () => {
    setAccounts((currentAccounts) =>
      currentAccounts.map((account) =>
        selectedAccountIds.includes(account.id)
          ? {
              ...account,
              paymentHealth: 'Healthy',
              status: account.status === 'Past Due' ? 'Active' : account.status,
              invoicesDue: 0,
            }
          : account
      )
    );
    setSelectedAccountIds([]);
    showToast({
      message: `${selectedAccounts.length} subscription${selectedAccounts.length === 1 ? '' : 's'} updated after payment retry.`,
      variant: 'success',
    });
  };

  const extendTrialBulk = () => {
    setAccounts((currentAccounts) =>
      currentAccounts.map((account) =>
        selectedAccountIds.includes(account.id)
          ? {
              ...account,
              renewalDate: '2026-04-15',
              paymentHealth: 'Healthy',
            }
          : account
      )
    );
    setSelectedAccountIds([]);
    showToast({
      message: `${selectedAccounts.length} trial subscription${selectedAccounts.length === 1 ? '' : 's'} extended.`,
      variant: 'success',
    });
  };

  const upgradePlanBulk = () => {
    setAccounts((currentAccounts) =>
      currentAccounts.map((account) =>
        selectedAccountIds.includes(account.id)
          ? {
              ...account,
              plan: account.plan === 'Starter' ? 'Growth' : 'Enterprise',
              monthlyRevenue: account.plan === 'Starter' ? 499 : account.monthlyRevenue + 900,
            }
          : account
      )
    );
    setSelectedAccountIds([]);
    showToast({
      message: `${selectedAccounts.length} subscription${selectedAccounts.length === 1 ? '' : 's'} upgraded.`,
      variant: 'success',
    });
  };

  return (
    <div className={`flex-1 p-4 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Billing & Subscriptions</h1>
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage recurring revenue, subscription health, invoice risk, and account upgrades in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                showToast({
                  message: 'Billing export started for the current filtered view.',
                  variant: 'info',
                })
              }
              className="bg-gray-700 text-white"
            >
              Export Billing
            </Button>
            <Button
              onClick={() =>
                showToast({
                  message: 'Invoice sync queued successfully.',
                  variant: 'success',
                })
              }
              className="bg-blue-600 text-white"
            >
              Sync Invoices
            </Button>
          </div>
        </div>

        <AdminMetricCards isDarkMode={isDarkMode} items={stats} />

        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            <div className="xl:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Account, owner, email, or subscription ID..."
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as SubscriptionStatus | 'all')}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All statuses</option>
                <option value="Active">Active</option>
                <option value="Trial">Trial</option>
                <option value="Past Due">Past Due</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Plan</label>
              <select
                value={planFilter}
                onChange={(event) => setPlanFilter(event.target.value as BillingPlan | 'all')}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All plans</option>
                <option value="Starter">Starter</option>
                <option value="Growth">Growth</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Payment</label>
              <select
                value={paymentFilter}
                onChange={(event) => setPaymentFilter(event.target.value as PaymentHealth | 'all')}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All payment states</option>
                <option value="Healthy">Healthy</option>
                <option value="Attention">Attention</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>
          <AdminFilterFooter
            isDarkMode={isDarkMode}
            resultLabel="subscription"
            resultCount={sortedAccounts.length}
            activeFilterCount={activeFilterCount}
            onClearFilters={clearFilters}
          />
        </Card>

        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          {selectedAccountIds.length > 0 && (
            <div className={`border-b px-4 py-3 ${isDarkMode ? 'border-gray-700 bg-gray-900/40' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {selectedAccountIds.length} subscription{selectedAccountIds.length === 1 ? '' : 's'} selected
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => setSelectedAccountIds([])} className="bg-gray-600 text-white text-xs px-3 py-1.5">
                    Clear
                  </Button>
                  <Button
                    onClick={() =>
                      setPendingAction({
                        title: 'Retry Payments',
                        message: `Retry payment collection for ${selectedAccounts.length} selected subscription${selectedAccounts.length === 1 ? '' : 's'}?`,
                        confirmLabel: 'Retry Payments',
                        confirmClassName: 'bg-red-600 text-white',
                        run: retryPaymentBulk,
                      })
                    }
                    className="bg-red-600 text-white text-xs px-3 py-1.5"
                  >
                    Retry Payments
                  </Button>
                  <Button
                    onClick={() =>
                      setPendingAction({
                        title: 'Extend Trials',
                        message: `Extend trial terms for ${selectedAccounts.length} selected subscription${selectedAccounts.length === 1 ? '' : 's'}?`,
                        confirmLabel: 'Extend Trials',
                        confirmClassName: 'bg-blue-600 text-white',
                        run: extendTrialBulk,
                      })
                    }
                    className="bg-blue-600 text-white text-xs px-3 py-1.5"
                  >
                    Extend Trials
                  </Button>
                  <Button
                    onClick={() =>
                      setPendingAction({
                        title: 'Upgrade Plans',
                        message: `Upgrade ${selectedAccounts.length} selected subscription${selectedAccounts.length === 1 ? '' : 's'} to the next plan tier?`,
                        confirmLabel: 'Upgrade Plans',
                        confirmClassName: 'bg-purple-600 text-white',
                        run: upgradePlanBulk,
                      })
                    }
                    className="bg-purple-600 text-white text-xs px-3 py-1.5"
                  >
                    Upgrade Plans
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className="px-3 py-2 text-left">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleSelectAllFiltered}
                      className="h-4 w-4 rounded"
                      aria-label="Select all filtered subscriptions"
                    />
                  </th>
                  <th className="px-3 py-2 text-left">
                    <AdminTableSortHeader
                      label="Account"
                      isActive={sortConfig?.key === 'accountName'}
                      direction={sortConfig?.direction}
                      isDarkMode={isDarkMode}
                      onClick={() => requestSort('accountName')}
                    />
                  </th>
                  <th className="px-3 py-2 text-left">
                    <AdminTableSortHeader
                      label="Status"
                      isActive={sortConfig?.key === 'status'}
                      direction={sortConfig?.direction}
                      isDarkMode={isDarkMode}
                      onClick={() => requestSort('status')}
                    />
                  </th>
                  <th className="px-3 py-2 text-left">
                    <AdminTableSortHeader
                      label="Plan"
                      isActive={sortConfig?.key === 'plan'}
                      direction={sortConfig?.direction}
                      isDarkMode={isDarkMode}
                      onClick={() => requestSort('plan')}
                    />
                  </th>
                  <th className="px-3 py-2 text-left">
                    <AdminTableSortHeader
                      label="Payment"
                      isActive={sortConfig?.key === 'paymentHealth'}
                      direction={sortConfig?.direction}
                      isDarkMode={isDarkMode}
                      onClick={() => requestSort('paymentHealth')}
                    />
                  </th>
                  <th className="px-3 py-2 text-right">
                    <AdminTableSortHeader
                      label="MRR"
                      isActive={sortConfig?.key === 'monthlyRevenue'}
                      direction={sortConfig?.direction}
                      align="right"
                      isDarkMode={isDarkMode}
                      onClick={() => requestSort('monthlyRevenue')}
                    />
                  </th>
                  <th className="px-3 py-2 text-left">
                    <AdminTableSortHeader
                      label="Renewal"
                      isActive={sortConfig?.key === 'renewalDate'}
                      direction={sortConfig?.direction}
                      isDarkMode={isDarkMode}
                      onClick={() => requestSort('renewalDate')}
                    />
                  </th>
                  <th className={`px-3 py-2 text-right font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedAccounts.map((account) => (
                  <tr
                    key={account.id}
                    onClick={() => setSelectedAccount(account)}
                    className={`cursor-pointer border-b transition-colors ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <td className="px-3 py-2 align-top">
                      <input
                        type="checkbox"
                        checked={selectedAccountIds.includes(account.id)}
                        onChange={(event) => {
                          event.stopPropagation();
                          toggleAccountSelection(account.id);
                        }}
                        className="h-4 w-4 rounded"
                        aria-label={`Select ${account.accountName}`}
                      />
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className={`font-semibold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{account.accountName}</div>
                      <div className={`mt-0.5 truncate max-w-[220px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{account.owner} • {account.email}</div>
                      <div className={`mt-0.5 whitespace-nowrap ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{account.id} • {account.region}</div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <Badge variant={getStatusVariant(account.status)}>{account.status}</Badge>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getPlanClasses(account.plan)}`}>
                        {account.plan}
                      </span>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getPaymentClasses(account.paymentHealth)}`}>
                        {account.paymentHealth}
                      </span>
                    </td>
                    <td className={`px-3 py-2 align-top text-right font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${account.monthlyRevenue.toLocaleString()}
                      <div className={`mt-0.5 font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {account.seats} seats
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{account.renewalDate}</div>
                      <div className={`mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {account.invoicesDue} invoice{account.invoicesDue === 1 ? '' : 's'} due
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex justify-end gap-1.5">
                        <Button onClick={(event) => { event.stopPropagation(); setSelectedAccount(account); }} className="bg-gray-700 text-white text-xs px-2.5 py-1">
                          View
                        </Button>
                        {account.paymentHealth === 'Failed' && (
                          <Button onClick={(event) => { event.stopPropagation(); requestRetryPayment(account); }} className="bg-red-600 text-white text-xs px-2.5 py-1">
                            Retry
                          </Button>
                        )}
                        {account.status === 'Trial' && (
                          <Button onClick={(event) => { event.stopPropagation(); requestExtendTrial(account); }} className="bg-blue-600 text-white text-xs px-2.5 py-1">
                            Extend
                          </Button>
                        )}
                        {account.plan !== 'Enterprise' && (
                          <Button onClick={(event) => { event.stopPropagation(); requestUpgradePlan(account); }} className="bg-purple-600 text-white text-xs px-2.5 py-1">
                            Upgrade
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedAccounts.length === 0 && (
            <AdminEmptyState
              isDarkMode={isDarkMode}
              message="No subscriptions match the current filters. Try widening the plan or payment filters."
            />
          )}
        </Card>
      </div>

      <Modal
        isOpen={selectedAccount !== null}
        onClose={() => setSelectedAccount(null)}
        title={selectedAccount ? `Subscription ${selectedAccount.id}` : 'Subscription Details'}
        size="lg"
      >
        {selectedAccount && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Account</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedAccount.accountName}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedAccount.owner}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedAccount.email}</p>
              </Card>
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Billing</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedAccount.plan}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Renews {selectedAccount.renewalDate}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedAccount.region}</p>
              </Card>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
                <div className="mt-2">
                  <Badge variant={getStatusVariant(selectedAccount.status)}>{selectedAccount.status}</Badge>
                </div>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Payment</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedAccount.paymentHealth}</p>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>MRR</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${selectedAccount.monthlyRevenue.toLocaleString()}</p>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Seats</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedAccount.seats}</p>
              </div>
            </div>

            <div className={`rounded-lg border p-4 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
              <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Billing Notes</h3>
              <ul className={`mt-3 space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>Subscription ID: {selectedAccount.id}</li>
                <li>Current plan: {selectedAccount.plan}</li>
                <li>Invoices due: {selectedAccount.invoicesDue}</li>
                <li>Renewal date: {selectedAccount.renewalDate}</li>
              </ul>
            </div>

            <AdminRelatedLinks
              isDarkMode={isDarkMode}
              links={[
                { label: 'Open Customers', onClick: () => navigate('/customers?q=' + encodeURIComponent(selectedAccount.accountName)) },
                { label: 'Open Orders', onClick: () => navigate('/orders?q=' + encodeURIComponent(selectedAccount.owner)) },
                { label: 'Open Integrations', onClick: () => navigate('/integrations?q=' + encodeURIComponent(selectedAccount.accountName)) },
              ]}
            />

            <div className="flex flex-wrap justify-end gap-2">
              <Button onClick={() => setSelectedAccount(null)} className="bg-gray-600 text-white">
                Close
              </Button>
              {selectedAccount.status === 'Trial' && (
                <Button onClick={() => requestExtendTrial(selectedAccount)} className="bg-blue-600 text-white">
                  Extend Trial
                </Button>
              )}
              {selectedAccount.paymentHealth === 'Failed' && (
                <Button onClick={() => requestRetryPayment(selectedAccount)} className="bg-red-600 text-white">
                  Retry Payment
                </Button>
              )}
              {selectedAccount.plan !== 'Enterprise' && (
                <Button onClick={() => requestUpgradePlan(selectedAccount)} className="bg-purple-600 text-white">
                  Upgrade Plan
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <AdminActionConfirm
        isOpen={pendingAction !== null}
        title={pendingAction?.title ?? 'Confirm Action'}
        message={pendingAction?.message ?? ''}
        confirmLabel={pendingAction?.confirmLabel ?? 'Confirm'}
        confirmClassName={pendingAction?.confirmClassName}
        isDarkMode={isDarkMode}
        onCancel={() => setPendingAction(null)}
        onConfirm={() => {
          pendingAction?.run();
          setPendingAction(null);
        }}
      />
    </div>
  );
};

export default BillingSubscriptions;
