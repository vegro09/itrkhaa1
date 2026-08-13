export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <svg
        className="drift-slow absolute -left-1/4 top-0 h-[120vh] w-[150vw] opacity-[0.03]"
        viewBox="0 0 800 600"
        preserveAspectRatio="none"
      >
        <path
          d="M0,300 C150,180 300,420 450,300 C600,180 700,380 800,300 L800,600 L0,600 Z"
          fill="var(--maroon)"
        />
      </svg>
      <svg
        className="drift-slower absolute -right-1/4 bottom-0 h-[110vh] w-[150vw] opacity-[0.03]"
        viewBox="0 0 800 600"
        preserveAspectRatio="none"
      >
        <path
          d="M0,380 C200,260 320,480 520,360 C660,280 720,420 800,360 L800,600 L0,600 Z"
          fill="var(--cherry-red)"
        />
      </svg>
    </div>
  );
}

export function PixelHeart({ filled = true, size = 26 }: { filled?: boolean; size?: number }) {
  // 11x10 pixel-art heart grid (Minecraft style), rendered as crisp squares.
  const rows = ["01100110", "11111111", "11111111", "11111111", "01111110", "00111100", "00011000"];
  const cols = 8;
  const unit = size / cols;
  return (
    <svg
      width={size}
      height={size * (rows.length / cols)}
      viewBox={`0 0 ${cols} ${rows.length}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={filled ? "life" : "lost life"}
    >
      {rows.map((row, y) =>
        row
          .split("")
          .map((cell, x) =>
            cell === "1" ? (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width={1}
                height={1}
                fill={filled ? "var(--cherry-red)" : "var(--noir-black)"}
                opacity={filled ? 1 : 0.12}
              />
            ) : null,
          ),
      )}
      <rect x={0} y={0} width={0} height={0} fill="none" data-unit={unit} />
    </svg>
  );
}
