const ArtStatusBadge = ({ status }) => {
  if (!status) return null;

  const map = {
    "for-sale": "bg-green-100 text-green-700",
    sold: "bg-gray-200 text-gray-700",
    "not-for-sale": "bg-orange-100 text-orange-700",
  };

  const labelMap = {
    "for-sale": "For Sale",
    sold: "Sold",
    "not-for-sale": "Not for Sale",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {labelMap[status] || status}
    </span>
  );
};

export default ArtStatusBadge;
