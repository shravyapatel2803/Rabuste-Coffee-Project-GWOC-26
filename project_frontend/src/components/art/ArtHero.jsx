const ArtHero = ({ art }) => {
  const isForSale = art.availabilityStatus === "for-sale";

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10 grid lg:grid-cols-2 gap-10">
      
      {/* IMAGE */}
      <img
        src={art.image?.url}
        alt={art.image?.alt || art.title}
        className="rounded-xl shadow-lg w-full object-cover"
      />

      {/* INFO */}
      <div className="space-y-4">
        <h1 className="font-serif text-4xl">{art.title}</h1>

        {/* PRICE */}
        {isForSale && art.price && (
          <p className="text-2xl font-medium">₹ {art.price}</p>
        )}

        {/* MEDIUM + STYLE */}
        <p className="text-sm text-gray-500">
          {art.medium}
          {art.artStyle && ` · ${art.artStyle}`}
        </p>

        {/* DIMENSIONS + FRAME */}
        {(art.dimensions?.width || art.dimensions?.height) && (
          <p className="text-sm">
            {art.dimensions?.width && `${art.dimensions.width}cm`}
            {art.dimensions?.width && art.dimensions?.height && " × "}
            {art.dimensions?.height && `${art.dimensions.height}cm`}
            {art.framed !== undefined &&
              ` · ${art.framed ? "Framed" : "Unframed"}`}
          </p>
        )}

        {/* AVAILABILITY STATUS */}
        <p className="text-sm flex items-center gap-2">
          <span
            className={`● ${
              isForSale
                ? "text-green-600"
                : art.availabilityStatus === "sold"
                ? "text-red-500"
                : "text-gray-400"
            }`}
          />
          {isForSale
            ? "Available for Sale"
            : art.availabilityStatus === "sold"
            ? "Sold"
            : "Not for Sale"}
        </p>

        {/* CTA */}
        {isForSale && (
          <button className="mt-4 bg-[#8b5e3c] hover:bg-[#73492d] text-white px-6 py-3 rounded-lg">
            Inquire About Purchase
          </button>
        )}
      </div>
    </div>
  );
};

export default ArtHero;
