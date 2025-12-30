import React from "react";

const ArtTags = ({ tags }) => {
  if (!Array.isArray(tags) || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-bold uppercase tracking-widest text-rabuste-text/50 dark:text-stone-500 mr-2">
        Moods:
      </span>
      
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-100 dark:bg-stone-800 text-rabuste-muted dark:text-stone-300 border border-transparent hover:border-rabuste-orange hover:text-rabuste-orange transition-colors cursor-default"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default ArtTags;