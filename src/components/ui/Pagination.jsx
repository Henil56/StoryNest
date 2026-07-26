import React from 'react'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  // Build page number array with ellipsis
  const getPageNumbers = () => {
    const pages = []
    const delta = 1

    pages.push(1)

    const rangeStart = Math.max(2, currentPage - delta)
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta)

    if (rangeStart > 2) {
      pages.push('...')
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i)
    }

    if (rangeEnd < totalPages - 1) {
      pages.push('...')
    }

    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const pages = getPageNumbers()

  const handlePageChange = (newPage) => {
    onPageChange(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
      {/* Previous */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-xl border border-border bg-surface-elevated text-text-secondary shadow-sm hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300 hover:-translate-y-0.5 dark:hover:bg-primary-900/40 dark:hover:text-primary-300 transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none active:scale-95"
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Page Numbers */}
      {pages.map((page, idx) =>
        page === '...' ? (
          <span
            key={`ellipsis-${idx}`}
            className="w-10 h-10 flex items-center justify-center text-sm text-text-muted select-none"
          >
            ···
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`min-w-[2.75rem] h-11 flex items-center justify-center text-sm font-semibold rounded-xl transition-all duration-300 active:scale-90 ${
              page === currentPage
                ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/30 hover:-translate-y-0.5'
                : 'border border-border text-text-secondary shadow-sm hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300 hover:-translate-y-0.5 dark:hover:bg-primary-900/40 dark:hover:text-primary-300'
            }`}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-xl border border-border bg-surface-elevated text-text-secondary shadow-sm hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300 hover:-translate-y-0.5 dark:hover:bg-primary-900/40 dark:hover:text-primary-300 transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none active:scale-95"
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  )
}
