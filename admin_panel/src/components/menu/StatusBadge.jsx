const StatusBadge = ({ status = "available" }) => {
  const styles = {
    available: "bg-green-100 text-green-700",
    soldout: "bg-orange-100 text-orange-700",
    hidden: "bg-gray-200 text-gray-600",
  };

  const labels = {
    available: "Available",
    soldout: "Sold Out",
    hidden: "Hidden",
  };

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
        styles[status] || styles.available
      }`}
    >
      {labels[status] || labels.available}
    </span>
  );
};

export default StatusBadge;
