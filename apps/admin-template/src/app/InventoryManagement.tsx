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

type InventoryStatus = 'Healthy' | 'Low Stock' | 'Out of Stock' | 'Backordered';
type InventoryPriority = 'High' | 'Medium' | 'Low';
type Warehouse = 'New York' | 'London' | 'Bengaluru' | 'Dubai';

interface InventoryItem {
  id: string;
  sku: string;
  product: string;
  category: string;
  warehouse: Warehouse;
  status: InventoryStatus;
  priority: InventoryPriority;
  onHand: number;
  reserved: number;
  reorderPoint: number;
  incomingUnits: number;
  supplier: string;
  updatedAt: string;
}

interface InventoryManagementProps {
  isDarkMode?: boolean;
}

const initialInventory: InventoryItem[] = [
  {
    id: 'INV-9001',
    sku: 'ELC-4821',
    product: 'Wireless Noise Cancelling Headphones',
    category: 'Electronics',
    warehouse: 'New York',
    status: 'Low Stock',
    priority: 'High',
    onHand: 18,
    reserved: 10,
    reorderPoint: 25,
    incomingUnits: 60,
    supplier: 'Northwind Audio',
    updatedAt: '2026-04-01 09:10',
  },
  {
    id: 'INV-9002',
    sku: 'HOM-1207',
    product: 'Smart Air Purifier',
    category: 'Home',
    warehouse: 'London',
    status: 'Healthy',
    priority: 'Medium',
    onHand: 76,
    reserved: 14,
    reorderPoint: 30,
    incomingUnits: 0,
    supplier: 'BluePeak Living',
    updatedAt: '2026-04-01 08:55',
  },
  {
    id: 'INV-9003',
    sku: 'FAS-3174',
    product: 'Performance Running Jacket',
    category: 'Apparel',
    warehouse: 'Bengaluru',
    status: 'Backordered',
    priority: 'High',
    onHand: 0,
    reserved: 22,
    reorderPoint: 40,
    incomingUnits: 120,
    supplier: 'SwiftSupply Co.',
    updatedAt: '2026-04-01 08:20',
  },
  {
    id: 'INV-9004',
    sku: 'ACC-7750',
    product: 'MagSafe Travel Charger',
    category: 'Accessories',
    warehouse: 'Dubai',
    status: 'Out of Stock',
    priority: 'High',
    onHand: 0,
    reserved: 6,
    reorderPoint: 20,
    incomingUnits: 45,
    supplier: 'VoltEdge Components',
    updatedAt: '2026-04-01 07:48',
  },
  {
    id: 'INV-9005',
    sku: 'ELC-4981',
    product: '4K Action Camera',
    category: 'Electronics',
    warehouse: 'New York',
    status: 'Healthy',
    priority: 'Low',
    onHand: 98,
    reserved: 11,
    reorderPoint: 35,
    incomingUnits: 0,
    supplier: 'Northwind Audio',
    updatedAt: '2026-04-01 07:22',
  },
  {
    id: 'INV-9006',
    sku: 'HOM-1419',
    product: 'Ceramic Kitchen Set',
    category: 'Home',
    warehouse: 'London',
    status: 'Low Stock',
    priority: 'Medium',
    onHand: 21,
    reserved: 9,
    reorderPoint: 24,
    incomingUnits: 30,
    supplier: 'Harbor House Supply',
    updatedAt: '2026-04-01 06:59',
  },
];

