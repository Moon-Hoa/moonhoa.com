export function CardGrid({
  children,
  minWidth = 220,
  className = "",
  style,
}: {
  children: React.ReactNode;
  minWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`card-grid ${className}`.trim()}
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}px, 1fr))`, ...style }}
    >
      {children}
    </div>
  );
}

export function Card({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`card ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
