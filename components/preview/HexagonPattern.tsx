'use client';

interface HexagonPatternProps {
  className?: string;
  opacity?: number;
  color?: string;
}

export function HexagonPattern({ className = '', opacity = 0.05, color = '#0066ff' }: HexagonPatternProps) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="hexagons"
          width="50"
          height="43.4"
          patternUnits="userSpaceOnUse"
          patternTransform="scale(2)"
        >
          <polygon
            points="25,0 50,14.4 50,43.4 25,43.4 0,43.4 0,14.4"
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            opacity={opacity}
          />
          <polygon
            points="25,28.9 37.5,21.65 37.5,7.15 25,0 12.5,7.15 12.5,21.65"
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            opacity={opacity * 0.7}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexagons)" />
    </svg>
  );
}

interface HexagonSwatchProps {
  color: string;
  size?: number;
  className?: string;
}

export function HexagonSwatch({ color, size = 80, className = '' }: HexagonSwatchProps) {
  const height = size * 1.1547; // Ratio for regular hexagon
  const points = `
    ${size / 2},0
    ${size},${height * 0.25}
    ${size},${height * 0.75}
    ${size / 2},${height}
    0,${height * 0.75}
    0,${height * 0.25}
  `;

  return (
    <svg
      width={size}
      height={height}
      viewBox={`0 0 ${size} ${height}`}
      className={className}
    >
      <polygon points={points} fill={color} />
    </svg>
  );
}
