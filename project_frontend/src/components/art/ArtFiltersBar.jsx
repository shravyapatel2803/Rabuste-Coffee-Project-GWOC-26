const ArtFiltersBar = ({ filters, moods = [], styles = [], onChange }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-10 flex flex-wrap gap-3">
      
      {/* MOOD FILTER */}
      <select
        value={filters.mood}
        onChange={(e) => onChange({ mood: e.target.value })}
        className="px-4 py-2 rounded-full border bg-white dark:bg-[#26231f]"
      >
        <option value="">All Moods</option>
        {moods.map((mood) => (
          <option key={mood} value={mood}>
            {mood}
          </option>
        ))}
      </select>

      {/* STYLE FILTER */}
      <select
        value={filters.style}
        onChange={(e) => onChange({ style: e.target.value })}
        className="px-4 py-2 rounded-full border bg-white dark:bg-[#26231f]"
      >
        <option value="">All Styles</option>
        {styles.map((style) => (
          <option key={style} value={style}>
            {style}
          </option>
        ))}
      </select>

      {/* AVAILABILITY */}
      <button
        onClick={() =>
          onChange({
            availabilityStatus:
              filters.availabilityStatus === "for-sale" ? "" : "for-sale",
          })
        }
        className={`px-5 py-2 rounded-full border transition
          ${
            filters.availabilityStatus === "for-sale"
              ? "bg-[#2b1e16] text-white"
              : "bg-[#e6d3b3] text-[#2b1e16]"
          }
        `}
      >
        For Sale
      </button>
    </div>
  );
};

export default ArtFiltersBar;
