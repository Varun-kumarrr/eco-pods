export function Badge({ children, className = "" }) {
  return (
    <span
      className={`px-2 py-1 text-xs rounded-full bg-green-200 text-green-800 ${className}`}
    >
      {children}
    </span>
  );
}
