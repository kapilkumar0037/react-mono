import {
  WidgetType,
  WidgetInstance,
  DashboardLayout,
  DashboardPreferences,
  WidgetMetadata,
} from '../types/dashboard';

const DASHBOARD_LAYOUTS_KEY = 'dashboard:layouts';
const DASHBOARD_PREFERENCES_KEY = 'dashboard:preferences';
const WIDGET_CACHE_KEY_PREFIX = 'dashboard:cache:';

/**
 * Get all available widgets with metadata
 */
export const getAvailableWidgets = (): WidgetMetadata[] => [
  {
    id: 'metric-users',
    type: WidgetType.METRIC_CARD,
    title: 'Total Users',
    description: 'Total users in the system',
    icon: '👥',
    category: 'metrics',
    minWidth: 1,
    minHeight: 1,
    defaultWidth: 2,
    defaultHeight: 1,
    configurable: false,
  },
  {
    id: 'metric-orders',
    type: WidgetType.METRIC_CARD,
    title: 'Total Orders',
    description: 'Total orders this month',
    icon: '📦',
    category: 'metrics',
    minWidth: 1,
    minHeight: 1,
    defaultWidth: 2,
    defaultHeight: 1,
    configurable: false,
  },
  {
    id: 'metric-revenue',
    type: WidgetType.METRIC_CARD,
    title: 'Revenue',
    description: 'Total revenue this month',
    icon: '💰',
    category: 'metrics',
    minWidth: 1,
    minHeight: 1,
    defaultWidth: 2,
    defaultHeight: 1,
    configurable: false,
  },
  {
    id: 'metric-active',
    type: WidgetType.METRIC_CARD,
    title: 'Active Sessions',
    description: 'Active user sessions',
    icon: '🟢',
    category: 'metrics',
    minWidth: 1,
    minHeight: 1,
    defaultWidth: 2,
    defaultHeight: 1,
    configurable: false,
  },
  {
    id: 'chart-sales',
    type: WidgetType.CHART,
    title: 'Sales Chart',
    description: 'Sales trend over time',
    icon: '📈',
    category: 'charts',
    minWidth: 2,
    minHeight: 2,
    defaultWidth: 3,
    defaultHeight: 2,
    configurable: true,
  },
  {
    id: 'chart-users',
    type: WidgetType.CHART,
    title: 'User Growth',
    description: 'User registration trend',
    icon: '📊',
    category: 'charts',
    minWidth: 2,
    minHeight: 2,
    defaultWidth: 3,
    defaultHeight: 2,
    configurable: true,
  },
  {
    id: 'status-orders',
    type: WidgetType.STATUS_OVERVIEW,
    title: 'Order Status',
    description: 'Overview of order statuses',
    icon: '🔄',
    category: 'system',
    minWidth: 2,
    minHeight: 1,
    defaultWidth: 2,
    defaultHeight: 1,
    configurable: false,
  },
  {
    id: 'activity-feed',
    type: WidgetType.ACTIVITY_FEED,
    title: 'Activity Log',
    description: 'Recent system activity',
    icon: '📋',
    category: 'system',
    minWidth: 2,
    minHeight: 2,
    defaultWidth: 3,
    defaultHeight: 2,
    configurable: false,
  },
];

/**
 * Create default layout
 */
export const createDefaultLayout = (): DashboardLayout => {
  const now = Date.now();
  const widgets: WidgetInstance[] = [
    {
      id: 'widget-1',
      type: WidgetType.METRIC_CARD,
      title: 'Total Users',
      position: 0,
      width: 2,
      height: 1,
      isVisible: true,
      lastUpdated: now,
    },
    {
      id: 'widget-2',
      type: WidgetType.METRIC_CARD,
      title: 'Total Orders',
      position: 1,
      width: 2,
      height: 1,
      isVisible: true,
      lastUpdated: now,
    },
    {
      id: 'widget-3',
      type: WidgetType.METRIC_CARD,
      title: 'Revenue',
      position: 2,
      width: 2,
      height: 1,
      isVisible: true,
      lastUpdated: now,
    },
    {
      id: 'widget-4',
      type: WidgetType.METRIC_CARD,
      title: 'Active Sessions',
      position: 3,
      width: 2,
      height: 1,
      isVisible: true,
      lastUpdated: now,
    },
    {
      id: 'widget-5',
      type: WidgetType.CHART,
      title: 'Sales Chart',
      position: 4,
      width: 3,
      height: 2,
      isVisible: true,
      lastUpdated: now,
    },
    {
      id: 'widget-6',
      type: WidgetType.CHART,
      title: 'User Growth',
      position: 5,
      width: 3,
      height: 2,
      isVisible: true,
      lastUpdated: now,
    },
  ];

  return {
    id: 'layout-default',
    name: 'Default Layout',
    description: 'Default dashboard layout',
    widgets,
    gridColumns: 6,
    isDefault: true,
    createdAt: now,
    updatedAt: now,
    isEditing: false,
  };
};

/**
 * Get all layouts
 */
export const readDashboardLayouts = (): DashboardLayout[] => {
  const stored = localStorage.getItem(DASHBOARD_LAYOUTS_KEY);
  if (!stored) {
    const defaultLayout = createDefaultLayout();
    persistDashboardLayouts([defaultLayout]);
    return [defaultLayout];
  }

  try {
    return JSON.parse(stored);
  } catch {
    const defaultLayout = createDefaultLayout();
    persistDashboardLayouts([defaultLayout]);
    return [defaultLayout];
  }
};

/**
 * Save layouts
 */
