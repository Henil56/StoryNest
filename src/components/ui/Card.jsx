export default function Card({ children, className = "", hoverable = false }) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface-elevated shadow-sm transition-all duration-300 ${hoverable ? 'hover:shadow-lg hover:-translate-y-1' : 'hover:shadow-md'} ${className}`}
    >
      {children}
    </div>
  );
}