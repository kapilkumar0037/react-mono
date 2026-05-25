import { useCallback, useState } from 'react';
import {
  WidgetInstance,
  DashboardLayout,
  DashboardPreferences,
} from '../types/dashboard';
import {
  readDashboardLayouts,
  persistDashboardLayouts,
  getLayout,
  createLayout,
  updateLayout,
  deleteLayout,
  addWidgetToLayout,
  removeWidgetFromLayout,
  updateWidgetInLayout,
  reorderWidgets,
  readDashboardPreferences,
  persistDashboardPreferences,
  getCachedWidgetData,
  cacheWidgetData,
} from '../utils/dashboardStorage';

export const useDashboard = () => {
  const [layouts, setLayouts] = useState<DashboardLayout[]>(() =>
    readDashboardLayouts()
  );
  const [preferences, setPreferences] = useState<DashboardPreferences>(() =>
    readDashboardPreferences()
  );

  const getActiveLayout = useCallback(() => {
    return layouts.find((l) => l.id === preferences.activeLayoutId) || layouts[0] || null;
  }, [layouts, preferences.activeLayoutId]);

  const switchLayout = useCallback((layoutId: string) => {
    const newPrefs = { ...preferences, activeLayoutId: layoutId };
    setPreferences(newPrefs);
    persistDashboardPreferences(newPrefs);
  }, [preferences]);

  const createNewLayout = useCallback((name: string, description?: string) => {
    const newLayout = createLayout(name, description);
    setLayouts([...layouts, newLayout]);
    return newLayout;
  }, [layouts]);

  const updateCurrentLayout = useCallback((layout: DashboardLayout) => {
    updateLayout(layout);
    setLayouts(layouts.map((l) => (l.id === layout.id ? layout : l)));
  }, [layouts]);

  const deleteCurrentLayout = useCallback((layoutId: string) => {
    deleteLayout(layoutId);
    setLayouts(layouts.filter((l) => l.id !== layoutId));
    
    if (preferences.activeLayoutId === layoutId && layouts.length > 0) {
      const newActiveId = layouts[0].id;
      const newPrefs = { ...preferences, activeLayoutId: newActiveId };
      setPreferences(newPrefs);
      persistDashboardPreferences(newPrefs);
    }
  }, [layouts, preferences]);

  const addWidget = useCallback(
    (layoutId: string, widget: WidgetInstance) => {
      const layout = layouts.find((l) => l.id === layoutId);
      if (!layout) return;

      addWidgetToLayout(layoutId, widget);
      setLayouts(
        layouts.map((l) =>
          l.id === layoutId
            ? { ...l, widgets: [...l.widgets, { ...widget, position: l.widgets.length }] }
            : l
        )
      );
    },
    [layouts]
  );

  const removeWidget = useCallback(
    (layoutId: string, widgetId: string) => {
      removeWidgetFromLayout(layoutId, widgetId);
      setLayouts(
        layouts.map((l) =>
          l.id === layoutId ? { ...l, widgets: l.widgets.filter((w) => w.id !== widgetId) } : l
        )
      );
    },
    [layouts]
  );

  const updateWidget = useCallback(
    (layoutId: string, widgetId: string, updates: Partial<WidgetInstance>) => {
      updateWidgetInLayout(layoutId, widgetId, updates);
      setLayouts(
        layouts.map((l) =>
          l.id === layoutId
            ? {
                ...l,
                widgets: l.widgets.map((w) =>
                  w.id === widgetId ? { ...w, ...updates, lastUpdated: Date.now() } : w
                ),
              }
            : l
        )
      );
    },
    [layouts]
  );

  const reorderLayoutWidgets = useCallback(
    (layoutId: string, widgetIds: string[]) => {
      reorderWidgets(layoutId, widgetIds);
      setLayouts(
        layouts.map((l) =>
          l.id === layoutId
            ? {
                ...l,
                widgets: widgetIds
                  .map((id) => l.widgets.find((w) => w.id === id))
                  .filter((w) => w !== undefined) as WidgetInstance[],
              }
            : l
        )
      );
    },
    [layouts]
  );

  const updatePreferences = useCallback((newPrefs: Partial<DashboardPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    persistDashboardPreferences(updated);
  }, [preferences]);

  const getWidgetCachedData = useCallback((widgetId: string) => {
    return getCachedWidgetData(widgetId);
  }, []);

  const setWidgetCachedData = useCallback((widgetId: string, data: any, ttl?: number) => {
    cacheWidgetData(widgetId, data, ttl);
  }, []);

  const toggleEditMode = useCallback((layoutId: string) => {
    const layout = layouts.find((l) => l.id === layoutId);
    if (layout) {
      const updated = { ...layout, isEditing: !layout.isEditing };
      updateCurrentLayout(updated);
    }
  }, [layouts, updateCurrentLayout]);

  return {
    layouts,
    preferences,
    getActiveLayout,
    switchLayout,
    createNewLayout,
    updateCurrentLayout,
    deleteCurrentLayout,
    addWidget,
    removeWidget,
    updateWidget,
    reorderLayoutWidgets,
    updatePreferences,
    getWidgetCachedData,
    setWidgetCachedData,
    toggleEditMode,
  };
};
