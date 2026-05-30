'use client';

import { useState } from 'react';

const CM_PER_FT = 30.48;

function parseCm(value?: string): { w: string; l: string } {
  const nums = value?.match(/[\d.]+/g);
  return { w: nums?.[0] ?? '', l: nums?.[1] ?? '' };
}

function toFt(cm: string): string {
  const n = parseFloat(cm);
  return Number.isFinite(n) && n > 0 ? (n / CM_PER_FT).toFixed(2) : '';
}

export function DimensionsInput({ defaultDimensions }: { defaultDimensions?: string }) {
  const initial = parseCm(defaultDimensions);
  const [width, setWidth] = useState(initial.w);
  const [length, setLength] = useState(initial.l);

  const widthFt = toFt(width);
  const lengthFt = toFt(length);

  const cmValue = width && length ? `${width} × ${length} cm` : width ? `${width} cm` : '';
  const ftValue = widthFt && lengthFt ? `${widthFt} × ${lengthFt} ft` : widthFt ? `${widthFt} ft` : '';

  return (
    <div className="dash-form-field">
      <label>Dimensions</label>
      <div className="dash-dimension-box">
        <div className="dash-dimension-row">
          <input
            type="number" step="0.1" min="0" inputMode="decimal"
            value={width} onChange={e => setWidth(e.target.value)}
            placeholder="Width" aria-label="Width in centimeters"
          />
          <span className="dash-dimension-sep">×</span>
          <input
            type="number" step="0.1" min="0" inputMode="decimal"
            value={length} onChange={e => setLength(e.target.value)}
            placeholder="Length" aria-label="Length in centimeters"
          />
          <span className="dash-dimension-unit">cm</span>
        </div>
        {ftValue && (
          <p className="dash-hint" style={{ marginTop: 10 }}>
            ≈ {ftValue}
          </p>
        )}
      </div>
      {!ftValue && (
        <p className="dash-hint">Enter width and length in cm — feet are calculated automatically</p>
      )}
      <input type="hidden" name="dimensions" value={cmValue} />
      <input type="hidden" name="dimensions_ft" value={ftValue} />
    </div>
  );
}
