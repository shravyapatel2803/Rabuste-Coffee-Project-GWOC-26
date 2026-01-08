import { useEffect, useState } from "react";
import { fetchAdminItemById } from "../../api/Items"; 

const AdminArtPreview = ({ item, onClose, onEdit }) => {
  const [pairedCoffee, setPairedCoffee] = useState(null);
  const [loadingCoffee, setLoadingCoffee] = useState(false);

  useEffect(() => {
    const coffeeId = item?.bestPairedCoffee || item?.pairedCoffeeId;

    if (coffeeId) {
      if (typeof coffeeId === "object" && coffeeId._id) {
        setPairedCoffee(coffeeId);
      } else {
        setLoadingCoffee(true);
        fetchAdminItemById(coffeeId)
          .then((res) => setPairedCoffee(res.data))
          .catch((err) => console.error("Failed to load paired coffee", err))
          .finally(() => setLoadingCoffee(false));
      }
    } else {
      setPairedCoffee(null);
    }
  }, [item]);


  if (!item) return null;

  const badge = (text, color) => (
    <span key={text} className={`px-3 py-1 text-xs rounded-full font-semibold border ${color}`}>
      {text}
    </span>
  );

  const chip = (text, key) => (
    <span key={key} className="px-2 py-1 text-xs rounded-md bg-stone-100 text-stone-700 border border-stone-200">
      {text}
    </span>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white max-w-3xl w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        <div className="px-6 py-4 border-b flex justify-between items-start bg-stone-50">
          <div>
            <h2 className="text-xl font-bold text-stone-800">{item.title}</h2>
            <p className="text-sm text-stone-500 font-medium">by {item.artistName}</p>

            <div className="flex gap-2 mt-3 flex-wrap">
              {item.visibility === "public"
                ? badge("Public", "bg-green-50 text-green-700 border-green-200")
                : badge("Hidden", "bg-gray-100 text-gray-600 border-gray-200")}

              {(item.availabilityStatus === "available" || item.status === "available") && badge("Available", "bg-blue-50 text-blue-700 border-blue-200")}
              {(item.availabilityStatus === "sold" || item.status === "sold") && badge("Sold Out", "bg-red-50 text-red-700 border-red-200")}
              {(item.availabilityStatus === "not-for-sale" || item.status === "not_for_sale") && badge("Not For Sale", "bg-purple-50 text-purple-700 border-purple-200")}

              {(item.isCurrentlyDisplayed || item.isDisplayed) && badge("On Display", "bg-teal-50 text-teal-700 border-teal-200")}
            </div>
          </div>

          <button onClick={onClose} className="text-2xl text-stone-400 hover:text-stone-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-200 transition">×</button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto">

          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shadow-inner">
                {item.image?.url ? (
                  <img src={item.image.url} alt={item.imageAlt || item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-stone-400">
                    <span>🖼️</span><span className="text-xs mt-2">No Image</span>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full md:w-1/2 space-y-5">
              
              <div className="border-b border-stone-100 pb-4">
                <p className="text-3xl font-bold text-stone-800">
                  {item.availabilityStatus === "not-for-sale" ? "N/A" : `₹ ${item.price}`}
                </p>
                <p className="text-stone-500 mt-1 text-sm uppercase tracking-wide font-semibold">
                  {item.medium} • {item.artStyle || item.style}
                </p>
              </div>

              <div className="bg-stone-50 p-4 rounded-lg border border-stone-100 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Framed:</span>
                  <span className="font-medium text-stone-800">{item.framed || item.isFramed ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Dimensions:</span>
                  <span className="font-medium text-stone-800">
                    {item.dimensions?.width ? `${item.dimensions.width} x ${item.dimensions.height} cm` : "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Location:</span>
                  <span className="font-medium text-stone-800">{item.displayLocation || item.location || "Storage"}</span>
                </div>
              </div>

              {(item.bestPairedCoffee || item.pairedCoffeeId) && (
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 flex gap-3 items-center">
                  
                  {loadingCoffee ? (
                     <div className="text-xs text-orange-800 p-2">Loading pairing...</div>
                  ) : pairedCoffee ? (
                    <>
                      <div className="w-14 h-14 rounded-md bg-white border border-orange-200 overflow-hidden shrink-0">
                        {pairedCoffee.image?.url ? (
                          <img src={pairedCoffee.image.url} alt={pairedCoffee.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">☕</div>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-[10px] font-bold text-orange-800 uppercase tracking-wider mb-0.5">Suggested Pairing</p>
                        <p className="text-sm font-bold text-stone-800 leading-tight">{pairedCoffee.name}</p>
                        <p className="text-xs text-stone-600 mt-0.5">
                           {pairedCoffee.roastType && <span className="capitalize">{pairedCoffee.roastType} Roast</span>}
                           {pairedCoffee.roastType && pairedCoffee.strengthLevel && " • "}
                           {pairedCoffee.strengthLevel && `Strength: ${pairedCoffee.strengthLevel}/5`}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-red-400 p-2">Paired coffee info unavailable</div>
                  )}

                </div>
              )}
            </div>
          </div>

          {/* Description & Story */}
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-stone-800 mb-2 border-b pb-1">Description</h3>
              <p className="text-stone-600 leading-relaxed text-sm">
                {item.description || "No description provided."}
              </p>
            </div>

            {(item.storyBehindArt || item.story) && (
              <div>
                <h3 className="font-bold text-stone-800 mb-2 border-b pb-1">The Story Behind</h3>
                <p className="text-stone-600 italic text-sm leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-100">
                  "{item.storyBehindArt || item.story}"
                </p>
              </div>
            )}

            {item.artistBio && (
              <div>
                <h3 className="font-bold text-stone-800 mb-2 border-b pb-1">About the Artist</h3>
                <p className="text-stone-600 text-sm">{item.artistBio}</p>
              </div>
            )}
          </div>

          {/* Art Moods */}
          {(item.artMood || item.moods)?.length > 0 && (
            <div>
              <h3 className="font-bold text-stone-800 mb-3 text-sm uppercase">Art Moods</h3>
              <div className="flex gap-2 flex-wrap">
                {(item.artMood || item.moods).map((mood, i) => chip(mood, `mood-${i}`))}
              </div>
            </div>
          )}

        </div>

        <div className="px-6 py-4 border-t bg-stone-50 flex justify-end gap-3">
          <button onClick={onEdit} className="px-6 py-2 rounded-lg border border-stone-300 hover:bg-white hover:shadow-sm text-stone-700 font-medium transition">Edit Artwork</button>
          <button onClick={onClose} className="px-6 py-2 rounded-lg bg-stone-800 text-white hover:bg-stone-900 shadow-md transition">Close</button>
        </div>

      </div>
    </div>
  );
};

export default AdminArtPreview;