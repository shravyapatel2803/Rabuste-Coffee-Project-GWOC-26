import { useEffect, useState } from "react";
import API from "../api/api";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await API.get("/items/menu");
        setMenuItems(res.data);
      } catch (error) {
        console.error("Menu fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading menu...</p>;
  }

  /* GET UNIQUE CATEGORIES (DYNAMIC) */
  const categories = [
    ...new Set(menuItems.map((item) => item.category)),
  ];

  /* GROUP ITEMS CATEGORY WISE + PRICE SORT */
  const groupedItems = categories.map((cat) => ({
    category: cat,
    items: menuItems
      .filter((item) => item.category === cat)
      .sort((a, b) => a.price - b.price),
  }));

  /* FILTER ITEMS */
  const filteredGroups =
    activeCategory === "all"
      ? groupedItems
      : groupedItems.filter((g) => g.category === activeCategory);

  return (
    <div className="px-6 py-12 relative">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-10">
        {/* TOGGLE BUTTON */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl font-bold"
        >
          ☰
        </button>

        <h1 className="text-3xl font-bold">Our Menu</h1>
      </div>

      {/* TOGGLE MENU */}
      {isOpen && (
        <div className="absolute top-20 left-6 bg-black border border-white/20 rounded-lg p-4 z-50 min-w-[200px]">
          <button
            className={`block w-full text-left mb-2 ${
              activeCategory === "all" ? "text-yellow-400" : ""
            }`}
            onClick={() => {
              setActiveCategory("all");
              setIsOpen(false);
            }}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              className={`block w-full text-left mb-2 capitalize ${
                activeCategory === cat ? "text-yellow-400" : ""
              }`}
              onClick={() => {
                setActiveCategory(cat);
                setIsOpen(false);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* MENU CONTENT */}
      {filteredGroups.map((group) => (
        <div key={group.category} className="mb-14">
          {/* CATEGORY TITLE */}
          <h2 className="text-2xl font-semibold mb-6 capitalize">
            {group.category}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {group.items.map((item) => (
              <div
                key={item._id}
                className="border rounded-xl p-4 shadow hover:shadow-lg transition"
              >
                {/* IMAGE */}
                <img
                    src={item.image?.url}
                    alt={item.image?.alt || item.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />

                <h3 className="text-xl font-semibold mt-4">{item.name}</h3>
                <p className="text-gray-600 mt-2">{item.description}</p>

                <p className="mt-3 font-bold text-lg">₹ {item.price}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
