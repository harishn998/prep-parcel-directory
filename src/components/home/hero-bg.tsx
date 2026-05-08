/**
 * Logistics-network background for the homepage hero.
 *
 * Pure SVG (no Framer Motion, no canvas). Two concerns:
 *   1. A soft navy radial wash provides depth.
 *   2. An asymmetric "warehouse network" graph: nodes + connecting lines,
 *      a few pulsing, one accent dot flowing along a path.
 *
 * Mobile renders a 4-node subset and skips the flowing dot to save battery.
 * `prefers-reduced-motion` disables SMIL animations via CSS in globals.css
 * (see `.hero-bg-svg animate, .hero-bg-svg animateMotion { display: none; }`).
 */
export function HeroBg() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Soft radial gradient wash for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, rgba(12, 30, 62, 0.08) 0%, transparent 72%)",
        }}
      />

      {/* Network graph */}
      <svg
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        className="hero-bg-svg absolute inset-0 h-full w-full text-blue opacity-60"
      >
        {/* Connecting lines — 1px, currentColor, ~8% opacity */}
        <g stroke="currentColor" strokeWidth="1" opacity="0.08">
          {/* Mobile-visible spine: 1 ↔ 4 ↔ 7 ↔ 6 */}
          <line x1="120" y1="130" x2="570" y2="110" />
          <line x1="570" y1="110" x2="380" y2="480" />
          <line x1="380" y1="480" x2="860" y2="180" />

          {/* Desktop-only extra connections */}
          <g className="hidden md:[display:inline]">
            <line x1="120" y1="130" x2="430" y2="220" />
            <line x1="430" y1="220" x2="260" y2="380" />
            <line x1="430" y1="220" x2="570" y2="110" />
            <line x1="570" y1="110" x2="710" y2="320" />
            <line x1="710" y1="320" x2="860" y2="180" />
            <line x1="710" y1="320" x2="770" y2="490" />
            <line x1="260" y1="380" x2="380" y2="480" />
            <line x1="380" y1="480" x2="770" y2="490" />
          </g>
        </g>

        {/* Nodes */}
        <g fill="currentColor">
          {/* Pulsing — staggered begin times so they don't sync up */}
          <circle cx="120" cy="130" r="4" opacity="0.15">
            <animate
              attributeName="r"
              values="4;8;4"
              dur="3s"
              begin="0s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="570" cy="110" r="4" opacity="0.15">
            <animate
              attributeName="r"
              values="4;8;4"
              dur="3s"
              begin="1s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="380" cy="480" r="4" opacity="0.15">
            <animate
              attributeName="r"
              values="4;8;4"
              dur="3s"
              begin="2s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Static, mobile-visible */}
          <circle cx="860" cy="180" r="4" opacity="0.15" />

          {/* Static, desktop-only */}
          <g className="hidden md:[display:inline]">
            <circle cx="430" cy="220" r="4" opacity="0.15" />
            <circle cx="260" cy="380" r="4" opacity="0.15" />
            <circle cx="710" cy="320" r="4" opacity="0.15" />
            <circle cx="770" cy="490" r="4" opacity="0.15" />
          </g>
        </g>

        {/* Flowing accent dot — desktop only, traverses the upper spine */}
        <g className="hidden md:[display:inline]">
          <path
            id="hero-flow-path"
            d="M 120 130 L 430 220 L 570 110 L 710 320 L 860 180"
            fill="none"
            stroke="none"
          />
          <circle r="3" fill="#f59e0b" opacity="0.4">
            <animateMotion
              dur="11s"
              repeatCount="indefinite"
              rotate="auto"
            >
              <mpath href="#hero-flow-path" />
            </animateMotion>
          </circle>
        </g>
      </svg>
    </div>
  );
}
