import { useMemo, useState } from 'react';

type SortDirection = 'asc' | 'desc';
type SortKey<T> = Extract<keyof T, string>;

interface SortConfig<T> {
  key: SortKey<T>;
  direction: SortDirection;
}

const compareValues = (left: unknown, right: unknown) => {
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }

  return String(left).localeCompare(String(right), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
};

export const useSortableData = <T extends object>(
  items: T[],
  initialConfig?: SortConfig<T>
) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(initialConfig ?? null);

  const sortedItems = useMemo(() => {
    if (!sortConfig) {
      return items;
    }

    const nextItems = [...items];
    nextItems.sort((a, b) => {
      const left = a[sortConfig.key as keyof T];
      const right = b[sortConfig.key as keyof T];
      const comparison = compareValues(left, right);
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return nextItems;
  }, [items, sortConfig]);

  const requestSort = (key: SortKey<T>) => {
    setSortConfig((currentConfig) => {
      if (currentConfig?.key === key) {
        return {
          key,
          direction: currentConfig.direction === 'asc' ? 'desc' : 'asc',
        };
      }

      return {
        key,
        direction: 'asc',
      };
    });
  };

  return {
    items: sortedItems,
    requestSort,
    sortConfig,
  };
};

export type { SortConfig, SortDirection, SortKey };
