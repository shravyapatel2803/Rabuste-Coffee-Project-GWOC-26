import StatusBadge from "./StatusBadge";

const MenuCard = ({
  item,
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) => {
  // derive status from backend fields
  let status = "available";

  if (item.visibility === "hidden") {
    status = "hidden";
  } else if (item.availability?.isSoldOut) {
    status = "soldout";
  }

  return (
    <div className="bg-white border rounded-xl p-3 flex gap-3">
      <img
        src={item.image?.url || "/placeholder.png"}
        alt={item.name}
        className="w-16 h-16 rounded-lg object-cover"
      />

      <div className="flex-1">
        <p className="font-medium text-stone-800">
          {item.name}
        </p>

        <p className="text-xs text-stone-500">
          ₹ {item.price} · {item.category} · {item.type}
        </p>

        <div className="mt-1">
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="flex flex-col gap-2 text-lg">
        <button
          title="Preview"
          onClick={() => onView(item)}
        >
          👁
        </button>

        <button
          title="Edit"
          onClick={() => onEdit(item)}
        >
          ✏️
        </button>

        <button
          title="Delete"
          className="text-red-600"
          onClick={() => onDelete(item)}
        >
          🗑
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
