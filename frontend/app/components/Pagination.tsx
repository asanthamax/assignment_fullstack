import JumpToPage from "./JumpToPage";

const PAGE_SIZES = [10, 25, 50, 100];

type Props = {
  page: number;
  pageSize: number;
  totalPages: number | null;
  hasNext: boolean;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export default function Pagination({ page, pageSize, totalPages, hasNext, loading, onPageChange, onPageSizeChange }: Props) {
  return (
    <nav className="pager">
      <button onClick={() => onPageChange(1)} disabled={page === 1 || loading}>« First</button>
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1 || loading}>‹ Prev</button>
      <span>
        Page {page}
        {totalPages !== null && ` of ${totalPages.toLocaleString()}`}
      </span>
      <button onClick={() => onPageChange(page + 1)} disabled={!hasNext || loading}>Next ›</button>
      <button
        onClick={() => totalPages && onPageChange(totalPages)}
        disabled={totalPages === null || page === totalPages || loading}
      >
        Last »
      </button>
      <JumpToPage max={totalPages} onJump={onPageChange} />
      <label className="muted">
        Per page{" "}
        <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
          {PAGE_SIZES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
    </nav>
  );
}
