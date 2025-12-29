import { Instagram, Globe } from "lucide-react";

const ArtistCard = ({ artist }) => {
  if (!artist?.name) return null;

  return (
    <div
      className="
        rounded-xl
        p-6 sm:p-7
        bg-white dark:bg-[#2a241f]
        border border-[#e7ddd3] dark:border-[#3a312a]
        flex gap-5
      "
    >
      {/* AVATAR (Initial based) */}
      <div className="flex-shrink-0">
        <div
          className="
            w-16 h-16 sm:w-20 sm:h-20
            rounded-full
            flex items-center justify-center
            bg-[#e7ddd3] dark:bg-[#3a312a]
            text-lg font-semibold
          "
        >
          {artist.name.charAt(0)}
        </div>
      </div>

      {/* INFO */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold">
          {artist.name}
        </h3>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {artist.bio || "Artist bio not available."}
        </p>

        {/* LINKS */}
        <div className="mt-4 flex gap-4">
          {artist.instagram && (
            <a
              href={artist.instagram}
              target="_blank"
              rel="noreferrer"
              className="
                flex items-center gap-1 text-sm
                text-[#7b4f2c] hover:underline
              "
            >
              <Instagram size={16} />
              Instagram
            </a>
          )}

          {artist.website && (
            <a
              href={artist.website}
              target="_blank"
              rel="noreferrer"
              className="
                flex items-center gap-1 text-sm
                text-[#7b4f2c] hover:underline
              "
            >
              <Globe size={16} />
              Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
