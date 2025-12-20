import { X } from "lucide-react";

const CategoryToggle = ({ open, onClose, categories, onSelect }) => {
  if (!open) return null;

  return (
    <div className="absolute top-16 left-6 z-50 bg-black border border-white/20 rounded-md w-56">
      <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
        <span className="text-sm tracking-widest text-gray-300">CATEGORIES</span>
        <X
          size={16}
          className="cursor-pointer text-gray-400"
          onClick={onClose}
        />
      </div>

      <ul className="py-2">
        <li
          onClick={() => onSelect("all")}
          className="px-4 py-2 cursor-pointer hover:bg-white/10 text-sm"
        >
          All
        </li>

        {categories.map((cat) => (
          <li
            key={cat}
            onClick={() => onSelect(cat)}
            className="px-4 py-2 cursor-pointer hover:bg-white/10 text-sm capitalize"
          >
            {cat}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryToggle;
