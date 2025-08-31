export function Switch({ checked, onChange }) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 ${checked ? "bg-green-500" : ""}`}>
        <span className={`bg-white w-4 h-4 rounded-full shadow transform duration-300 ${checked ? "translate-x-5" : ""}`} />
      </span>
    </label>
  );
}
