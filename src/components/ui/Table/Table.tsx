'use client';

import React, { useState, useMemo } from 'react';
import styles from './Table.module.css';

/* ============================================================================
   Types
   ============================================================================ */

export interface Column<T> {
  key: keyof T | string;
  header: React.ReactNode;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  loading?: boolean;
  emptyMessage?: React.ReactNode;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  size?: 'sm' | 'md' | 'lg';
  stickyHeader?: boolean;
  selectable?: boolean;
  selectedRows?: Set<string | number>;
  onSelectionChange?: (selectedRows: Set<string | number>) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  className?: string;
}

/* ============================================================================
   Table Component
   ============================================================================ */

export function Table<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  emptyMessage = 'لا توجد بيانات',
  striped = false,
  hoverable = true,
  bordered = false,
  size = 'md',
  stickyHeader = false,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  sortColumn,
  sortDirection,
  onSort,
  className,
}: TableProps<T>) {
  const allSelected = data.length > 0 && data.every((_, index) => {
    const key = keyExtractor(data[index], index);
    return selectedRows.has(key);
  });

  const someSelected = !allSelected && data.some((_, index) => {
    const key = keyExtractor(data[index], index);
    return selectedRows.has(key);
  });

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      const allKeys = data.map((row, index) => keyExtractor(row, index));
      onSelectionChange(new Set(allKeys));
    }
  };

  const handleSelectRow = (key: string | number) => {
    if (!onSelectionChange) return;
    
    const newSelection = new Set(selectedRows);
    if (newSelection.has(key)) {
      newSelection.delete(key);
    } else {
      newSelection.add(key);
    }
    onSelectionChange(newSelection);
  };

  const handleSort = (columnKey: string) => {
    if (!onSort) return;
    
    const newDirection = sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(columnKey, newDirection);
  };

  const getCellValue = (row: T, key: string): unknown => {
    const keys = key.split('.');
    let value: unknown = row;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return value;
  };

  const tableClasses = [
    styles.table,
    striped && styles.striped,
    hoverable && styles.hoverable,
    bordered && styles.bordered,
    styles[`size-${size}`],
    stickyHeader && styles.stickyHeader,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.tableWrapper}>
      <table className={tableClasses}>
        <thead className={styles.thead}>
          <tr>
            {selectable && (
              <th className={styles.checkboxCell}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={handleSelectAll}
                  className={styles.checkbox}
                />
              </th>
            )}
            {columns.map((column) => {
              const key = String(column.key);
              const isSorted = sortColumn === key;
              
              return (
                <th
                  key={key}
                  className={[
                    styles.th,
                    column.sortable && styles.sortable,
                    column.align && styles[`align-${column.align}`],
                    column.className,
                  ].filter(Boolean).join(' ')}
                  style={{ width: column.width }}
                  onClick={column.sortable ? () => handleSort(key) : undefined}
                >
                  <div className={styles.headerContent}>
                    <span>{column.header}</span>
                    {column.sortable && (
                      <span className={styles.sortIcon}>
                        {isSorted ? (
                          sortDirection === 'asc' ? '↑' : '↓'
                        ) : (
                          <span className={styles.sortInactive}>↕</span>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {loading ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className={styles.loadingCell}>
                <div className={styles.loadingSpinner} />
                <span>جاري التحميل...</span>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className={styles.emptyCell}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              const rowKey = keyExtractor(row, rowIndex);
              const isSelected = selectedRows.has(rowKey);
              
              return (
                <tr
                  key={rowKey}
                  className={[
                    styles.tr,
                    isSelected && styles.selected,
                  ].filter(Boolean).join(' ')}
                >
                  {selectable && (
                    <td className={styles.checkboxCell}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(rowKey)}
                        className={styles.checkbox}
                      />
                    </td>
                  )}
                  {columns.map((column) => {
                    const key = String(column.key);
                    const value = getCellValue(row, key);
                    
                    return (
                      <td
                        key={key}
                        className={[
                          styles.td,
                          column.align && styles[`align-${column.align}`],
                          column.className,
                        ].filter(Boolean).join(' ')}
                      >
                        {column.render
                          ? column.render(value, row, rowIndex)
                          : String(value ?? '')}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ============================================================================
   Action Cell Component
   ============================================================================ */

interface ActionCellProps {
  children: React.ReactNode;
  className?: string;
}

export function ActionCell({ children, className }: ActionCellProps) {
  return (
    <div className={[styles.actionCell, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}

/* ============================================================================
   Default Export
   ============================================================================ */

export default Table;