const InventoryManagement: React.FC<InventoryManagementProps> = ({ isDarkMode = false }) => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useSyncedSearchQuery();
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [statusFilter, setStatusFilter] = useState<InventoryStatus | 'all'>('all');
  const [warehouseFilter, setWarehouseFilter] = useState<Warehouse | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<InventoryPriority | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [pendingAction, setPendingAction] = useState<{
    title: string;
    message: string;
    confirmLabel: string;
    confirmClassName: string;
    run: () => void;
  } | null>(null);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        query === '' ||
        item.id.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.product.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.supplier.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesWarehouse = warehouseFilter === 'all' || item.warehouse === warehouseFilter;
      const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesWarehouse && matchesPriority;
    });
  }, [inventory, priorityFilter, searchQuery, statusFilter, warehouseFilter]);

  const { items: sortedInventory, requestSort, sortConfig } = useSortableData(filteredInventory, {
    key: 'priority',
    direction: 'asc',
  });

  const stats = useMemo(
    () => [
      { label: 'Tracked SKUs', value: inventory.length.toString(), tone: 'border-blue-500' },
      { label: 'Low Coverage', value: inventory.filter((item) => item.status === 'Low Stock' || item.status === 'Out of Stock').length.toString(), tone: 'border-amber-500' },
      { label: 'Backorders', value: inventory.filter((item) => item.status === 'Backordered').length.toString(), tone: 'border-red-500' },
      { label: 'Incoming Units', value: inventory.reduce((sum, item) => sum + item.incomingUnits, 0).toLocaleString(), tone: 'border-green-500' },
    ],
    [inventory]
  );

  const activeFilterCount =
    (searchQuery !== '' ? 1 : 0) +
    (statusFilter !== 'all' ? 1 : 0) +
    (warehouseFilter !== 'all' ? 1 : 0) +
    (priorityFilter !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setWarehouseFilter('all');
    setPriorityFilter('all');
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItemIds((currentIds) =>
      currentIds.includes(itemId)
        ? currentIds.filter((id) => id !== itemId)
        : [...currentIds, itemId]
    );
  };

  const toggleSelectAllFiltered = () => {
    const filteredIds = sortedInventory.map((item) => item.id);
    setSelectedItemIds((currentIds) =>
      filteredIds.every((id) => currentIds.includes(id))
        ? currentIds.filter((id) => !filteredIds.includes(id))
        : Array.from(new Set([...currentIds, ...filteredIds]))
    );
  };

  const selectedItems = inventory.filter((item) => selectedItemIds.includes(item.id));
  const allFilteredSelected =
    sortedInventory.length > 0 && sortedInventory.every((item) => selectedItemIds.includes(item.id));

  const getStatusVariant = (status: InventoryStatus) => {
    switch (status) {
      case 'Healthy':
        return 'success';
      case 'Low Stock':
        return 'warning';
      case 'Out of Stock':
        return 'danger';
      case 'Backordered':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  const getWarehouseClasses = (warehouse: Warehouse) => {
    switch (warehouse) {
      case 'New York':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
      case 'London':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200';
      case 'Bengaluru':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
      case 'Dubai':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getPriorityClasses = (priority: InventoryPriority) => {
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

  const updateInventoryItem = (
    itemId: string,
    updater: (item: InventoryItem) => InventoryItem,
    message: string
  ) => {
    setInventory((currentItems) =>
      currentItems.map((item) => (item.id === itemId ? updater(item) : item))
    );
    setSelectedItem((currentItem) =>
      currentItem && currentItem.id === itemId ? updater(currentItem) : currentItem
    );
    showToast({
      message,
      variant: 'success',
    });
  };

  const expediteRestock = (item: InventoryItem) => {
    updateInventoryItem(
      item.id,
      (currentItem) => ({
        ...currentItem,
        incomingUnits: currentItem.incomingUnits + 25,
        priority: 'High',
      }),
      `${item.product} restock expedited with 25 additional incoming units.`
    );
  };

  const transferStock = (item: InventoryItem) => {
    updateInventoryItem(
      item.id,
      (currentItem) => ({
        ...currentItem,
        onHand: currentItem.onHand + 15,
        status: currentItem.onHand + 15 > currentItem.reorderPoint ? 'Healthy' : 'Low Stock',
      }),
      `${item.product} received an inter-warehouse transfer of 15 units.`
    );
  };

  const markReviewed = (item: InventoryItem) => {
    updateInventoryItem(
      item.id,
      (currentItem) => ({
        ...currentItem,
        priority: 'Low',
      }),
      `${item.product} marked as reviewed by inventory operations.`
    );
  };

  const requestExpediteRestock = (item: InventoryItem) => {
    setPendingAction({
      title: 'Expedite Restock',
      message: `Expedite restock for ${item.product}? This will add 25 incoming units and raise the item priority.`,
      confirmLabel: 'Expedite Restock',
      confirmClassName: 'bg-blue-600 text-white',
      run: () => expediteRestock(item),
    });
  };

  const requestTransferStock = (item: InventoryItem) => {
    setPendingAction({
      title: 'Transfer Stock',
      message: `Transfer 15 units into ${item.product} at ${item.warehouse}? This mock action updates on-hand inventory immediately.`,
      confirmLabel: 'Transfer Stock',
      confirmClassName: 'bg-indigo-600 text-white',
      run: () => transferStock(item),
    });
  };

  const requestMarkReviewed = (item: InventoryItem) => {
    setPendingAction({
      title: 'Mark Reviewed',
      message: `Mark ${item.product} as reviewed by inventory operations? This will lower its priority to low.`,
      confirmLabel: 'Mark Reviewed',
      confirmClassName: 'bg-gray-700 text-white',
      run: () => markReviewed(item),
    });
  };

  const expediteRestockBulk = () => {
    setInventory((currentItems) =>
      currentItems.map((item) =>
        selectedItemIds.includes(item.id)
          ? { ...item, incomingUnits: item.incomingUnits + 25, priority: 'High' }
          : item
      )
    );
    setSelectedItemIds([]);
    showToast({
      message: `${selectedItems.length} inventory item${selectedItems.length === 1 ? '' : 's'} queued for expedited restock.`,
      variant: 'success',
    });
  };

  const transferStockBulk = () => {
    setInventory((currentItems) =>
      currentItems.map((item) =>
        selectedItemIds.includes(item.id)
          ? {
              ...item,
              onHand: item.onHand + 15,
              status: item.onHand + 15 > item.reorderPoint ? 'Healthy' : 'Low Stock',
            }
          : item
      )
    );
    setSelectedItemIds([]);
    showToast({
      message: `${selectedItems.length} inventory item${selectedItems.length === 1 ? '' : 's'} received stock transfers.`,
      variant: 'success',
    });
  };

  const markReviewedBulk = () => {
    setInventory((currentItems) =>
      currentItems.map((item) =>
        selectedItemIds.includes(item.id) ? { ...item, priority: 'Low' } : item
      )
    );
    setSelectedItemIds([]);
    showToast({
      message: `${selectedItems.length} inventory item${selectedItems.length === 1 ? '' : 's'} marked as reviewed.`,
      variant: 'success',
    });
  };

  return (
    <div className={`flex-1 p-6 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Inventory Management</h1>
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Monitor stock health, warehouse coverage, and replenishment risk across active SKUs.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                showToast({
                  message: 'Inventory snapshot export started for the current filtered view.',
                  variant: 'info',
                })
              }
              className="bg-gray-700 text-white"
            >
              Export Snapshot
            </Button>
            <Button
              onClick={() =>
                showToast({
                  message: 'Supplier sync queued successfully.',
                  variant: 'success',
                })
              }
              className="bg-blue-600 text-white"
            >
              Sync Suppliers
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
                placeholder="SKU, product, supplier, or category..."
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as InventoryStatus | 'all')}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All statuses</option>
                <option value="Healthy">Healthy</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Backordered">Backordered</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Warehouse</label>
              <select
                value={warehouseFilter}
                onChange={(event) => setWarehouseFilter(event.target.value as Warehouse | 'all')}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All warehouses</option>
                <option value="New York">New York</option>
                <option value="London">London</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Dubai">Dubai</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Priority</label>
              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value as InventoryPriority | 'all')}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
          <AdminFilterFooter
            isDarkMode={isDarkMode}
            resultLabel="SKU"
            resultCount={sortedInventory.length}
            activeFilterCount={activeFilterCount}
            onClearFilters={clearFilters}
          />
        </Card>

        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          {selectedItemIds.length > 0 && (
            <div className={`border-b px-4 py-3 ${isDarkMode ? 'border-gray-700 bg-gray-900/40' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {selectedItemIds.length} SKU{selectedItemIds.length === 1 ? '' : 's'} selected
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => setSelectedItemIds([])} className="bg-gray-600 text-white text-xs px-3 py-1.5">
                    Clear
                  </Button>
                  <Button
                    onClick={() =>
                      setPendingAction({
                        title: 'Expedite Restock',
                        message: `Expedite restock for ${selectedItems.length} selected SKU${selectedItems.length === 1 ? '' : 's'}?`,
                        confirmLabel: 'Expedite Restock',
                        confirmClassName: 'bg-blue-600 text-white',
                        run: expediteRestockBulk,
                      })
                    }
                    className="bg-blue-600 text-white text-xs px-3 py-1.5"
                  >
                    Expedite
                  </Button>
                  <Button
                    onClick={() =>
                      setPendingAction({
                        title: 'Transfer Stock',
                        message: `Transfer stock into ${selectedItems.length} selected SKU${selectedItems.length === 1 ? '' : 's'}?`,
                        confirmLabel: 'Transfer Stock',
                        confirmClassName: 'bg-indigo-600 text-white',
                        run: transferStockBulk,
                      })
                    }
                    className="bg-indigo-600 text-white text-xs px-3 py-1.5"
                  >
                    Transfer
                  </Button>
                  <Button
                    onClick={() =>
                      setPendingAction({
                        title: 'Mark Reviewed',
                        message: `Mark ${selectedItems.length} selected SKU${selectedItems.length === 1 ? '' : 's'} as reviewed?`,
                        confirmLabel: 'Mark Reviewed',
                        confirmClassName: 'bg-gray-700 text-white',
                        run: markReviewedBulk,
                      })
                    }
                    className="bg-gray-700 text-white text-xs px-3 py-1.5"
                  >
                    Review
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
                      aria-label="Select all filtered inventory"
                    />
                  </th>
                  <th className="px-3 py-2 text-left">
                    <AdminTableSortHeader
                      label="Item"
                      isActive={sortConfig?.key === 'product'}
                      direction={sortConfig?.direction}
                      isDarkMode={isDarkMode}
                      onClick={() => requestSort('product')}
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
                      label="Warehouse"
                      isActive={sortConfig?.key === 'warehouse'}
                      direction={sortConfig?.direction}
                      isDarkMode={isDarkMode}
                      onClick={() => requestSort('warehouse')}
                    />
                  </th>
                  <th className="px-3 py-2 text-left">
                    <AdminTableSortHeader
                      label="Priority"
                      isActive={sortConfig?.key === 'priority'}
                      direction={sortConfig?.direction}
                      isDarkMode={isDarkMode}
                      onClick={() => requestSort('priority')}
                    />
                  </th>
                  <th className="px-3 py-2 text-right">
                    <AdminTableSortHeader
                      label="On Hand"
                      isActive={sortConfig?.key === 'onHand'}
                      direction={sortConfig?.direction}
                      align="right"
                      isDarkMode={isDarkMode}
                      onClick={() => requestSort('onHand')}
                    />
                  </th>
                  <th className="px-3 py-2 text-right">
                    <AdminTableSortHeader
                      label="Incoming"
                      isActive={sortConfig?.key === 'incomingUnits'}
                      direction={sortConfig?.direction}
                      align="right"
                      isDarkMode={isDarkMode}
                      onClick={() => requestSort('incomingUnits')}
                    />
                  </th>
                  <th className={`px-3 py-2 text-right font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedInventory.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`cursor-pointer border-b transition-colors ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <td className="px-3 py-2 align-top">
                      <input
                        type="checkbox"
                        checked={selectedItemIds.includes(item.id)}
                        onChange={(event) => {
                          event.stopPropagation();
                          toggleItemSelection(item.id);
                        }}
                        className="h-4 w-4 rounded"
                        aria-label={`Select ${item.product}`}
                      />
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.product}</div>
                      <div className={`mt-0.5 truncate max-w-[240px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.sku} • {item.category}</div>
                      <div className={`mt-0.5 truncate max-w-[240px] ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{item.supplier}</div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getWarehouseClasses(item.warehouse)}`}>
                        {item.warehouse}
                      </span>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getPriorityClasses(item.priority)}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className={`px-3 py-2 align-top text-right font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.onHand}
                      <div className={`mt-0.5 font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {item.reserved} reserved
                      </div>
                    </td>
                    <td className={`px-3 py-2 align-top text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.incomingUnits}
                      <div className={`mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Reorder at {item.reorderPoint}
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex justify-end gap-1.5">
                        <Button onClick={(event) => { event.stopPropagation(); setSelectedItem(item); }} className="bg-gray-700 text-white text-xs px-2.5 py-1">
                          View
                        </Button>
                        {item.status !== 'Healthy' && (
                          <Button onClick={(event) => { event.stopPropagation(); requestExpediteRestock(item); }} className="bg-blue-600 text-white text-xs px-2.5 py-1">
                            Restock
                          </Button>
                        )}
                        {item.onHand <= item.reorderPoint && (
                          <Button onClick={(event) => { event.stopPropagation(); requestTransferStock(item); }} className="bg-indigo-600 text-white text-xs px-2.5 py-1">
                            Transfer
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedInventory.length === 0 && (
            <AdminEmptyState
              isDarkMode={isDarkMode}
              message="No inventory items match the current filters. Try widening the warehouse or status selection."
            />
          )}
        </Card>
      </div>

      <Modal
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        title={selectedItem ? `Inventory Item ${selectedItem.sku}` : 'Inventory Details'}
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Product</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedItem.product}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedItem.sku}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedItem.category}</p>
              </Card>
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Warehouse</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedItem.warehouse}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedItem.supplier}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Updated {selectedItem.updatedAt}</p>
              </Card>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
                <div className="mt-2">
                  <Badge variant={getStatusVariant(selectedItem.status)}>{selectedItem.status}</Badge>
                </div>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>On Hand</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedItem.onHand}</p>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Reserved</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedItem.reserved}</p>
              </div>
              <div>
                <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Incoming</p>
                <p className={`mt-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedItem.incomingUnits}</p>
              </div>
            </div>

            <div className={`rounded-lg border p-4 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
              <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Inventory Notes</h3>
              <ul className={`mt-3 space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>Warehouse: {selectedItem.warehouse}</li>
                <li>Supplier: {selectedItem.supplier}</li>
                <li>Reorder point: {selectedItem.reorderPoint}</li>
                <li>Last updated: {selectedItem.updatedAt}</li>
              </ul>
            </div>

            <AdminRelatedLinks
              isDarkMode={isDarkMode}
              links={[
                { label: 'Open Orders', onClick: () => navigate('/orders?q=' + encodeURIComponent(selectedItem.product)) },
                { label: 'Open Returns', onClick: () => navigate('/returns-refunds?q=' + encodeURIComponent(selectedItem.product)) },
                { label: 'Open Integrations', onClick: () => navigate('/integrations?q=' + encodeURIComponent(selectedItem.supplier)) },
              ]}
            />

            <div className="flex flex-wrap justify-end gap-2">
              <Button onClick={() => setSelectedItem(null)} className="bg-gray-600 text-white">
                Close
              </Button>
              {selectedItem.priority !== 'Low' && (
                <Button onClick={() => requestMarkReviewed(selectedItem)} className="bg-gray-700 text-white">
                  Mark Reviewed
                </Button>
              )}
              {selectedItem.status !== 'Healthy' && (
                <Button onClick={() => requestExpediteRestock(selectedItem)} className="bg-blue-600 text-white">
                  Expedite Restock
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

export default InventoryManagement;
