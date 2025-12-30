import ArtStatusBadge from "./ArtStatusBadge";

const ArtTable = ({ items, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 border-b">
          <tr>
            <th className="p-4 text-left">Artwork</th>
            <th className="text-left">Display Location</th>
            <th className="text-left">Status</th>
            <th className="text-right pr-6">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {items.length === 0 ? (
            <tr><td colSpan="4" className="p-8 text-center text-gray-400">No artworks found.</td></tr>
          ) : (
            items.map((item) => {
    
              let displayStatus = item.availabilityStatus || "available";
      
              if (item.visibility === "hidden") {
                displayStatus = "hidden";
              }

              return (
                <tr key={item._id} className="hover:bg-stone-50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <img src={item.image?.url} alt={item.title} className="w-12 h-12 rounded-lg bg-gray-200 object-cover border" />
                      <div>
                        <p className="font-semibold text-stone-800">{item.title}</p>
                        <p className="text-stone-500 text-xs">by {item.artistName}</p>
                      </div>
                    </div>
                  </td>

                  <td className="align-middle">
                    <span className="text-stone-700 font-medium">{item.displayLocation || "Storage"}</span>
                  </td>

                  <td className="align-middle">
                    <ArtStatusBadge status={displayStatus} />
                  </td>

                  <td className="pr-6 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onView(item)} className="p-1 hover:bg-gray-100 rounded">👁</button>
                      <button onClick={() => onEdit(item)} className="p-1 hover:bg-gray-100 rounded">✏️</button>
                      <button onClick={() => onDelete(item)} className="p-1 hover:bg-red-50 text-red-600 rounded">🗑</button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ArtTable;