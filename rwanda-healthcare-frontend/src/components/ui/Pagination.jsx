import React from "react";

function PageBtn({ active, disabled, children, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "min-w-[40px] h-10 px-3 rounded-xl border text-sm font-semibold transition",
        disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-50",
        active ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800" : "bg-white border-slate-200 text-slate-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function Pagination({ page, totalPages, onPage }) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  // compact window
  const windowSize = 5;
  const start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  const pages = [];
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-white">
      <p className="text-sm text-slate-600">
        Page <span className="font-extrabold text-slate-900">{page}</span> of{" "}
        <span className="font-extrabold text-slate-900">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        <PageBtn disabled={!canPrev} onClick={() => canPrev && onPage(page - 1)}>
          Prev
        </PageBtn>

        {start > 1 && (
          <>
            <PageBtn onClick={() => onPage(1)}>1</PageBtn>
            {start > 2 && <span className="px-1 text-slate-400">…</span>}
          </>
        )}

        {pages.map((p) => (
          <PageBtn key={p} active={p === page} onClick={() => onPage(p)}>
            {p}
          </PageBtn>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1 text-slate-400">…</span>}
            <PageBtn onClick={() => onPage(totalPages)}>{totalPages}</PageBtn>
          </>
        )}

        <PageBtn disabled={!canNext} onClick={() => canNext && onPage(page + 1)}>
          Next
        </PageBtn>
      </div>
    </div>
  );
}
