import ArtStatusBadge from "./ArtStatusBadge";

const ArtInfoPanel = ({ art }) => {
  const isForSale = art.availabilityStatus === "for-sale";

  return (
    <div
      className="
        rounded-xl
        p-6 sm:p-8
        bg-white dark:bg-[#2a241f]
        border border-[#e7ddd3] dark:border-[#3a312a]
      "
    >
      {/* TITLE */}
      <h1
        className="
          text-2xl sm:text-3xl font-semibold
          tracking-tight
        "
      >
        {art.title}
      </h1>

      {/* ARTIST */}
      {art.artistName && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          by <span className="font-medium">{art.artistName}</span>
        </p>
      )}

      {/* META INFO */}
      <div
        className="
          mt-6
          grid grid-cols-1 sm:grid-cols-2
          gap-4
        "
      >
        <InfoItem label="Medium" value={art.medium} />
        <InfoItem label="Style" value={art.artStyle} />
        <InfoItem label="Display Location" value={art.displayLocation} />

        <InfoItem
          label="Price"
          value={
            isForSale && art.price
              ? `₹ ${art.price}`
              : "Not for sale"
          }
        />
      </div>

      {/* STATUS */}
      <div className="mt-6 flex flex-wrap gap-3">
        <ArtStatusBadge status={art.availabilityStatus} />
      </div>
    </div>
  );
};

/* ============================
   SMALL REUSABLE INFO BLOCK
============================ */
const InfoItem = ({ label, value }) => (
  <div>
    <div className="text-xs uppercase tracking-wide text-gray-500">
      {label}
    </div>
    <div className="mt-1 text-sm font-medium">
      {value || "—"}
    </div>
  </div>
);

export default ArtInfoPanel;
