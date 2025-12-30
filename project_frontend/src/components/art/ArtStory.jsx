import React from "react";

const ArtStory = ({ story }) => {
  if (!story) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-3xl font-bold text-rabuste-text dark:text-white">
        Story Behind the Art
      </h3>
      
      <p className="text-lg leading-relaxed text-rabuste-muted dark:text-stone-300 font-light whitespace-pre-line">
        {story}
      </p>
    </div>
  );
};

export default ArtStory;