
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

const Dashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<'sales' | 'revenue' | 'customers'>('sales');
  const [selectedDateFilter, setSelectedDateFilter] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Pagination state
  const [ordersPage, setOrdersPage] = useState(1);
  const [customersPage, setCustomersPage] = useState(1);
  const [productsPage, setProductsPage] = useState(1);
  const itemsPerPage = 5;

  // Sorting state
  const [ordersSortBy, setOrdersSortBy] = useState<'date' | 'amount'>('date');
  const [ordersSortDir, setOrdersSortDir] = useState<'asc' | 'desc'>('desc');
  const [customersSortBy, setCustomersSortBy] = useState<'revenue' | 'orders'>('revenue');
  const [customersSortDir, setCustomersSortDir] = useState<'asc' | 'desc'>('desc');
  const [productsSortBy, setProductsSortBy] = useState<'sales' | 'revenue'>('sales');
  const [productsSortDir, setProductsSortDir] = useState<'asc' | 'desc'>('desc');

  // Advanced filter state
  const [showOrderFilters, setShowOrderFilters] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderAmountMin, setOrderAmountMin] = useState('');
  const [orderAmountMax, setOrderAmountMax] = useState('');

  const [showCustomerFilters, setShowCustomerFilters] = useState(false);
  const [customerStatusFilter, setCustomerStatusFilter] = useState<string>('all');
  const [customerRevenueMin, setCustomerRevenueMin] = useState('');
  const [customerRevenueMax, setCustomerRevenueMax] = useState('');

  const [showProductFilters, setShowProductFilters] = useState(false);
  const [productSalesMin, setProductSalesMin] = useState('');
  const [productSalesMax, setProductSalesMax] = useState('');

  // Mock data for last 12 months
  const salesData = [
    { month: 'Jan', sales: 4000, revenue: 2400 },
    { month: 'Feb', sales: 3000, revenue: 1398 },
    { month: 'Mar', sales: 2000, revenue: 9800 },
    { month: 'Apr', sales: 2780, revenue: 3908 },
    { month: 'May', sales: 1890, revenue: 4800 },
    { month: 'Jun', sales: 2390, revenue: 3800 },
    { month: 'Jul', sales: 3490, revenue: 4300 },
    { month: 'Aug', sales: 4200, revenue: 5100 },
    { month: 'Sep', sales: 3800, revenue: 4500 },
    { month: 'Oct', sales: 4100, revenue: 5200 },
    { month: 'Nov', sales: 4900, revenue: 6100 },
    { month: 'Dec', sales: 5200, revenue: 6800 },
  ];

  // Mock data for sales by category
  const salesByCategory = [
    { name: 'Electronics', value: 4000 },
    { name: 'Clothing', value: 3000 },
    { name: 'Home & Garden', value: 2800 },
    { name: 'Sports', value: 2200 },
    { name: 'Books', value: 1800 },
  ];

  // Colors for pie chart
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Mock recent orders data
  const recentOrders = [
    { id: '#ORD001', customer: 'John Doe', amount: '$1,234.50', status: 'Completed', date: '2025-01-28' },
    { id: '#ORD002', customer: 'Jane Smith', amount: '$2,345.00', status: 'Pending', date: '2025-01-27' },
    { id: '#ORD003', customer: 'Mike Johnson', amount: '$890.25', status: 'Shipped', date: '2025-01-26' },
  ];

  // Mock alerts data
  const alerts = [
    { id: 1, message: 'High inventory levels in Electronics', type: 'warning', time: '5 min ago' },
    { id: 2, message: 'New customer milestone: 1000 users reached!', type: 'success', time: '1 hour ago' },
    { id: 3, message: 'Payment processing delay detected', type: 'error', time: '2 hours ago' },
  ];

  // KPI data
  const kpis = [
    { label: 'Growth', value: '+12.5%', change: 'up', color: 'text-green-600' },
    { label: 'Revenue Trend', value: '+$8.2K', change: 'up', color: 'text-green-600' },
    { label: 'Conversion Rate', value: '3.2%', change: 'down', color: 'text-red-600' },
  ];

  // Mock data for customer growth
  const customerGrowthData = [
    { month: 'Jan', customers: 400 },
    { month: 'Feb', customers: 520 },
    { month: 'Mar', customers: 680 },
    { month: 'Apr', customers: 790 },
    { month: 'May', customers: 950 },
    { month: 'Jun', customers: 1100 },
    { month: 'Jul', customers: 1320 },
    { month: 'Aug', customers: 1580 },
    { month: 'Sep', customers: 1750 },
    { month: 'Oct', customers: 1920 },
    { month: 'Nov', customers: 2100 },
    { month: 'Dec', customers: 2340 },
  ];

  // Mock top products data
  const topProducts = [
    { id: 1, name: 'Wireless Headphones', sales: 1250, revenue: '$45,000' },
    { id: 2, name: 'Smart Watch', sales: 980, revenue: '$38,500' },
    { id: 3, name: 'USB-C Cable', sales: 2150, revenue: '$12,900' },
    { id: 4, name: 'Portable Charger', sales: 890, revenue: '$16,410' },
    { id: 5, name: 'Screen Protector', sales: 3200, revenue: '$9,600' },
  ];

  // Mock system health data
  const systemHealth = [
    { name: 'Server Uptime', status: 'healthy', value: '99.9%', icon: '✓' },
    { name: 'Database', status: 'healthy', value: 'Online', icon: '✓' },
    { name: 'API Response', status: 'healthy', value: '45ms', icon: '✓' },
    { name: 'Storage', status: 'warning', value: '78%', icon: '⚠' },
  ];

  // Mock footer stats
  const footerStats = [
    { label: 'Total Revenue', value: '$892,450', icon: '💰' },
    { label: 'Total Customers', value: '12,340', icon: '👥' },
    { label: 'Avg Order Value', value: '$127.50', icon: '💵' },
    { label: 'Retention Rate', value: '87.5%', icon: '📈' },
  ];

  // Mock top customers data
  const topCustomers = [
    { id: 1, name: 'Acme Corporation', revenue: '$45,230', orders: 12, lastOrder: '2025-01-28', status: 'Active' },
    { id: 2, name: 'Tech Solutions Inc', revenue: '$38,900', orders: 9, lastOrder: '2025-01-25', status: 'Active' },
    { id: 3, name: 'Global Trading Ltd', revenue: '$32,450', orders: 8, lastOrder: '2025-01-20', status: 'Active' },
    { id: 4, name: 'Prime Retail Co', revenue: '$28,600', orders: 7, lastOrder: '2025-01-15', status: 'Inactive' },
    { id: 5, name: 'NextGen Ventures', revenue: '$22,300', orders: 5, lastOrder: '2025-01-10', status: 'Active' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900 border-l-4 border-green-400 dark:border-green-400';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 dark:border-yellow-400';
      case 'error':
        return 'bg-red-50 dark:bg-red-900 border-l-4 border-red-400 dark:border-red-400';
      default:
        return 'bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 dark:border-blue-400';
    }
  };

  const getSystemHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-l-4 border-green-400 text-green-700';
      case 'warning':
        return 'bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700';
      case 'critical':
        return 'bg-red-50 border-l-4 border-red-400 text-red-700';
      default:
        return 'bg-gray-50 border-l-4 border-gray-400 text-gray-700';
    }
  };

  // Filtering functions
  const getFilteredData = (data: any[], filterType: string) => {
    const now = new Date();
    let startDate = new Date();

    switch (filterType) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return data;
    }

    return data.filter((item: any) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= now;
    });
  };

  const filteredOrders = getFilteredData(recentOrders, selectedDateFilter).filter((order: any) =>
    order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCustomers = topCustomers.filter((customer: any) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFilteredChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let dataPoints = 12;

    if (selectedDateFilter === 'today') {
      dataPoints = 24; // Show 24 hours
    } else if (selectedDateFilter === 'week') {
      dataPoints = 7;
      return salesData.slice(-7);
    } else if (selectedDateFilter === 'month') {
      dataPoints = 30;
      return salesData;
    } else if (selectedDateFilter === 'year') {
      return salesData;
    }

    return salesData;
  };

  const filteredChartData = getFilteredChartData();

  // CSV Export functions
  const convertToCSV = (data: any[], headers: string[]) => {
    const headerRow = headers.join(',');
    const dataRows = data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        return typeof value === 'string' && value.includes(',') ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(',')
    );
    return [headerRow, ...dataRows].join('\n');
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const exportOrdersToCSV = () => {
    const headers = ['id', 'customer', 'amount', 'status', 'date'];
    const dataToExport = filteredOrders.map(order => ({
      id: order.id,
      customer: order.customer,
      amount: order.amount,
      status: order.status,
      date: order.date
    }));
    const csv = convertToCSV(dataToExport, headers);
    downloadCSV(csv, `orders_${selectedDateFilter}_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportCustomersToCSV = () => {
    const headers = ['name', 'revenue', 'orders', 'lastOrder', 'status'];
    const dataToExport = filteredCustomers.map(customer => ({
      name: customer.name,
      revenue: customer.revenue,
      orders: customer.orders,
      lastOrder: customer.lastOrder,
      status: customer.status
    }));
    const csv = convertToCSV(dataToExport, headers);
    downloadCSV(csv, `customers_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Sorting function
  const sortData = (data: any[], sortBy: string, sortDir: 'asc' | 'desc') => {
    return [...data].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      // Handle numeric strings (e.g., "$1,234.50")
      if (typeof aVal === 'string' && aVal.includes('$')) {
        aVal = parseFloat(aVal.replace(/[$,]/g, ''));
        bVal = parseFloat(bVal.replace(/[$,]/g, ''));
      }
      
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Pagination function
  const paginate = (data: any[], page: number, itemsPerPage: number) => {
    const start = (page - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  const getTotalPages = (dataLength: number) => Math.ceil(dataLength / itemsPerPage);

  // Advanced filtering functions
  const applyOrderFilters = (orders: any[]) => {
    return orders.filter(order => {
      // Status filter
      if (orderStatusFilter !== 'all' && order.status !== orderStatusFilter) return false;
      
      // Amount range filter
      if (orderAmountMin || orderAmountMax) {
        const amount = parseFloat(order.amount.replace(/[$,]/g, ''));
        if (orderAmountMin && amount < parseFloat(orderAmountMin)) return false;
        if (orderAmountMax && amount > parseFloat(orderAmountMax)) return false;
      }
      
      return true;
    });
  };

  const applyCustomerFilters = (customers: any[]) => {
    return customers.filter(customer => {
      // Status filter
      if (customerStatusFilter !== 'all' && customer.status !== customerStatusFilter) return false;
      
      // Revenue range filter
      if (customerRevenueMin || customerRevenueMax) {
        const revenue = parseFloat(customer.revenue.replace(/[$,]/g, ''));
        if (customerRevenueMin && revenue < parseFloat(customerRevenueMin)) return false;
        if (customerRevenueMax && revenue > parseFloat(customerRevenueMax)) return false;
      }
      
      return true;
    });
  };

  const applyProductFilters = (products: any[]) => {
    return products.filter(product => {
      // Sales range filter
      if (productSalesMin || productSalesMax) {
        const sales = product.sales;
        if (productSalesMin && sales < parseFloat(productSalesMin)) return false;
        if (productSalesMax && sales > parseFloat(productSalesMax)) return false;
      }
      
      return true;
    });
  };

  // Get sorted and paginated data
  const sortedOrders = sortData(filteredOrders, ordersSortBy, ordersSortDir);
  const filteredOrdersAdvanced = applyOrderFilters(sortedOrders);
  const paginatedOrders = paginate(filteredOrdersAdvanced, ordersPage, itemsPerPage);
  const ordersTotalPages = getTotalPages(filteredOrdersAdvanced.length);

  const sortedCustomers = sortData(filteredCustomers, customersSortBy, customersSortDir);
  const filteredCustomersAdvanced = applyCustomerFilters(sortedCustomers);
  const paginatedCustomers = paginate(filteredCustomersAdvanced, customersPage, itemsPerPage);
  const customersTotalPages = getTotalPages(filteredCustomersAdvanced.length);

  const sortedProducts = sortData(topProducts, productsSortBy, productsSortDir);
  const filteredProductsAdvanced = applyProductFilters(sortedProducts);
  const paginatedProducts = paginate(filteredProductsAdvanced, productsPage, itemsPerPage);
  const productsTotalPages = getTotalPages(filteredProductsAdvanced.length);

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
      <AdminSidebar collapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} onSearch={setSearchQuery} isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
        <main className="flex-1 overflow-y-auto p-4 dark:bg-gray-950">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100">Dashboard</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Filter: <span className="font-semibold text-gray-700 dark:text-gray-300 capitalize">{selectedDateFilter}</span>{searchQuery && ` • Search: "${searchQuery}"`}</p>
            </div>
          </div>

          {/* Quick Date Filters */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedDateFilter('today')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedDateFilter === 'today' ? 'bg-blue-600 dark:bg-blue-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              Today
            </button>
            <button
              onClick={() => setSelectedDateFilter('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedDateFilter === 'week' ? 'bg-blue-600 dark:bg-blue-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              This Week
            </button>
            <button
              onClick={() => setSelectedDateFilter('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedDateFilter === 'month' ? 'bg-blue-600 dark:bg-blue-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              This Month
            </button>
            <button
              onClick={() => setSelectedDateFilter('year')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedDateFilter === 'year' ? 'bg-blue-600 dark:bg-blue-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              This Year
            </button>
          </div>

          {/* Alerts Section - Compact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg ${getAlertColor(alert.type)}`}>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">{alert.time}</p>
              </div>
            ))}
          </div>

          {/* Stat Cards - Compact */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 border-l-4 border-blue-500">
              <div className="text-gray-600 dark:text-gray-400 text-xs font-medium">Users</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">1,234</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 border-l-4 border-green-500">
              <div className="text-gray-600 dark:text-gray-400 text-xs font-medium">Sales</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">$12.3K</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 border-l-4 border-purple-500">
              <div className="text-gray-600 dark:text-gray-400 text-xs font-medium">Active</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">567</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 border-l-4 border-orange-500">
              <div className="text-gray-600 dark:text-gray-400 text-xs font-medium">Pending</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">89</div>
            </div>
          </div>

          {/* KPI Metrics Row - Compact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {kpis.map((kpi, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-3">
                <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">{kpi.label}</p>
                <p className={`text-lg font-bold ${kpi.color}`}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Charts Row - Tabbed Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Chart Tabs */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-t-4 border-blue-500">
              <div className="flex gap-2 mb-4">
                <button 
                  onClick={() => setActiveChartTab('sales')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeChartTab === 'sales' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                  Sales
                </button>
                <button 
                  onClick={() => setActiveChartTab('revenue')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeChartTab === 'revenue' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                  Revenue Trend
                </button>
                <button 
                  onClick={() => setActiveChartTab('customers')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeChartTab === 'customers' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                  Customer Growth
                </button>
              </div>
              
              {activeChartTab === 'sales' && (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={filteredChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '12px' }} />
                    <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              
              {activeChartTab === 'revenue' && (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={filteredChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
              
              {activeChartTab === 'customers' && (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={customerGrowthData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="customers" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Pie Chart - Sales by Category */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-t-4 border-green-500">
              <p className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">Sales by Category</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ value }) => `$${value}k`}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    labelStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                  >
                    {salesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 flex flex-wrap gap-1">
                {salesByCategory.map((category, index) => (
                  <div key={index} className="flex items-center gap-1 text-xs">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-gray-600 dark:text-gray-400">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders - Compact Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-t-4 border-purple-500 mb-4">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Recent Orders {filteredOrders.length < recentOrders.length && <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">({filteredOrders.length})</span>}</p>
              <div className="flex gap-2">
                <button 
                  onClick={exportOrdersToCSV}
                  disabled={filteredOrders.length === 0}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium disabled:text-gray-400 flex items-center gap-1"
                  title="Export to CSV"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export
                </button>
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">View All →</button>
              </div>
            </div>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">No orders found for selected filters</div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setOrdersSortBy(ordersSortBy === 'date' ? 'amount' : 'date')}>
                      Order {ordersSortBy === 'date' && (ordersSortDir === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">Customer</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => { if (ordersSortBy === 'amount') { setOrdersSortDir(ordersSortDir === 'asc' ? 'desc' : 'asc'); } else { setOrdersSortBy('amount'); setOrdersSortDir('desc'); } }}>
                      Amount {ordersSortBy === 'amount' && (ordersSortDir === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-2 px-2 text-gray-900 dark:text-white font-medium">{order.id}</td>
                      <td className="py-2 px-2 text-gray-700 dark:text-gray-300">{order.customer}</td>
                      <td className="py-2 px-2 text-gray-900 dark:text-white font-semibold">{order.amount}</td>
                      <td className="py-2 px-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <div className="flex justify-between items-center mt-3 px-2">
                <span className="text-xs text-gray-600 dark:text-gray-400">Page {ordersPage} of {ordersTotalPages}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOrdersPage(Math.max(1, ordersPage - 1))}
                    disabled={ordersPage === 1}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => setOrdersPage(Math.min(ordersTotalPages, ordersPage + 1))}
                    disabled={ordersPage === ordersTotalPages}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Top Products & System Health Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Top Products - Compact Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-t-4 border-green-500">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Top Products</p>
                <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">View All →</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">Product</th>
                      <th className="text-right py-2 px-2 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => { if (productsSortBy === 'sales') { setProductsSortDir(productsSortDir === 'asc' ? 'desc' : 'asc'); } else { setProductsSortBy('sales'); setProductsSortDir('desc'); } }}>
                        Sales {productsSortBy === 'sales' && (productsSortDir === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-right py-2 px-2 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => { if (productsSortBy === 'revenue') { setProductsSortDir(productsSortDir === 'asc' ? 'desc' : 'asc'); } else { setProductsSortBy('revenue'); setProductsSortDir('desc'); } }}>
                        Revenue {productsSortBy === 'revenue' && (productsSortDir === 'asc' ? '↑' : '↓')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((product, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-2 px-2 text-gray-900 dark:text-white font-medium">{product.name}</td>
                        <td className="py-2 px-2 text-right text-gray-700 dark:text-gray-300">{product.sales}</td>
                        <td className="py-2 px-2 text-right text-gray-900 dark:text-white font-semibold">{product.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="flex justify-between items-center mt-3 px-2">
                <span className="text-xs text-gray-600 dark:text-gray-400">Page {productsPage} of {productsTotalPages}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setProductsPage(Math.max(1, productsPage - 1))}
                    disabled={productsPage === 1}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => setProductsPage(Math.min(productsTotalPages, productsPage + 1))}
                    disabled={productsPage === productsTotalPages}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>

            {/* System Health Indicators */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-t-4 border-orange-500">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">System Health</p>
              <div className="space-y-2">
                {systemHealth.map((health, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded border-l-4" style={{ borderColor: health.status === 'healthy' ? '#10b981' : '#f59e0b' }}>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{health.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">{health.value}</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${health.status === 'healthy' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-400'}`}>
                        {health.status === 'healthy' ? '✓ OK' : '⚠ Warning'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Customers - Compact Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-t-4 border-indigo-500 mb-4">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Top Customers {filteredCustomers.length < topCustomers.length && <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">({filteredCustomers.length})</span>}</p>
              <div className="flex gap-2">
                <button 
                  onClick={exportCustomersToCSV}
                  disabled={filteredCustomers.length === 0}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium disabled:text-gray-400 flex items-center gap-1"
                  title="Export to CSV"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export
                </button>
                <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">View All →</button>
              </div>
            </div>
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">No customers found for search</div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">Customer Name</th>
                    <th className="text-right py-2 px-2 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => { if (customersSortBy === 'revenue') { setCustomersSortDir(customersSortDir === 'asc' ? 'desc' : 'asc'); } else { setCustomersSortBy('revenue'); setCustomersSortDir('desc'); } }}>
                      Revenue {customersSortBy === 'revenue' && (customersSortDir === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-right py-2 px-2 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => { if (customersSortBy === 'orders') { setCustomersSortDir(customersSortDir === 'asc' ? 'desc' : 'asc'); } else { setCustomersSortBy('orders'); setCustomersSortDir('desc'); } }}>
                      Orders {customersSortBy === 'orders' && (customersSortDir === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">Last Order</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers.map((customer, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-2 px-2 text-gray-900 dark:text-white font-medium">{customer.name}</td>
                      <td className="py-2 px-2 text-right text-gray-900 dark:text-white font-semibold">{customer.revenue}</td>
                      <td className="py-2 px-2 text-right text-gray-700 dark:text-gray-300">{customer.orders}</td>
                      <td className="py-2 px-2 text-gray-700 dark:text-gray-300 text-xs">{customer.lastOrder}</td>
                      <td className="py-2 px-2 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${customer.status === 'Active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}>
                          {customer.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <div className="flex justify-between items-center mt-3 px-2">
                <span className="text-xs text-gray-600 dark:text-gray-400">Page {customersPage} of {customersTotalPages}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCustomersPage(Math.max(1, customersPage - 1))}
                    disabled={customersPage === 1}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => setCustomersPage(Math.min(customersTotalPages, customersPage + 1))}
                    disabled={customersPage === customersTotalPages}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Footer Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {footerStats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center border-t-4 border-blue-500">
                <p className="text-2xl mb-1">{stat.icon}</p>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