export const persistDashboardLayouts = (layouts: DashboardLayout[]): void => {
  localStorage.setItem(DASHBOARD_LAYOUTS_KEY, JSON.stringify(layouts));
};

/**
 * Get specific layout
 */
export const getLayout = (layoutId: string): DashboardLayout | null => {
  const layouts = readDashboardLayouts();
  return layouts.find((l) => l.id === layoutId) || null;
};

/**
 * Create new layout
 */
export const createLayout = (name: string, description?: string): DashboardLayout => {
  const layouts = readDashboardLayouts();
  const now = Date.now();

  const newLayout: DashboardLayout = {
    id: `layout-${now}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    widgets: [],
    gridColumns: 6,
    isDefault: false,
    createdAt: now,
    updatedAt: now,
    isEditing: false,
  };

  layouts.push(newLayout);
  persistDashboardLayouts(layouts);
  return newLayout;
};

/**
 * Update layout
 */
export const updateLayout = (layout: DashboardLayout): void => {
  const layouts = readDashboardLayouts();
  const index = layouts.findIndex((l) => l.id === layout.id);

  if (index !== -1) {
    layouts[index] = { ...layout, updatedAt: Date.now() };
    persistDashboardLayouts(layouts);
  }
};

/**
 * Delete layout
 */
export const deleteLayout = (layoutId: string): void => {
  const layouts = readDashboardLayouts();
  const filtered = layouts.filter((l) => l.id !== layoutId);
  persistDashboardLayouts(filtered);
};

/**
 * Add widget to layout
 */
export const addWidgetToLayout = (layoutId: string, widget: WidgetInstance): void => {
  const layout = getLayout(layoutId);
  if (!layout) return;

  const maxPosition = Math.max(...layout.widgets.map((w) => w.position), -1);
  widget.position = maxPosition + 1;
  layout.widgets.push(widget);
  updateLayout(layout);
};

/**
 * Remove widget from layout
 */
export const removeWidgetFromLayout = (layoutId: string, widgetId: string): void => {
  const layout = getLayout(layoutId);
  if (!layout) return;

  layout.widgets = layout.widgets.filter((w) => w.id !== widgetId);
  updateLayout(layout);
};

/**
 * Update widget in layout
 */
export const updateWidgetInLayout = (
  layoutId: string,
  widgetId: string,
  updates: Partial<WidgetInstance>
): void => {
  const layout = getLayout(layoutId);
  if (!layout) return;

  const widget = layout.widgets.find((w) => w.id === widgetId);
  if (widget) {
    Object.assign(widget, updates, { lastUpdated: Date.now() });
    updateLayout(layout);
  }
};

/**
 * Reorder widgets
 */
export const reorderWidgets = (layoutId: string, widgetIds: string[]): void => {
  const layout = getLayout(layoutId);
  if (!layout) return;

  layout.widgets = widgetIds
    .map((id) => layout.widgets.find((w) => w.id === id))
    .filter((w) => w !== undefined) as WidgetInstance[];

  layout.widgets.forEach((widget, index) => {
    widget.position = index;
  });

  updateLayout(layout);
};

/**
 * Get preferences
 */
export const readDashboardPreferences = (): DashboardPreferences => {
  const stored = localStorage.getItem(DASHBOARD_PREFERENCES_KEY);
  if (!stored) {
    const defaults: DashboardPreferences = {
      activeLayoutId: 'layout-default',
      theme: 'light',
      refreshInterval: 30000,
      autoRefresh: true,
      compactMode: false,
      showWidgetTitles: true,
      animations: true,
    };
    persistDashboardPreferences(defaults);
    return defaults;
  }

  try {
    return JSON.parse(stored);
  } catch {
    const defaults: DashboardPreferences = {
      activeLayoutId: 'layout-default',
      theme: 'light',
      refreshInterval: 30000,
      autoRefresh: true,
      compactMode: false,
      showWidgetTitles: true,
      animations: true,
    };
    persistDashboardPreferences(defaults);
    return defaults;
  }
};

/**
 * Save preferences
 */
export const persistDashboardPreferences = (prefs: DashboardPreferences): void => {
  localStorage.setItem(DASHBOARD_PREFERENCES_KEY, JSON.stringify(prefs));
};

/**
 * Cache widget data
 */
export const cacheWidgetData = (widgetId: string, data: any, ttl: number = 60000): void => {
  const cacheKey = `${WIDGET_CACHE_KEY_PREFIX}${widgetId}`;
  const cacheEntry = {
    widgetId,
    data,
    timestamp: Date.now(),
    ttl,
  };
  localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
};

/**
 * Get cached widget data
 */
export const getCachedWidgetData = (widgetId: string): any | null => {
  const cacheKey = `${WIDGET_CACHE_KEY_PREFIX}${widgetId}`;
  const stored = localStorage.getItem(cacheKey);
  if (!stored) return null;

  try {
    const entry = JSON.parse(stored);
    const age = Date.now() - entry.timestamp;

    if (age > entry.ttl) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
};

/**
 * Clear old cache entries
 */
export const clearOldCacheEntries = (maxAgeDays: number = 1): number => {
  const cutoffTime = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;
  const allKeys = Object.keys(localStorage);
  let deletedCount = 0;

  allKeys.forEach((key) => {
    if (key.startsWith(WIDGET_CACHE_KEY_PREFIX)) {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const entry = JSON.parse(stored);
          if (entry.timestamp < cutoffTime) {
            localStorage.removeItem(key);
            deletedCount++;
          }
        } catch {
          localStorage.removeItem(key);
          deletedCount++;
        }
      }
    }
  });

  return deletedCount;
};
