export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-2xl bg-green-600 text-white hover:bg-green-700 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
