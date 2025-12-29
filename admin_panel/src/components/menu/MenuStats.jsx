import StatCard from "./StatCard";

const MenuStats = ({ stats }) => {
  return (
    <div
      className="
        grid grid-cols-2 gap-3
        sm:grid-cols-4 sm:gap-4
      "
    >
      <StatCard
        title="Total Items"
        value={stats.total}
        color="bg-blue-600"
      />

      <StatCard
        title="Available"
        value={stats.available}
        color="bg-green-600"
      />

      <StatCard
        title="Sold Out"
        value={stats.soldOut}
        color="bg-red-600"
      />

      <StatCard
        title="Featured"
        value={stats.featured}
        color="bg-orange-500"
      />
    </div>
  );
};

export default MenuStats;
