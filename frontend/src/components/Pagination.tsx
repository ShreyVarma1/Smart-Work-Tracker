// Pagination uses an interface for its props — clear object shape contract
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

// Page size options the user can pick from
const PAGE_SIZE_OPTIONS = [5, 10, 20];

function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  // Which item numbers are visible on this page?
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Build the page number buttons array
  // Always show first, last, current ± 1, and ellipsis gaps
  function getPageNumbers(): (number | "...")[] {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [1];

    if (currentPage > 3) pages.push("...");

    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("...");

    pages.push(totalPages);
    return pages;
  }

  return (
    <div className="pagination-wrapper">

      {/* Left: showing x–y of z */}
      <p className="pagination-info">
        Showing <strong>{startItem}</strong>–<strong>{endItem}</strong> of{" "}
        <strong>{totalItems}</strong> tasks
      </p>

      {/* Centre: page buttons */}
      <div className="pagination-controls">
        {/* Previous */}
        <button
          type="button"
          className="page-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          ‹
        </button>

        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="page-ellipsis">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={`page-btn ${page === currentPage ? "active" : ""}`}
              onClick={() => onPageChange(page as number)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          type="button"
          className="page-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          aria-label="Next page"
        >
          ›
        </button>
      </div>

      {/* Right: rows per page selector */}
      <div className="pagination-size">
        <label htmlFor="pageSize">Rows per page</label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}

export default Pagination;
