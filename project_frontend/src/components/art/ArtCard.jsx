import { useNavigate } from "react-router-dom";
import ArtStatusBadge from "./ArtStatusBadge";

const ArtCard = ({ art }) => {
  const navigate = useNavigate();

  const goToDetail = () => {
    navigate(`/gallery/${art.slug}`);
  };

  return (
    <div
      onClick={goToDetail}
      className="cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-[#26231f] shadow hover:shadow-lg transition"
    >
      {/* IMAGE */}
      <div className="relative aspect-[4/3]">
        <img
          src={art.image?.url}
          alt={art.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-3 left-3">
          <ArtStatusBadge status={art.availabilityStatus} />
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-serif text-xl text-[#2b1e16] dark:text-[#f5efe6]">
            {art.title}
          </h3>

          {art.price && (
            <span className="text-lg font-medium text-[#5b3924]">
              ₹ {art.price}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-500">
          {art.artistName}
        </p>

        {/* DISPLAY LOCATION */}
        {art.displayLocation && (
          <span className="text-sm font-medium text-gray-600">
            {art.displayLocation}
          </span>
        )}

        {/* CTA */}
        <div className="pt-3">
          <span className="text-[#b08968] font-medium hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArtCard;
