export default function Ornament({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div className="ornament" style={style}>
      <span className="ornament-center">{children}</span>
    </div>
  );
}
