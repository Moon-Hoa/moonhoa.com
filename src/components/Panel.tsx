import Link from "next/link";

export function Panel({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`panel ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}

// Column layout per row type (grid-template-columns, or a flex layout for
// lot-detail-row) is declared in globals.css keyed off `className`, not
// passed as an inline style — that way each row type's own responsive
// media-query overrides still take effect (inline styles would otherwise
// always beat a stylesheet rule, breakpoints included).
export function PanelRow({
  children,
  href,
  className = "",
  style,
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const cls = `panel-row ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={cls} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <div className={cls} style={style}>
      {children}
    </div>
  );
}
