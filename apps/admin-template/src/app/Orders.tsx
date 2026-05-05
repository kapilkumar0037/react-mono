import React, { useMemo, useState } from 'react';
import { Badge, Button, Card, Modal } from '@react-mono/ui-controls';
import { useSyncedSearchQuery } from './useSyncedSearchQuery';
import AdminActionConfirm from './AdminActionConfirm';
import { useGlobalToast } from './hooks/useGlobalToast';
import { useExportAction } from './hooks/useActionFeedback';
import { EmptyState } from './components/EmptyState';

type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';
type FulfillmentPriority = 'High' | 'Medium' | 'Low';

interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  items: number;
  createdAt: string;
  deliveryEta: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  priority: FulfillmentPriority;
  channel: 'Website' | 'Marketplace' | 'Mobile App';
  shippingMethod: 'Express' | 'Standard' | 'Pickup';
}

interface OrdersProps {
  isDarkMode?: boolean;
}

const initialOrders: Order[] = [
  { id: 'ORD-10482', customer: 'Ava Thompson', email: 'ava.thompson@example.com', total: 248.5, items: 3, createdAt: '2026-03-25 09:12', deliveryEta: '2026-03-27', status: 'Pending', paymentStatus: 'Paid', priority: 'High', channel: 'Website', shippingMethod: 'Express' },
  { id: 'ORD-10481', customer: 'Liam Carter', email: 'liam.carter@example.com', total: 129.99, items: 1, createdAt: '2026-03-25 08:40', deliveryEta: '2026-03-29', status: 'Processing', paymentStatus: 'Paid', priority: 'Medium', channel: 'Mobile App', shippingMethod: 'Standard' },
  { id: 'ORD-10480', customer: 'Sophia Patel', email: 'sophia.patel@example.com', total: 589.2, items: 6, createdAt: '2026-03-24 18:10', deliveryEta: '2026-03-26', status: 'Shipped', paymentStatus: 'Paid', priority: 'High', channel: 'Marketplace', shippingMethod: 'Express' },
  { id: 'ORD-10479', customer: 'Noah Reed', email: 'noah.reed@example.com', total: 76.45, items: 2, createdAt: '2026-03-24 14:22', deliveryEta: '2026-03-30', status: 'Delivered', paymentStatus: 'Paid', priority: 'Low', channel: 'Website', shippingMethod: 'Standard' },
  { id: 'ORD-10478', customer: 'Mia Gonzalez', email: 'mia.gonzalez@example.com', total: 342.0, items: 4, createdAt: '2026-03-24 11:05', deliveryEta: '2026-03-28', status: 'Cancelled', paymentStatus: 'Refunded', priority: 'Medium', channel: 'Website', shippingMethod: 'Express' },
  { id: 'ORD-10477', customer: 'Ethan Walker', email: 'ethan.walker@example.com', total: 98.75, items: 2, createdAt: '2026-03-23 17:50', deliveryEta: '2026-03-28', status: 'Refunded', paymentStatus: 'Refunded', priority: 'Low', channel: 'Mobile App', shippingMethod: 'Pickup' },
  { id: 'ORD-10476', customer: 'Isabella Nguyen', email: 'isabella.nguyen@example.com', total: 415.35, items: 5, createdAt: '2026-03-23 12:15', deliveryEta: '2026-03-26', status: 'Processing', paymentStatus: 'Pending', priority: 'High', channel: 'Marketplace', shippingMethod: 'Express' },
  { id: 'ORD-10475', customer: 'James Brooks', email: 'james.brooks@example.com', total: 211.1, items: 3, createdAt: '2026-03-22 20:08', deliveryEta: '2026-03-27', status: 'Pending', paymentStatus: 'Failed', priority: 'High', channel: 'Website', shippingMethod: 'Standard' },
];

