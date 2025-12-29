import { useNavigate } from "react-router-dom";

const ArtNavigation = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex justify-between items-center">
      
      {/* BACK TO GALLERY */}
      <button
        onClick={() => navigate("/art")}
        className="px-5 py-2 rounded border hover:bg-gray-50 dark:hover:bg-[#2a241f]"
      >
        View All Art
      </button>

      {/* NEXT ART (FUTURE) */}
      <button
        disabled
        className="
          px-6 py-2 rounded
          bg-[#8b5e3c] text-white
          opacity-50 cursor-not-allowed
        "
        title="Coming soon"
      >
        Next Artwork →
      </button>
    </div>
  );
};

export default ArtNavigation;
