// components/logo-full.tsx
export function LogoFull({
  className = "h-10 w-auto",
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 160"
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient id="clinicGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C1C3" />
          <stop offset="50%" stopColor="#0891B2" />
          <stop offset="100%" stopColor="#0F9F92" />
        </linearGradient>
        <filter
          id="softShadowFull"
          x="-10%"
          y="-10%"
          width="120%"
          height="125%"
        >
          <feDropShadow
            dx="0"
            dy="6"
            stdDeviation="8"
            floodColor="#0891B2"
            floodOpacity="0.22"
          />
        </filter>
      </defs>

      <g transform="translate(24, 20)">
        <rect
          width="120"
          height="120"
          rx="30"
          fill="url(#clinicGradFull)"
          filter="url(#softShadowFull)"
        />
        <rect
          x="1.5"
          y="1.5"
          width="117"
          height="117"
          rx="28.5"
          stroke="#FFFFFF"
          strokeOpacity="0.25"
          strokeWidth="1.5"
        />
        <path
          d="M 46 28 C 46 24.686 48.686 22 52 22 L 68 22 C 71.314 22 74 24.686 74 28 L 74 46 L 92 46 C 95.314 46 98 48.686 98 52 L 98 68 C 98 71.314 95.314 74 92 74 L 74 74 L 74 92 C 74 95.314 71.314 98 68 98 L 52 98 C 48.686 98 46 95.314 46 92 L 46 74 L 28 74 C 24.686 74 22 71.314 22 68 L 22 52 C 22 48.686 24.686 46 28 46 L 46 46 Z"
          fill="#FFFFFF"
        />
        <path
          d="M 26 60 L 44 60 L 52 42 L 60 76 L 68 52 L 74 64 L 78 60 L 94 60"
          stroke="#0891B2"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="68" cy="52" r="3" fill="#22C1C3" />
      </g>

      <g transform="translate(170, 36)">
        <text
          x="0"
          y="48"
          fontFamily="system-ui, -apple-system, 'Inter', 'Segoe UI', Roboto, sans-serif"
          fontSize="44"
          fontWeight="800"
          letterSpacing="-0.8"
          fill="#0F172A"
        >
          Clinica<tspan fill="#0F9F92">OS</tspan>
        </text>

        <text
          x="2"
          y="78"
          fontFamily="system-ui, -apple-system, 'Inter', 'Segoe UI', Roboto, sans-serif"
          fontSize="13"
          fontWeight="600"
          letterSpacing="2.8"
          fill="#64748B"
        >
          CLINICAL PRACTICE MANAGEMENT SYSTEM
        </text>

        <g transform="translate(254, 18)">
          <rect
            width="68"
            height="22"
            rx="11"
            fill="#E2E8F0"
            fillOpacity="0.7"
          />
          <text
            x="34"
            y="15"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="10.5"
            fontWeight="700"
            fill="#0891B2"
            textAnchor="middle"
            letterSpacing="0.8"
          >
            PRO
          </text>
        </g>
      </g>
    </svg>
  );
}
