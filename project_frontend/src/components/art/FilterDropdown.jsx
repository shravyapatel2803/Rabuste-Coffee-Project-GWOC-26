const FilterDropdown = ({ label, value, options = [], onChange }) => {
  if (!Array.isArray(options)) return null;

  return (
    <div className="flex flex-col gap-1 w-full sm:w-auto">
      <label className="text-xs text-gray-500 dark:text-gray-400">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          border rounded-md px-3 py-2 text-sm
          bg-white dark:bg-[#241f1a]
          border-[#d8cfc6] dark:border-[#3a312a]
          text-[#3e2f22] dark:text-[#e5d8cc]
        "
      >
        <option value="">All</option>

        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterDropdown;
