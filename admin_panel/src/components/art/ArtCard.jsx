import ArtStatusBadge from "./ArtStatusBadge";

const ArtCard = ({
  item,
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) => {
  let displayStatus = item.status || "available";
  if (item.visibility === "hidden") {
    displayStatus = "hidden";
  }

  return (
    <div className="bg-white border rounded-xl p-3 flex gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden shrink-0 border border-gray-100">
        {item.image?.url ? (
          <img
            src={item.image.url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
            No Img
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-stone-800 truncate">
          {item.title}
        </p>

        <p className="text-xs text-stone-500 truncate">
          {item.status === "not_for_sale" ? "N/A" : `₹ ${item.price}`} · by {item.artistName}
        </p>

        <div className="mt-2 flex flex-wrap gap-1">
          <ArtStatusBadge status={displayStatus} />
          
          {item.isDisplayed && (
            <span className="text-[10px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded border border-teal-100 font-bold">
              On Display
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-center gap-3 text-lg pl-2 border-l border-gray-100">
        <button
          title="Preview"
          onClick={() => onView(item)}
          className="text-stone-400 hover:text-stone-700 transition-colors"
        >
          👁
        </button>

        <button
          title="Edit"
          onClick={() => onEdit(item)}
          className="text-stone-400 hover:text-orange-600 transition-colors"
        >
          ✏️
        </button>

        <button
          title="Delete"
          className="text-red-400 hover:text-red-600 transition-colors"
          onClick={() => onDelete(item)}
        >
          🗑
        </button>
      </div>
    </div>
  );
};

export default ArtCard;