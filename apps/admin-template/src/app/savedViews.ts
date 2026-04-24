export interface SavedView<TFilters> {
  id: string;
  name: string;
  filters: TFilters;
}

function getStorageKey(scope: string) {
  return `admin-template.saved-views.${scope}`;
}

export function readSavedViews<TFilters>(scope: string): SavedView<TFilters>[] {
  const value = localStorage.getItem(getStorageKey(scope));

  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistSavedViews<TFilters>(scope: string, views: SavedView<TFilters>[]): void {
  localStorage.setItem(getStorageKey(scope), JSON.stringify(views));
}

export function createSavedView<TFilters>(name: string, filters: TFilters): SavedView<TFilters> {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    filters,
  };
}
