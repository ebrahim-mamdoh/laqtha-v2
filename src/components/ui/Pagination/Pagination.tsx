'use client';

import React from 'react';
import styles from './Pagination.module.css';

/* ============================================================================
   Types
   ============================================================================ */

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface PaginationRange {
  type: 'page' | 'dots';
  value: number;
}

/* ============================================================================
   Helper Functions
   ============================================================================ */

function generatePaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): PaginationRange[] {
  const totalNumbers = siblingCount * 2 + 3; // siblings + current + first + last
  const totalButtons = totalNumbers + 2; // + 2 for dots

  if (totalPages <= totalButtons) {
    return Array.from({ length: totalPages }, (_, i) => ({
      type: 'page' as const,
      value: i + 1,
    }));
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

  const range: PaginationRange[] = [];

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    for (let i = 1; i <= leftItemCount; i++) {
      range.push({ type: 'page', value: i });
    }
    range.push({ type: 'dots', value: -1 });
    range.push({ type: 'page', value: totalPages });
  } else if (shouldShowLeftDots && !shouldShowRightDots) {
    range.push({ type: 'page', value: 1 });
    range.push({ type: 'dots', value: -2 });
    const rightItemCount = 3 + 2 * siblingCount;
    for (let i = totalPages - rightItemCount + 1; i <= totalPages; i++) {
      range.push({ type: 'page', value: i });
    }
  } else if (shouldShowLeftDots && shouldShowRightDots) {
    range.push({ type: 'page', value: 1 });
    range.push({ type: 'dots', value: -1 });
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      range.push({ type: 'page', value: i });
    }
    range.push({ type: 'dots', value: -2 });
    range.push({ type: 'page', value: totalPages });
  }

  return range;
}

/* ============================================================================
   Pagination Component
   ============================================================================ */

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  size = 'md',
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const paginationRange = generatePaginationRange(currentPage, totalPages, siblingCount);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <nav
      className={[styles.pagination, styles[`size-${size}`], className].filter(Boolean).join(' ')}
      aria-label="التنقل بين الصفحات"
    >
      <ul className={styles.list}>
        {/* First Page Button */}
        {showFirstLast && (
          <li>
            <button
              type="button"
              className={[styles.button, styles.navButton].join(' ')}
              onClick={() => handlePageChange(1)}
              disabled={isFirstPage}
              aria-label="الصفحة الأولى"
            >
              <ChevronDoubleRight />
            </button>
          </li>
        )}

        {/* Previous Button */}
        {showPrevNext && (
          <li>
            <button
              type="button"
              className={[styles.button, styles.navButton].join(' ')}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={isFirstPage}
              aria-label="الصفحة السابقة"
            >
              <ChevronRight />
            </button>
          </li>
        )}

        {/* Page Numbers */}
        {paginationRange.map((item, index) => {
          if (item.type === 'dots') {
            return (
              <li key={`dots-${index}`}>
                <span className={styles.dots}>...</span>
              </li>
            );
          }

          const isActive = item.value === currentPage;
          return (
            <li key={item.value}>
              <button
                type="button"
                className={[
                  styles.button,
                  styles.pageButton,
                  isActive && styles.active,
                ].filter(Boolean).join(' ')}
                onClick={() => handlePageChange(item.value)}
                aria-label={`الصفحة ${item.value}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.value}
              </button>
            </li>
          );
        })}

        {/* Next Button */}
        {showPrevNext && (
          <li>
            <button
              type="button"
              className={[styles.button, styles.navButton].join(' ')}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={isLastPage}
              aria-label="الصفحة التالية"
            >
              <ChevronLeft />
            </button>
          </li>
        )}

        {/* Last Page Button */}
        {showFirstLast && (
          <li>
            <button
              type="button"
              className={[styles.button, styles.navButton].join(' ')}
              onClick={() => handlePageChange(totalPages)}
              disabled={isLastPage}
              aria-label="الصفحة الأخيرة"
            >
              <ChevronDoubleLeft />
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

/* ============================================================================
   Page Info Component
   ============================================================================ */

interface PageInfoProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  className?: string;
}

export function PageInfo({
  currentPage,
  pageSize,
  totalItems,
  className,
}: PageInfoProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <p className={[styles.pageInfo, className].filter(Boolean).join(' ')}>
      عرض {start} - {end} من {totalItems} نتيجة
    </p>
  );
}

/* ============================================================================
   Page Size Selector
   ============================================================================ */

interface PageSizeSelectorProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  options?: number[];
  className?: string;
}

export function PageSizeSelector({
  pageSize,
  onPageSizeChange,
  options = [10, 20, 50, 100],
  className,
}: PageSizeSelectorProps) {
  return (
    <div className={[styles.pageSizeSelector, className].filter(Boolean).join(' ')}>
      <label htmlFor="page-size" className={styles.pageSizeLabel}>
        عدد النتائج:
      </label>
      <select
        id="page-size"
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className={styles.pageSizeSelect}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ============================================================================
   Full Pagination Component (combines all)
   ============================================================================ */

interface FullPaginationProps extends PaginationProps {
  pageSize: number;
  totalItems: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  showPageInfo?: boolean;
  showPageSizeSelector?: boolean;
}

export function FullPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
  showPageInfo = true,
  showPageSizeSelector = true,
  ...paginationProps
}: FullPaginationProps) {
  return (
    <div className={styles.fullPagination}>
      <div className={styles.paginationInfo}>
        {showPageInfo && (
          <PageInfo
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
          />
        )}
        {showPageSizeSelector && onPageSizeChange && (
          <PageSizeSelector
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
            options={pageSizeOptions}
          />
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        {...paginationProps}
      />
    </div>
  );
}

/* ============================================================================
   Icons
   ============================================================================ */

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronDoubleRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
    </svg>
  );
}

function ChevronDoubleLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 7l-5 5 5 5M18 7l-5 5 5 5" />
    </svg>
  );
}

/* ============================================================================
   Default Export
   ============================================================================ */

export default Pagination;
