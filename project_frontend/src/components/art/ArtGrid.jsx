import { useEffect, useRef } from "react";
import ArtCard from "./ArtCard";

const ArtGrid = ({ arts = [], loading, hasMore, onLoadMore }) => {
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  /* =========================
     DEDUPLICATE (SAFETY)
  ========================= */
  const uniqueArts = Array.from(
    new Map(arts.map((art) => [art._id, art])).values()
  );

  /* =========================
     INFINITE SCROLL OBSERVER
  ========================= */
  useEffect(() => {
    if (loading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { rootMargin: "200px" } // prefetch before reaching bottom
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, onLoadMore]);

  /* =========================
     STATES
  ========================= */
  if (loading && uniqueArts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 pb-20 text-center text-gray-500">
        Loading artworks...
      </div>
    );
  }

  if (!loading && uniqueArts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 pb-20 text-center text-gray-500">
        No artworks found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      {/* GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
        {uniqueArts.map((art) => (
          <ArtCard key={art._id} art={art} />
        ))}
      </div>

      {/* SENTINEL (AUTO LOAD TRIGGER) */}
      {hasMore && (
        <div
          ref={sentinelRef}
          className="h-10 flex items-center justify-center mt-10 text-sm text-gray-400"
        >
          {loading ? "Loading more..." : "Scroll to load more"}
        </div>
      )}
    </div>
  );
};

export default ArtGrid;
