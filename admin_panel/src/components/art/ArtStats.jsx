import StatCard from "../menu/StatCard";

const ArtStats = ({ stats }) => {
  const { total = 0, available = 0, sold = 0, displayed = 0 } = stats || {};

  return (
    <div
      className="
        grid grid-cols-2 gap-3
        sm:grid-cols-4 sm:gap-4
      "
    >
      <StatCard
        title="Total Artworks"
        value={total}
        color="bg-indigo-600" 
      />

      <StatCard
        title="Available"
        value={available}
        color="bg-green-600"
      />

      <StatCard
        title="Sold"
        value={sold}
        color="bg-red-600"
      />

      <StatCard
        title="On Display"
        value={displayed}
        color="bg-teal-600" 
      />
    </div>
  );
};

export default ArtStats;