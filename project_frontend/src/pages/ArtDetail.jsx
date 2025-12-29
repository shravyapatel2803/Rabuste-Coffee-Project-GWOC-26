import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchArtBySlug } from "../api/art.api";

import ArtHero from "../components/art/ArtHero";
import ArtistCard from "../components/art/ArtistCard";
import CoffeePairingCard from "../components/art/CoffeePairingCard";
import ArtStory from "../components/art/ArtStory";
import ArtTags from "../components/art/ArtTags";
import ArtNavigation from "../components/art/ArtNavigation";

const ArtDetail = () => {
  const { slug } = useParams();

  const [art, setArt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    fetchArtBySlug(slug)
      .then((res) => {
        setArt(res?.data ?? res);
      })
      .catch(() => {
        setArt(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <div className="p-10">Loading artwork...</div>;
  }

  if (!art) {
    return <div className="p-10">Artwork not found</div>;
  }

  return (
    <div className="bg-[#f7f3ee] dark:bg-[#1c1916] text-[#2b1e16] dark:text-[#f5efe6]">
      {/* HERO */}
      <ArtHero art={art} />

      <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-10">
          <ArtistCard
            artist={{
              name: art.artistName,
              bio: art.artistBio,
              instagram: art.artistInstagram,
              website: art.artistWebsite,
            }}
            location={art.displayLocation}
            views={art.viewCount}
          />

          <ArtStory story={art.storyBehindArt} />

          <ArtTags tags={art.artMood || []} />
        </div>

        {/* RIGHT */}
        <div className="space-y-8">
          {/* Optional / Future-ready */}
          {art.bestPairedCoffee && (
            <CoffeePairingCard coffee={art.bestPairedCoffee} />
          )}
        </div>
      </div>

      <ArtNavigation />
    </div>
  );
};

export default ArtDetail;
