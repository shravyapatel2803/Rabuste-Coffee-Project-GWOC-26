const ArtStats = ({ arts = [], onAdd }) => {
  const total = arts.length;
  const featured = arts.filter(a => a.isFeatured).length;
  const displayed = arts.filter(a => a.isCurrentlyDisplayed).length;
  const sold = arts.filter(a => a.availabilityStatus === "sold").length;

  const stats = [
    {
      label: "Total Artworks",
      value: total,
      color: "bg-blue-600",
    },
    {
      label: "Featured Artworks",
      value: featured,
      color: "bg-orange-500",
    },
    {
      label: "Currently Displayed",
      value: displayed,
      color: "bg-green-600",
    },
    {
      label: "Sold Artworks",
      value: sold,
      color: "bg-red-600",
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold">
          Art Overview
        </h2>

        <button
          onClick={onAdd}
          className="
            bg-blue-600 text-white
            px-4 py-2 rounded-lg
            text-sm font-medium
            w-full sm:w-auto
            hover:bg-blue-700
          "
        >
          + Add Artwork
        </button>
      </div>

      <div
        className="
          grid grid-cols-2 gap-3
          sm:grid-cols-4 sm:gap-4
        "
      >
        {stats.map(stat => (
          <div
            key={stat.label}
            className={`
              ${stat.color}
              text-white
              rounded-xl
              p-4
              flex flex-col
              items-center justify-center
              text-center
            `}
          >
            <div className="text-2xl font-bold">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm opacity-90 mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtStats;
