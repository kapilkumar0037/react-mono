import React, { useMemo, useState } from 'react';
import { Badge, Button, Card, Modal, useToast } from '@react-mono/ui-controls';
import { useSyncedSearchQuery } from './useSyncedSearchQuery';

type ReturnStatus =
  | 'Requested'
  | 'Approved'
  | 'In Transit'
  | 'Received'
  | 'Refunded'
  | 'Rejected';

type RefundMethod = 'Original Payment' | 'Store Credit' | 'Manual Review';
type ReturnPriority = 'High' | 'Medium' | 'Low';

interface ReturnCase {
  id: string;
  orderId: string;
  customer: string;
  email: string;
  reason: string;
  amount: number;
  items: number;
  requestedAt: string;
  status: ReturnStatus;
  refundMethod: RefundMethod;
  priority: ReturnPriority;
  courierStatus: 'Awaiting Pickup' | 'In Transit' | 'Delivered to Warehouse' | 'N/A';
}

interface ReturnsRefundsProps {
  isDarkMode?: boolean;
}

const initialCases: ReturnCase[] = [
  {
    id: 'RET-22041',
    orderId: 'ORD-10480',
    customer: 'Sophia Patel',
    email: 'sophia.patel@example.com',
    reason: 'Damaged on arrival',
    amount: 189.0,
    items: 2,
    requestedAt: '2026-03-28 10:22',
    status: 'Requested',
    refundMethod: 'Original Payment',
    priority: 'High',
    courierStatus: 'Awaiting Pickup',
  },
  {
    id: 'RET-22040',
    orderId: 'ORD-10477',
    customer: 'Ethan Walker',
    email: 'ethan.walker@example.com',
    reason: 'Ordered wrong size',
    amount: 98.75,
    items: 2,
    requestedAt: '2026-03-27 16:45',
    status: 'Approved',
    refundMethod: 'Store Credit',
    priority: 'Medium',
    courierStatus: 'In Transit',
  },
  {
    id: 'RET-22039',
    orderId: 'ORD-10472',
    customer: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    reason: 'Item not as described',
    amount: 54.2,
    items: 1,
    requestedAt: '2026-03-27 12:10',
    status: 'In Transit',
    refundMethod: 'Original Payment',
    priority: 'Medium',
    courierStatus: 'In Transit',
  },
  {
    id: 'RET-22038',
    orderId: 'ORD-10466',
    customer: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    reason: 'Gift return',
    amount: 142.3,
    items: 3,
    requestedAt: '2026-03-26 18:05',
    status: 'Received',
    refundMethod: 'Manual Review',
    priority: 'Low',
    courierStatus: 'Delivered to Warehouse',
  },
  {
    id: 'RET-22037',
    orderId: 'ORD-10458',
    customer: 'Noah Reed',
    email: 'noah.reed@example.com',
    reason: 'Product mismatch',
    amount: 76.45,
    items: 1,
    requestedAt: '2026-03-26 09:30',
    status: 'Refunded',
    refundMethod: 'Original Payment',
    priority: 'Low',
    courierStatus: 'Delivered to Warehouse',
  },
  {
    id: 'RET-22036',
    orderId: 'ORD-10449',
    customer: 'Mia Gonzalez',
    email: 'mia.gonzalez@example.com',
    reason: 'Return window expired',
    amount: 342.0,
    items: 4,
    requestedAt: '2026-03-25 14:50',
    status: 'Rejected',
    refundMethod: 'Manual Review',
    priority: 'High',
    courierStatus: 'N/A',
  },
];

