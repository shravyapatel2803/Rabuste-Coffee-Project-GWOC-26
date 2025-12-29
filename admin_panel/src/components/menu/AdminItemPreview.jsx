const AdminItemPreview = ({ item, onClose, onEdit }) => {
  if (!item) return null;

  const badge = (text, color) => (
    <span
      key={text}
      className={`px-3 py-1 text-xs rounded-full font-semibold ${color}`}
    >
      {text}
    </span>
  );

  const chip = (text, key) => (
    <span
      key={key}
      className="px-2 py-1 text-xs rounded-md bg-stone-100 text-stone-700"
    >
      {text}
    </span>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white max-w-3xl w-full rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-stone-800">
              {item.name}
            </h2>

            <div className="flex gap-2 mt-2 flex-wrap">
              {item.visibility === "public"
                ? badge("Public", "bg-green-100 text-green-700")
                : badge("Hidden", "bg-stone-200 text-stone-600")}

              {item.availability?.isSoldOut &&
                badge("Sold Out", "bg-red-100 text-red-700")}

              {item.isFeatured &&
                badge("Featured", "bg-orange-100 text-orange-700")}
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-2xl text-stone-400 hover:text-stone-700"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Image */}
          <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-stone-100">
            {item.image?.url ? (
              <img
                src={item.image.url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-stone-400">
                No Image
              </div>
            )}
          </div>

          {/* Price + Category */}
          <div>
            <p className="text-2xl font-bold text-stone-800">
              ₹ {item.price}
            </p>
            <p className="text-sm text-stone-500 mt-1">
              {item.category} · {item.type}
            </p>
          </div>

          {/* Descriptions */}
          {item.shortDescription && (
            <p className="text-stone-600 italic">
              {item.shortDescription}
            </p>
          )}

          <p className="text-stone-700">
            {item.description}
          </p>

          {/* Coffee Profile */}
          {(item.roastType ||
            item.strengthLevel ||
            item.bitterness ||
            item.caffeineLevel) && (
            <div>
              <h3 className="font-bold text-stone-800 mb-2">
                Coffee Profile
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                {item.roastType && (
                  <div>☕ Roast: <b>{item.roastType}</b></div>
                )}
                {item.strengthLevel && (
                  <div>💪 Strength: {item.strengthLevel}/5</div>
                )}
                {item.bitterness && (
                  <div>🌰 Bitterness: {item.bitterness}/5</div>
                )}
                {item.caffeineLevel && (
                  <div>⚡ Caffeine: {item.caffeineLevel}/5</div>
                )}
                <div>
                  🥛 Milk Based: {item.milkBased ? "Yes" : "No"}
                </div>
              </div>
            </div>
          )}

          {/* AI Classification */}
          {(item.flavorNotes?.length ||
            item.bestForMood?.length ||
            item.bestTime?.length ||
            item.tags?.length) && (
            <div>
              <h3 className="font-bold text-stone-800 mb-2">
                AI Classification
              </h3>

              <div className="space-y-3">
                {item.flavorNotes?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold mb-1">
                      Flavor Notes
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {item.flavorNotes.map((v, i) =>
                        chip(v, `flavor-${i}`)
                      )}
                    </div>
                  </div>
                )}

                {item.bestForMood?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold mb-1">
                      Best For Mood
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {item.bestForMood.map((v, i) =>
                        chip(v, `mood-${i}`)
                      )}
                    </div>
                  </div>
                )}

                {item.bestTime?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold mb-1">
                      Best Time
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {item.bestTime.map((v, i) =>
                        chip(v, `time-${i}`)
                      )}
                    </div>
                  </div>
                )}

                {item.tags?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold mb-1">
                      Search Tags
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {item.tags.map((v, i) =>
                        chip(v, `tag-${i}`)
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Art Pairing */}
          {(item.artPairedMood ||
            item.artPairingExplanation) && (
            <div>
              <h3 className="font-bold text-stone-800 mb-2">
                Art Pairing
              </h3>

              {item.artPairedMood && (
                <p><b>Mood:</b> {item.artPairedMood}</p>
              )}

              {item.artPairingExplanation && (
                <p className="text-stone-600 mt-1">
                  {item.artPairingExplanation}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={onEdit}
            className="px-5 py-2 rounded-lg border border-stone-300 hover:bg-stone-50"
          >
            Edit Item
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-stone-800 text-white"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminItemPreview;
