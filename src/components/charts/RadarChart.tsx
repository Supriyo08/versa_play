"use client";

interface RadarChartProps {
  data: { label: string; value: number }[];
  size?: number;
}

export default function RadarChart({ data, size = 220 }: RadarChartProps) {
  const center = size / 2;
  const radius = size / 2 - 30;
  const angleStep = (Math.PI * 2) / data.length;

  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const getLabelPoint = (index: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = radius + 20;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Grid lines
  const gridLevels = [0.25, 0.5, 0.75, 1];

  // Data polygon
  const dataPoints = data.map((d, i) => getPoint(i, d.value));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* Grid */}
      {gridLevels.map((level) => {
        const points = data
          .map((_, i) => {
            const p = getPoint(i, level * 100);
            return `${p.x},${p.y}`;
          })
          .join(" ");
        return (
          <polygon
            key={level}
            points={points}
            fill="none"
            stroke="#1e1e30"
            strokeWidth="1"
          />
        );
      })}

      {/* Axis lines */}
      {data.map((_, i) => {
        const p = getPoint(i, 100);
        return (
          <line
            key={`axis-${i}`}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="#1e1e30"
            strokeWidth="1"
          />
        );
      })}

      {/* Data area */}
      <path d={dataPath} fill="rgba(200, 255, 0, 0.15)" stroke="#c8ff00" strokeWidth="2" />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={`point-${i}`} cx={p.x} cy={p.y} r="3" fill="#c8ff00" />
      ))}

      {/* Labels */}
      {data.map((d, i) => {
        const p = getLabelPoint(i);
        return (
          <text
            key={`label-${i}`}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[10px] uppercase tracking-wider"
            fill="#71717a"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}
