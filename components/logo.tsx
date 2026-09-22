// components/logo.tsx
export function Logo({
  className = "size-6",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 400"
      className={className}
      style={style}
      fill="none"
    >
      <defs>
        <linearGradient id="iconBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C1C3" />
          <stop offset="45%" stopColor="#0891B2" />
          <stop offset="100%" stopColor="#0F9F92" />
        </linearGradient>
        <filter id="badgeShadow" x="-15%" y="-15%" width="130%" height="135%">
          <feDropShadow
            dx="0"
            dy="16"
            stdDeviation="20"
            floodColor="#0891B2"
            floodOpacity="0.28"
          />
        </filter>
      </defs>

      <g transform="translate(40, 40)">
        <rect
          width="320"
          height="320"
          rx="78"
          fill="url(#iconBadgeGrad)"
          filter="url(#badgeShadow)"
        />
        <rect
          x="2.5"
          y="2.5"
          width="315"
          height="315"
          rx="75.5"
          stroke="#FFFFFF"
          strokeOpacity="0.3"
          strokeWidth="3"
        />
        <path
          d="M 124 64 C 124 55.163 131.163 48 140 48 L 180 48 C 188.837 48 196 55.163 196 64 L 196 124 L 256 124 C 264.837 124 272 131.163 272 140 L 272 180 C 272 188.837 264.837 196 256 196 L 196 196 L 196 256 C 196 264.837 188.837 272 180 272 L 140 272 C 131.163 272 124 264.837 124 256 L 124 196 L 64 196 C 55.163 196 48 188.837 48 180 L 48 140 C 48 131.163 55.163 124 64 124 L 124 124 Z"
          fill="#FFFFFF"
        />
        <path
          d="M 68 160 L 118 160 L 138 112 L 160 204 L 180 140 L 196 172 L 206 160 L 252 160"
          stroke="#0891B2"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="180" cy="140" r="7.5" fill="#22C1C3" />
      </g>
    </svg>
  );
}
