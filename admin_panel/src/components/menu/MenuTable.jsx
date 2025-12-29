import StatusBadge from "./StatusBadge";

const MenuTable = ({
  items,
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) => {
  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="p-4 text-left">Item</th>
            <th className="text-left">Category</th>
            <th className="text-left">Type</th>
            <th className="text-left">Status</th>
            <th className="text-right pr-6">Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => {
            let status = "available";

            if (item.visibility === "hidden") {
              status = "hidden";
            } else if (item.availability?.isSoldOut) {
              status = "soldout";
            }

            return (
              <tr
                key={item._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 flex items-center gap-4">
                  <img
                    src={item.image?.url || "/placeholder.png"}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-stone-800">
                      {item.name}
                    </p>
                    <p className="text-stone-500 text-xs">
                      ₹ {item.price}/-
                    </p>
                  </div>
                </td>

                <td>{item.category}</td>
                <td>{item.type}</td>

                <td>
                  <StatusBadge status={status} />
                </td>

                <td className="pr-6">
                  <div className="flex justify-end gap-2">
                    <IconBtn onClick={() => onView(item)}>👁</IconBtn>
                    <IconBtn onClick={() => onEdit(item)}>✏️</IconBtn>
                    <IconBtn danger onClick={() => onDelete(item)}>
                      🗑
                    </IconBtn>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const IconBtn = ({ children, danger, ...props }) => (
  <button
    {...props}
    className={`border rounded-lg px-3 py-1 text-sm transition ${
      danger
        ? "text-red-600 hover:bg-red-50"
        : "hover:bg-gray-100"
    }`}
  >
    {children}
  </button>
);

export default MenuTable;
