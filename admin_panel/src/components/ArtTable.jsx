import ArtRow from "./ArtRow";

const ArtTable = ({
  arts,
  hasMore,
  loading,
  loadMore,
  onEdit,
}) => {
  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] sm:min-w-full text-left">
          <thead className="bg-gray-100 text-xs sm:text-sm text-gray-700">
            <tr>
              <th className="p-3">Artwork</th>
              <th className="p-3">Artist</th>
              <th className="p-3">Status</th>
              <th className="p-3">Visibility</th>
              <th className="p-3">Price</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {arts.length === 0 && !loading && (
              <tr>
                <td
                  colSpan="6"
                  className="p-6 text-center text-gray-500"
                >
                  No artworks found
                </td>
              </tr>
            )}

            {arts.map((art) => (
              <ArtRow
                key={art._id}
                art={art}
                onEdit={onEdit}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* LOAD MORE */}
      {hasMore && (
        <div className="p-4 flex justify-center border-t">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-5 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ArtTable;
