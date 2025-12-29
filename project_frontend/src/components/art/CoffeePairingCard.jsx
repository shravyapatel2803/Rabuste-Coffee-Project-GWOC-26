const CoffeePairingCard = ({ coffee }) => {
  // 🔒 Defensive guard
  if (
    !coffee ||
    typeof coffee !== "object" ||
    (!coffee.name && !coffee.title)
  ) {
    return null;
  }

  const name = coffee.name || coffee.title;
  const description = coffee.description || "";
  const image = coffee.image?.url || coffee.image || null;

  return (
    <div className="bg-white dark:bg-[#26231f] rounded-xl overflow-hidden shadow">
      {image && (
        <img
          src={image}
          alt={name}
          className="w-full h-40 object-cover"
        />
      )}

      <div className="p-4">
        <h4 className="text-sm uppercase text-gray-500">
          Best paired with
        </h4>

        <h3 className="font-serif text-xl">
          {name}
        </h3>

        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default CoffeePairingCard;
