export default function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${className}`}
    >
      {children}
    </div>
  );
}