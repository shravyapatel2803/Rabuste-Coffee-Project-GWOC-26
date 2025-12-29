import { Pencil, Trash } from "lucide-react";
import { deleteAdminArt } from "../api/adminArt";

const ArtRow = ({ art, onEdit }) => {
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${art.title}"?`
    );
    if (!confirmDelete) return;

    try {
      await deleteAdminArt(art._id);
      window.location.reload();
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete artwork. Try again.");
    }
  };

  return (
    <tr className="border-b last:border-b-0 hover:bg-gray-50 transition">
      {/* ART */}
      <td className="p-3">
        <div className="flex gap-3 items-center">
          <img
            src={art.image?.url}
            alt={art.image?.alt || art.title}
            className="w-16 h-12 sm:w-20 sm:h-14 rounded object-cover border"
          />

          <div className="min-w-0">
              {art.title}
          </div>
        </div>
      </td>

      {/* ARTIST */}
      <td className="p-3">
        {art.artistName || "—"}
      </td>

      {/* STATUS */}
      <td className="p-3">
        <span
          className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
            art.availabilityStatus === "available"
              ? "bg-green-100 text-green-700"
              : art.availabilityStatus === "sold"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {art.availabilityStatus}
        </span>
      </td>

      {/* VISIBILITY  */}
      <td className="p-3">
        <span className="text-sm whitespace-nowrap">
          {art.visibility}
        </span>
      </td>

      {/* PRICE */}
      <td className="p-3">
        <span className="text-sm whitespace-nowrap">
          {art.price ? `₹${art.price}` : "—"}
        </span>
      </td>

      {/* ACTIONS */}
      <td className="p-3 text-right">
        <div className="flex justify-end gap-3">
          <button
            onClick={() => onEdit(art._id)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit artwork"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800"
            title="Delete artwork"
          >
            <Trash size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ArtRow;
