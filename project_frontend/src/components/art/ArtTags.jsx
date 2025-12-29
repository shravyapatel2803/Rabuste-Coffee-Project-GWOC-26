const ArtTags = ({ tags }) => {
  if (!Array.isArray(tags) || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-3 py-1 rounded-full text-xs bg-[#eee7df] dark:bg-[#2e2924]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default ArtTags;
