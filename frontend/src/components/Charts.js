import { useState } from 'react';

export const CAT_COLORS = {
  Food: '#FF6B6B', Transport: '#4ECDC4', Shopping: '#FFE66D',
  Bills: '#A8E6CF', Entertainment: '#FF8B94', Other: '#B5B9FF'
};

export function PieChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const [hovered, setHovered] = useState(null);
  if (!total) return <div style={{ textAlign: 'center', padding: 40, color: '#444' }}>No data yet</div>;
  let cumAngle = -Math.PI / 2;
  const slices = data.map(d => {
    const angle = (d.value / total) * 2 * Math.PI;
    const start = cumAngle;
    cumAngle += angle;
    return { ...d, start, end: cumAngle, angle };
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width="200" height="200" viewBox="-1 -1 2 2">
        {slices.map((s, i) => {
          const r = hovered === i ? 0.95 : 0.85;
          const x1 = Math.cos(s.start) * r, y1 = Math.sin(s.start) * r;
          const x2 = Math.cos(s.end) * r, y2 = Math.sin(s.end) * r;
          const large = s.angle > Math.PI ? 1 : 0;
          return <path key={i} d={`M0 0 L${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`} fill={s.color} opacity={hovered === null || hovered === i ? 1 : 0.5} style={{ cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} />;
        })}
        <circle r="0.5" fill="#0f0f1a" />
        {hovered !== null ? (<><text textAnchor="middle" dy="-0.08" fontSize="0.16" fill="#fff" fontWeight="bold">{slices[hovered].label}</text><text textAnchor="middle" dy="0.14" fontSize="0.13" fill="#aaa">Rs.{slices[hovered].value.toLocaleString()}</text></>) : (<><text textAnchor="middle" dy="-0.05" fontSize="0.13" fill="#888">Total</text><text textAnchor="middle" dy="0.15" fontSize="0.17" fill="#fff" fontWeight="bold">Rs.{total.toLocaleString()}</text></>)}
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 12 }}>
        {slices.map((s, i) => (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#ccc' }}><div style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />{s.label} ({Math.round((s.value / total) * 100)}%)</div>))}
      </div>
    </div>
  );
}

export function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 160, padding: '0 8px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 10, color: '#aaa' }}>Rs.{d.value.toLocaleString()}</span>
          <div style={{ width: '100%', background: `linear-gradient(to top, ${d.color}, ${d.color}88)`, height: `${(d.value / max) * 130}px`, borderRadius: '4px 4px 0 0', transition: 'height 0.8s cubic-bezier(0.34,1.56,0.64,1)', minHeight: d.value > 0 ? 4 : 0 }} />
          <span style={{ fontSize: 10, color: '#888', textAlign: 'center' }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}
