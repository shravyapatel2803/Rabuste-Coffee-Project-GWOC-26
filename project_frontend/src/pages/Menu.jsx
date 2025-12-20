import { useEffect, useState } from "react";
import API from "../api/api";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">Our Menu</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {menuItems.map((item) => (
          <div
            key={item._id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={item.image?.url}
              alt={item.image?.alt || item.name}
              className="w-full h-48 object-cover rounded-lg"
            />

            <h2 className="text-xl font-semibold mt-4">{item.name}</h2>
            <p className="text-gray-600 mt-2">{item.description}</p>

            <p className="mt-3 font-bold text-lg">₹ {item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
