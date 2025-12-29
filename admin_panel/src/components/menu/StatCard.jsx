const StatCard = ({ title, value, color = "bg-blue-600" }) => {
  return (
    <div
      className={`
        ${color}
        text-white
        rounded-xl
        p-4
        flex flex-col
        items-center justify-center
        text-center
      `}
    >
      <div className="text-2xl font-bold">
        {value}
      </div>
      <div className="text-xs sm:text-sm opacity-90 mt-1">
        {title}
      </div>
    </div>
  );
};

export default StatCard;
