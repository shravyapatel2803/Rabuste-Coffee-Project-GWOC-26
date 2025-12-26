import { ArrowLeft, X } from "lucide-react";

const AppliedFiltersBar = ({ filters, onClear, onRemove }) => {
  const activeFilters = Object.entries(filters).filter(
    ([, value]) =>
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !(Array.isArray(value) && value.length === 0)
  );

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex items-center gap-3 mt-4 px-4 py-2 bg-gray-50 border rounded-md">
      {/* CLEAR ALL */}
      <button
        onClick={onClear}
        className="flex items-center gap-1 text-sm font-semibold text-gray-700"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* FILTER CHIPS */}
      <div className="flex flex-wrap gap-2 ml-4">
        {activeFilters.map(([key, value]) => {
          const displayValue = Array.isArray(value)
            ? value.join(", ")
            : value === true
            ? "Yes"
            : value === false
            ? "No"
            : value;

          return (
            <span
              key={key}
              className="flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-800"
            >
              <span>
                {key.replace(/([A-Z])/g, " $1")} : {displayValue}
              </span>

              {/* remove single filter */}
              {onRemove && (
                <button
                  onClick={() => onRemove(key)}
                  className="hover:text-orange-900"
                >
                  <X size={14} />
                </button>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default AppliedFiltersBar;
