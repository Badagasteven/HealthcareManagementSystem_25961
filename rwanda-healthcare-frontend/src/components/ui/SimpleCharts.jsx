import React, { useMemo } from "react";

/**
 * Very lightweight charts (no external libs).
 * - LineChart: SVG line + points
 * - BarChart: SVG bars
 */

export function LineChart({
  data = [],
  width = 760,
  height = 220,
  padding = 28,
  valueKey = "value",
  labelKey = "label",
}) {
  const { points, min, max } = useMemo(() => {
    if (!data.length) return { points: [], min: 0, max: 0 };

    const vals = data.map((d) => Number(d[valueKey] ?? 0));
    const _min = Math.min(...vals);
    const _max = Math.max(...vals);
    const span = Math.max(1, _max - _min);

    const innerW = width - padding * 2;
    const innerH = height - padding * 2;

    const pts = data.map((d, i) => {
      const x = padding + (i / Math.max(1, data.length - 1)) * innerW;
      const v = Number(d[valueKey] ?? 0);
      const y = padding + (1 - (v - _min) / span) * innerH;
      return { x, y, v, label: String(d[labelKey] ?? "") };
    });

    return { points: pts, min: _min, max: _max };
  }, [data, width, height, padding, valueKey, labelKey]);

  const pathD = useMemo(() => {
    if (!points.length) return "";
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  }, [points]);

  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm p-3">
      <svg width={width} height={height} className="block">
        <rect x="0" y="0" width={width} height={height} rx="18" fill="white" />

        {[0.25, 0.5, 0.75].map((t) => {
          const y = padding + t * (height - padding * 2);
          return (
            <line
              key={t}
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              stroke="rgba(2,6,23,0.08)"
            />
          );
        })}

        <text x={padding} y={18} fontSize="12" fill="rgba(2,6,23,0.55)">
          {max}
        </text>
        <text x={padding} y={height - 8} fontSize="12" fill="rgba(2,6,23,0.55)">
          {min}
        </text>

        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="rgba(37,99,235,0.9)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {points.map((p, idx) => (
          <g key={idx}>
            <circle cx={p.x} cy={p.y} r="4.6" fill="rgba(37,99,235,0.9)" />
            {(idx === 0 || idx === points.length - 1 || idx % 2 === 0) && (
              <text
                x={p.x}
                y={height - 10}
                fontSize="11"
                textAnchor="middle"
                fill="rgba(2,6,23,0.55)"
              >
                {p.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

export function BarChart({
  data = [],
  width = 760,
  height = 220,
  padding = 28,
  valueKey = "value",
  labelKey = "label",
}) {
  const { bars, max } = useMemo(() => {
    if (!data.length) return { bars: [], max: 0 };

    const vals = data.map((d) => Number(d[valueKey] ?? 0));
    const _max = Math.max(...vals, 1);

    const innerW = width - padding * 2;
    const innerH = height - padding * 2;

    const gap = 10;
    const barW = Math.max(12, (innerW - gap * (data.length - 1)) / data.length);

    const _bars = data.map((d, i) => {
      const v = Number(d[valueKey] ?? 0);
      const h = (v / _max) * innerH;
      const x = padding + i * (barW + gap);
      const y = padding + (innerH - h);
      return { x, y, w: barW, h, v, label: String(d[labelKey] ?? "") };
    });

    return { bars: _bars, max: _max };
  }, [data, width, height, padding, valueKey, labelKey]);

  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm p-3">
      <svg width={width} height={height} className="block">
        <rect x="0" y="0" width={width} height={height} rx="18" fill="white" />

        {[0.25, 0.5, 0.75].map((t) => {
          const y = padding + t * (height - padding * 2);
          return (
            <line
              key={t}
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              stroke="rgba(2,6,23,0.08)"
            />
          );
        })}

        <text x={padding} y={18} fontSize="12" fill="rgba(2,6,23,0.55)">
          {max}
        </text>

        {bars.map((b, idx) => (
          <g key={idx}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="10" fill="rgba(34,197,94,0.85)" />
            <text
              x={b.x + b.w / 2}
              y={height - 10}
              fontSize="11"
              textAnchor="middle"
              fill="rgba(2,6,23,0.55)"
            >
              {b.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
