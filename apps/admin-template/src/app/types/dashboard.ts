export enum WidgetType {
  METRIC_CARD = 'METRIC_CARD',
  CHART = 'CHART',
  TABLE = 'TABLE',
  ACTIVITY_FEED = 'ACTIVITY_FEED',
  QUICK_ACTIONS = 'QUICK_ACTIONS',
  STATUS_OVERVIEW = 'STATUS_OVERVIEW',
  ALERTS = 'ALERTS',
  CALENDAR = 'CALENDAR',
}

export enum ChartType {
  BAR = 'BAR',
  LINE = 'LINE',
  PIE = 'PIE',
  AREA = 'AREA',
  COMPOSED = 'COMPOSED',
}

export interface WidgetMetadata {
  id: string;
  type: WidgetType;
  title: string;
  description: string;
  icon: string;
  category: 'metrics' | 'charts' | 'tables' | 'actions' | 'system';
  minWidth: number;
  minHeight: number;
  defaultWidth: number;
  defaultHeight: number;
  configurable: boolean;
}

export interface WidgetInstance {
  id: string;
  type: WidgetType;
  title: string;
  position: number; // Grid position for reordering
  width: number; // Grid columns
  height: number; // Grid rows
  isVisible: boolean;
  config?: Record<string, any>;
  lastUpdated: number;
}

export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  widgets: WidgetInstance[];
  gridColumns: number;
  isDefault: boolean;
  createdAt: number;
  updatedAt: number;
  isEditing: boolean;
}

export interface DashboardPreferences {
  activeLayoutId: string;
  theme: 'light' | 'dark';
  refreshInterval: number; // milliseconds
  autoRefresh: boolean;
  compactMode: boolean;
  showWidgetTitles: boolean;
  animations: boolean;
}

export interface WidgetDataCache {
  widgetId: string;
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export interface WidgetConfigOptions {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect';
    label: string;
    default: any;
    options?: Array<{ label: string; value: any }>;
    description?: string;
  };
}
