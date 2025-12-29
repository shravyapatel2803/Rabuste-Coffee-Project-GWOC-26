const ArtStory = ({ story }) => {
  if (!story) return null;

  return (
    <div>
      <h3 className="font-serif text-2xl mb-3">
        Story Behind the Art
      </h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        {story}
      </p>
    </div>
  );
};

export default ArtStory;
