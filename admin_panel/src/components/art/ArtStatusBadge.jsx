const ArtStatusBadge = ({ status }) => {
  const normalizedStatus = status
    ? status.toLowerCase().replace(/[\s-]+/g, "_")
    : "available";

  const config = {
    available: {
      label: "Available",
      className: "bg-green-50 text-green-700 border border-green-200",
      icon: "●",
    },

    sold: {
      label: "Sold Out",
      className: "bg-red-50 text-red-700 border border-red-200",
      icon: "×",
    },

    sold_out: {
      label: "Sold Out",
      className: "bg-red-50 text-red-700 border border-red-200",
      icon: "×",
    },
    soldout: {
      label: "Sold Out",
      className: "bg-red-50 text-red-700 border border-red-200",
      icon: "×",
    },

    not_for_sale: {
      label: "Not For Sale",
      className: "bg-purple-50 text-purple-700 border border-purple-200",
      icon: "🔒",
    },
 
    hidden: {
      label: "Hidden",
      className: "bg-gray-100 text-gray-600 border border-gray-200",
      icon: "👁️‍🗨️",
    },
  };

  const current = config[normalizedStatus] || config.available;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${current.className}`}
    >
      <span className="text-[10px]">{current.icon}</span>
      {current.label}
    </span>
  );
};

export default ArtStatusBadge;