const ReturnsRefunds: React.FC<ReturnsRefundsProps> = ({ isDarkMode = false }) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useSyncedSearchQuery();
  const [cases, setCases] = useState<ReturnCase[]>(initialCases);
  const [statusFilter, setStatusFilter] = useState<ReturnStatus | 'all'>('all');
  const [methodFilter, setMethodFilter] = useState<RefundMethod | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<ReturnPriority | 'all'>('all');
  const [selectedCase, setSelectedCase] = useState<ReturnCase | null>(null);

  const filteredCases = useMemo(() => {
    return cases.filter((returnCase) => {
      const matchesSearch =
        searchQuery === '' ||
        returnCase.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        returnCase.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        returnCase.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        returnCase.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || returnCase.status === statusFilter;
      const matchesMethod = methodFilter === 'all' || returnCase.refundMethod === methodFilter;
      const matchesPriority = priorityFilter === 'all' || returnCase.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesMethod && matchesPriority;
    });
  }, [cases, methodFilter, priorityFilter, searchQuery, statusFilter]);

  const stats = useMemo(
    () => [
      { label: 'Open Cases', value: cases.filter((item) => ['Requested', 'Approved', 'In Transit'].includes(item.status)).length.toString(), tone: 'border-blue-500' },
      { label: 'Warehouse Receipts', value: cases.filter((item) => item.status === 'Received').length.toString(), tone: 'border-indigo-500' },
      { label: 'Refunded', value: cases.filter((item) => item.status === 'Refunded').length.toString(), tone: 'border-green-500' },
      { label: 'Value at Risk', value: `$${cases.filter((item) => item.priority === 'High').reduce((sum, item) => sum + item.amount, 0).toFixed(2)}`, tone: 'border-amber-500' },
    ],
    [cases]
  );

  const getStatusVariant = (status: ReturnStatus) => {
    switch (status) {
      case 'Requested':
        return 'warning';
      case 'Approved':
        return 'info';
      case 'In Transit':
        return 'primary';
      case 'Received':
      case 'Refunded':
        return 'success';
      case 'Rejected':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getMethodClasses = (method: RefundMethod) => {
    switch (method) {
      case 'Original Payment':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
      case 'Store Credit':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
      case 'Manual Review':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getPriorityClasses = (priority: ReturnPriority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200';
      case 'Low':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const updateCaseStatus = (caseId: string, status: ReturnStatus, message: string) => {
    setCases((currentCases) =>
      currentCases.map((item) => (item.id === caseId ? { ...item, status } : item))
    );
    setSelectedCase((currentCase) =>
      currentCase && currentCase.id === caseId ? { ...currentCase, status } : currentCase
    );
    showToast({
      message,
      variant: 'success',
    });
  };

  return (
    <div className={`flex-1 p-4 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Returns & Refunds</h1>
            <p className={`mt-0.5 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-tight`}>
              Track return approvals, warehouse receipts, and refund outcomes from one operational queue.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                showToast({
                  message: 'Return export started for the current filtered view.',
                  variant: 'info',
                })
              }
              className="bg-gray-700 text-white"
            >
              Export Cases
            </Button>
            <Button
              onClick={() =>
                showToast({
                  message: 'Refund reconciliation sync queued successfully.',
                  variant: 'success',
                })
              }
              className="bg-blue-600 text-white"
            >
              Sync Refunds
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
                placeholder="Case ID, order ID, customer, or email..."
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as ReturnStatus | 'all')}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All statuses</option>
                <option value="Requested">Requested</option>
                <option value="Approved">Approved</option>
                <option value="In Transit">In Transit</option>
                <option value="Received">Received</option>
                <option value="Refunded">Refunded</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Refund Method</label>
              <select
                value={methodFilter}
                onChange={(event) => setMethodFilter(event.target.value as RefundMethod | 'all')}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All methods</option>
                <option value="Original Payment">Original Payment</option>
                <option value="Store Credit">Store Credit</option>
                <option value="Manual Review">Manual Review</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Priority</label>
              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value as ReturnPriority | 'all')}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
          <div className={`mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {filteredCases.length} return case{filteredCases.length === 1 ? '' : 's'} in the current view.
          </div>
        </Card>

        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Case</th>
                  <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Customer</th>
                  <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                  <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Refund Method</th>
                  <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Priority</th>
                  <th className={`px-3 py-2 text-right font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Amount</th>
                  <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Courier</th>
                  <th className={`px-3 py-2 text-right font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((returnCase) => (
                  <tr
                    key={returnCase.id}
                    className={`border-b transition-colors ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <td className="px-3 py-2 align-top">
                      <div className={`font-semibold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{returnCase.id}</div>
                      <div className={`mt-0.5 whitespace-nowrap ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {returnCase.orderId} • {returnCase.items} items
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className={`font-medium whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{returnCase.customer}</div>
                      <div className={`mt-0.5 truncate max-w-[180px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{returnCase.email}</div>
                      <div className={`mt-1 truncate max-w-[200px] ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{returnCase.reason}</div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <Badge variant={getStatusVariant(returnCase.status)}>{returnCase.status}</Badge>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getMethodClasses(returnCase.refundMethod)}`}>
                        {returnCase.refundMethod}
                      </span>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getPriorityClasses(returnCase.priority)}`}>
                        {returnCase.priority}
                      </span>
                    </td>
                    <td className={`px-3 py-2 text-right align-top font-semibold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${returnCase.amount.toFixed(2)}
                    </td>
                    <td className={`px-3 py-2 align-top whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{returnCase.courierStatus}</td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex justify-end gap-1.5">
                        <Button onClick={() => setSelectedCase(returnCase)} className="bg-gray-700 text-white text-xs px-2.5 py-1">
                          View
                        </Button>
                        {returnCase.status === 'Requested' && (
                          <Button
                            onClick={() => updateCaseStatus(returnCase.id, 'Approved', `${returnCase.id} approved for refund processing.`)}
                            className="bg-blue-600 text-white text-xs px-2.5 py-1"
                          >
                            Approve
                          </Button>
                        )}
                        {returnCase.status === 'Received' && (
                          <Button
                            onClick={() => updateCaseStatus(returnCase.id, 'Refunded', `${returnCase.id} moved to refunded.`)}
                            className="bg-green-600 text-white text-xs px-2.5 py-1"
                          >
                            Refund
                          </Button>
                        )}
                        {['Requested', 'Approved'].includes(returnCase.status) && (
                          <Button
                            onClick={() => updateCaseStatus(returnCase.id, 'Rejected', `${returnCase.id} was rejected and the customer notified.`)}
                            className="bg-red-600 text-white text-xs px-2.5 py-1"
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCases.length === 0 && (
            <div className={`px-4 py-10 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No return cases match the current filters. Try clearing a status or refund-method filter.
            </div>
          )}
        </Card>
      </div>

      <Modal
        isOpen={selectedCase !== null}
        onClose={() => setSelectedCase(null)}
        title={selectedCase ? `Return Case ${selectedCase.id}` : 'Return Case Details'}
        size="lg"
      >
        {selectedCase && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Customer</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedCase.customer}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedCase.email}</p>
              </Card>
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Reason</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedCase.reason}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Requested {selectedCase.requestedAt}</p>
              </Card>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
                <div className="mt-2">
                  <Badge variant={getStatusVariant(selectedCase.status)}>{selectedCase.status}</Badge>
                </div>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Refund Method</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedCase.refundMethod}</p>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Case Value</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${selectedCase.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Courier</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedCase.courierStatus}</p>
              </div>
            </div>

            <div className={`rounded-lg border p-4 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
              <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Operational Notes</h3>
              <ul className={`mt-3 space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>Source order: {selectedCase.orderId}</li>
                <li>Items involved: {selectedCase.items}</li>
                <li>Priority: {selectedCase.priority}</li>
                <li>Refund method: {selectedCase.refundMethod}</li>
              </ul>
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <Button onClick={() => setSelectedCase(null)} className="bg-gray-600 text-white">
                Close
              </Button>
              {selectedCase.status === 'Requested' && (
                <Button
                  onClick={() => updateCaseStatus(selectedCase.id, 'Approved', `${selectedCase.id} approved for refund processing.`)}
                  className="bg-blue-600 text-white"
                >
                  Approve Request
                </Button>
              )}
              {selectedCase.status === 'Received' && (
                <Button
                  onClick={() => updateCaseStatus(selectedCase.id, 'Refunded', `${selectedCase.id} moved to refunded.`)}
                  className="bg-green-600 text-white"
                >
                  Issue Refund
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReturnsRefunds;