const Orders: React.FC<OrdersProps> = ({ isDarkMode = false }) => {
  const { addToast } = useGlobalToast();
  const exportAction = useExportAction('Orders');
  const [searchQuery, setSearchQuery] = useSyncedSearchQuery();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<FulfillmentPriority | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [pendingAction, setPendingAction] = useState<{ title: string; message: string; confirmLabel: string; confirmClassName: string; run: () => void } | null>(null);

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch = searchQuery === '' || order.id.toLowerCase().includes(q) || order.customer.toLowerCase().includes(q) || order.email.toLowerCase().includes(q);
        return matchesSearch && (statusFilter === 'all' || order.status === statusFilter) && (paymentFilter === 'all' || order.paymentStatus === paymentFilter) && (priorityFilter === 'all' || order.priority === priorityFilter);
      }),
    [orders, paymentFilter, priorityFilter, searchQuery, statusFilter]
  );

  const orderStats = useMemo(
    () => [
      { label: 'Open Orders', value: orders.filter((order) => ['Pending', 'Processing'].includes(order.status)).length.toString(), tone: 'border-blue-500' },
      { label: 'Ready to Ship', value: orders.filter((order) => order.status === 'Shipped').length.toString(), tone: 'border-indigo-500' },
      { label: 'At Risk', value: orders.filter((order) => order.paymentStatus === 'Failed' || order.priority === 'High').length.toString(), tone: 'border-amber-500' },
      { label: 'Revenue in View', value: `$${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}`, tone: 'border-green-500' },
    ],
    [orders]
  );

  const selectedOrders = orders.filter((order) => selectedOrderIds.includes(order.id));
  const allFilteredSelected = filteredOrders.length > 0 && filteredOrders.every((order) => selectedOrderIds.includes(order.id));

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Processing':
        return 'primary';
      case 'Shipped':
        return 'info';
      case 'Delivered':
        return 'success';
      case 'Cancelled':
      case 'Refunded':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getPaymentClasses = (paymentStatus: PaymentStatus) => {
    switch (paymentStatus) {
      case 'Paid':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getPriorityClasses = (priority: FulfillmentPriority) => {
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

  const updateOrderStatus = (orderId: string, status: OrderStatus, message: string) => {
    setOrders((currentOrders) => currentOrders.map((order) => (order.id === orderId ? { ...order, status } : order)));
    setSelectedOrder((currentOrder) => (currentOrder && currentOrder.id === orderId ? { ...currentOrder, status } : currentOrder));
    addToast({ type: 'success', message });
  };

  const runBulkStatusUpdate = (nextStatus: OrderStatus, eligibleStatuses: OrderStatus[], message: (count: number) => string) => {
    const eligibleIds = selectedOrders.filter((order) => eligibleStatuses.includes(order.status)).map((order) => order.id);
    if (eligibleIds.length === 0) {
      addToast({ type: 'warning', message: 'The selected orders are already in a final state for that action.' });
      return;
    }
    setOrders((currentOrders) => currentOrders.map((order) => (eligibleIds.includes(order.id) ? { ...order, status: nextStatus } : order)));
    setSelectedOrder((currentOrder) => (currentOrder && eligibleIds.includes(currentOrder.id) ? { ...currentOrder, status: nextStatus } : currentOrder));
    setSelectedOrderIds([]);
    addToast({ type: 'success', message: message(eligibleIds.length) });
  };

  const toggleOrderSelection = (orderId: string) => setSelectedOrderIds((ids) => (ids.includes(orderId) ? ids.filter((id) => id !== orderId) : [...ids, orderId]));
  const toggleSelectAllFiltered = () => {
    const filteredIds = filteredOrders.map((order) => order.id);
    setSelectedOrderIds((ids) => (filteredIds.every((id) => ids.includes(id)) ? ids.filter((id) => !filteredIds.includes(id)) : Array.from(new Set([...ids, ...filteredIds]))));
  };
  const exportSelectedOrders = async () => {
    if (selectedOrders.length === 0) return;
    await exportAction.execute(
      () => new Promise(resolve => setTimeout(resolve, 800)),
      {
        successMessage: `Export package prepared for ${selectedOrders.length} selected order${selectedOrders.length === 1 ? '' : 's'}`,
      }
    );
  };

  return (
    <div className={`flex-1 overflow-y-auto p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Orders Management</h1>
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Review fulfillment, payment health, and shipping progress across all active orders.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => addToast({ type: 'info', message: 'Order export has started for the current filtered view.' })} className="bg-gray-700 text-white">Export Orders</Button>
            <Button onClick={() => addToast({ type: 'success', message: 'Manual fulfillment sync queued successfully.' })} className="bg-blue-600 text-white">Sync Fulfillment</Button>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {orderStats.map((stat) => (
            <div key={stat.label} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg border-l-4 ${stat.tone} p-3 shadow`}>
              <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs font-medium`}>{stat.label}</div>
              <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div className="xl:col-span-2">
              <label className={`mb-2 block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Search</label>
              <input type="text" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Order ID, customer, or email..." className={`w-full rounded border px-3 py-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`} />
            </div>
            <div>
              <label className={`mb-2 block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Order Status</label>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as OrderStatus | 'all')} className={`w-full rounded border px-3 py-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                <option value="all">All statuses</option><option value="Pending">Pending</option><option value="Processing">Processing</option><option value="Shipped">Shipped</option><option value="Delivered">Delivered</option><option value="Cancelled">Cancelled</option><option value="Refunded">Refunded</option>
              </select>
            </div>
            <div>
              <label className={`mb-2 block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Payment</label>
              <select value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value as PaymentStatus | 'all')} className={`w-full rounded border px-3 py-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                <option value="all">All payments</option><option value="Paid">Paid</option><option value="Pending">Pending</option><option value="Failed">Failed</option><option value="Refunded">Refunded</option>
              </select>
            </div>
            <div>
              <label className={`mb-2 block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Priority</label>
              <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value as FulfillmentPriority | 'all')} className={`w-full rounded border px-3 py-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                <option value="all">All priorities</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
              </select>
            </div>
          </div>
          <div className={`mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Showing {filteredOrders.length} order{filteredOrders.length === 1 ? '' : 's'} in the current view.</div>
        </Card>

        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          {selectedOrderIds.length > 0 && (
            <div className={`border-b px-4 py-3 ${isDarkMode ? 'border-gray-700 bg-gray-900/40' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{selectedOrderIds.length} order{selectedOrderIds.length === 1 ? '' : 's'} selected</div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => setSelectedOrderIds([])} className="bg-gray-600 px-3 py-1.5 text-xs text-white">Clear</Button>
                  <Button onClick={exportSelectedOrders} className="bg-gray-700 px-3 py-1.5 text-xs text-white">Export</Button>
                  <Button onClick={() => setPendingAction({ title: 'Move Orders to Processing', message: 'Move the selected orders into processing?', confirmLabel: 'Move to Processing', confirmClassName: 'bg-blue-600 text-white', run: () => runBulkStatusUpdate('Processing', ['Pending'], (count) => `${count} order${count === 1 ? '' : 's'} moved into processing.`) })} className="bg-blue-600 px-3 py-1.5 text-xs text-white">Process</Button>
                  <Button onClick={() => setPendingAction({ title: 'Mark Orders as Shipped', message: 'Mark the selected orders as shipped?', confirmLabel: 'Mark Shipped', confirmClassName: 'bg-indigo-600 text-white', run: () => runBulkStatusUpdate('Shipped', ['Processing'], (count) => `${count} order${count === 1 ? '' : 's'} marked as shipped.`) })} className="bg-indigo-600 px-3 py-1.5 text-xs text-white">Ship</Button>
                  <Button onClick={() => setPendingAction({ title: 'Cancel Orders', message: 'Cancel the selected orders and remove them from the active fulfillment queue?', confirmLabel: 'Cancel Orders', confirmClassName: 'bg-red-600 text-white', run: () => runBulkStatusUpdate('Cancelled', ['Pending', 'Processing', 'Shipped'], (count) => `${count} order${count === 1 ? '' : 's'} cancelled.`) })} className="bg-red-600 px-3 py-1.5 text-xs text-white">Cancel</Button>
                </div>
              </div>
            </div>
          )}
          {filteredOrders.length === 0 ? (
            <EmptyState
              icon="📦"
              title="No orders found"
              description="Try adjusting your search or filters to view orders"
              isDarkMode={isDarkMode}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className="px-4 py-3 text-left"><input type="checkbox" checked={allFilteredSelected} onChange={toggleSelectAllFiltered} className="h-4 w-4 rounded" aria-label="Select all filtered orders" /></th>
                    <th className={`px-4 py-3 text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Order</th>
                    <th className={`px-4 py-3 text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Customer</th>
                    <th className={`px-4 py-3 text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                    <th className={`px-4 py-3 text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Payment</th>
                    <th className={`px-4 py-3 text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Priority</th>
                    <th className={`px-4 py-3 text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total</th>
                    <th className={`px-4 py-3 text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>ETA</th>
                    <th className={`px-4 py-3 text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className={`border-b transition-colors ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <td className="px-4 py-4 align-top"><input type="checkbox" checked={selectedOrderIds.includes(order.id)} onChange={() => toggleOrderSelection(order.id)} className="h-4 w-4 rounded" aria-label={`Select ${order.id}`} /></td>
                      <td className="px-4 py-4"><div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{order.id}</div><div className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{order.channel} | {order.items} items</div></td>
                      <td className="px-4 py-4"><div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{order.customer}</div><div className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{order.email}</div></td>
                      <td className="px-4 py-4"><Badge variant={getStatusBadge(order.status)}>{order.status}</Badge></td>
                      <td className="px-4 py-4"><span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getPaymentClasses(order.paymentStatus)}`}>{order.paymentStatus}</span></td>
                      <td className="px-4 py-4"><span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getPriorityClasses(order.priority)}`}>{order.priority}</span></td>
                      <td className={`px-4 py-4 text-right font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${order.total.toFixed(2)}</td>
                      <td className={`px-4 py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{order.deliveryEta}</td>
                      <td className="px-4 py-4"><div className="flex justify-end gap-2"><Button onClick={() => setSelectedOrder(order)} className="bg-gray-700 px-3 py-1 text-xs text-white">View</Button>{order.status === 'Pending' && <Button onClick={() => updateOrderStatus(order.id, 'Processing', `${order.id} moved into processing.`)} className="bg-blue-600 px-3 py-1 text-xs text-white">Process</Button>}{order.status === 'Processing' && <Button onClick={() => updateOrderStatus(order.id, 'Shipped', `${order.id} marked as shipped.`)} className="bg-indigo-600 px-3 py-1 text-xs text-white">Ship</Button>}{!['Cancelled', 'Refunded', 'Delivered'].includes(order.status) && <Button onClick={() => updateOrderStatus(order.id, 'Cancelled', `${order.id} was cancelled and removed from fulfillment.`)} className="bg-red-600 px-3 py-1 text-xs text-white">Cancel</Button>}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <Modal isOpen={selectedOrder !== null} onClose={() => setSelectedOrder(null)} title={selectedOrder ? `Order ${selectedOrder.id}` : 'Order Details'} size="lg">
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}><p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Customer</p><p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedOrder.customer}</p><p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedOrder.email}</p></Card>
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}><p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Fulfillment</p><p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedOrder.shippingMethod}</p><p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>ETA {selectedOrder.deliveryEta}</p></Card>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div><p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</p><div className="mt-2"><Badge variant={getStatusBadge(selectedOrder.status)}>{selectedOrder.status}</Badge></div></div>
              <div><p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Payment</p><p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedOrder.paymentStatus}</p></div>
              <div><p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Order Total</p><p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${selectedOrder.total.toFixed(2)}</p></div>
              <div><p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Placed</p><p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedOrder.createdAt}</p></div>
            </div>
            <div className={`rounded-lg border p-4 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}><h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Operational Notes</h3><ul className={`mt-3 space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}><li>Channel: {selectedOrder.channel}</li><li>Priority: {selectedOrder.priority}</li><li>Item count: {selectedOrder.items}</li><li>Shipping method: {selectedOrder.shippingMethod}</li></ul></div>
            <div className="flex flex-wrap justify-end gap-2"><Button onClick={() => setSelectedOrder(null)} className="bg-gray-600 text-white">Close</Button>{selectedOrder.status === 'Pending' && <Button onClick={() => updateOrderStatus(selectedOrder.id, 'Processing', `${selectedOrder.id} moved into processing.`)} className="bg-blue-600 text-white">Move to Processing</Button>}{selectedOrder.status === 'Processing' && <Button onClick={() => updateOrderStatus(selectedOrder.id, 'Shipped', `${selectedOrder.id} marked as shipped.`)} className="bg-indigo-600 text-white">Mark as Shipped</Button>}</div>
          </div>
        )}
      </Modal>

      <AdminActionConfirm isOpen={pendingAction !== null} title={pendingAction?.title ?? 'Confirm Action'} message={pendingAction?.message ?? ''} confirmLabel={pendingAction?.confirmLabel ?? 'Confirm'} confirmClassName={pendingAction?.confirmClassName} isDarkMode={isDarkMode} onClose={() => setPendingAction(null)} onConfirm={() => { pendingAction?.run(); setPendingAction(null); }} />
    </div>
  );
};

export default Orders;
