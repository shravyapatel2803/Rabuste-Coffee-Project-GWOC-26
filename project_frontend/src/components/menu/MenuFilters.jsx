import { useEffect, useState } from "react";
import { getUserCategories, getUserTypes } from "../../api/item.api";

const MenuFilters = ({
  category,
  setCategory,
  type,
  setType,
  milkBased,
  setMilkBased,
}) => {
  const [categories, setCategories] = useState(["all"]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [catRes, typeRes] = await Promise.all([
          getUserCategories(),
          getUserTypes(),
        ]);

        setCategories([
          "all",
          ...(Array.isArray(catRes?.data?.data) ? catRes.data.data : []),
        ]);

        setTypes(
          Array.isArray(typeRes?.data?.data) ? typeRes.data.data : []
        );
      } catch (err) {
        console.error("FILTER LOAD ERROR", err);
        setCategories(["all"]);
        setTypes([]);
      }
    };

    loadFilters();
  }, []);

  return (
    <div className="flex flex-wrap justify-end gap-4 mb-12">
      {/* CATEGORY */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="input-cafe w-40"
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c.toUpperCase()}
          </option>
        ))}
      </select>

      {/* TYPE */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="input-cafe w-40"
      >
        <option value="">ALL TYPES</option>
        {types.map((t) => (
          <option key={t} value={t}>
            {t.toUpperCase()}
          </option>
        ))}
      </select>

      {/* MILK BASED */}
      <label className="flex items-center gap-2 cursor-pointer text-sm">
        <input
          type="checkbox"
          checked={milkBased}
          onChange={(e) => setMilkBased(e.target.checked)}
        />
        Milk Based
      </label>

      {/* CLEAR */}
      <button
        onClick={() => {
          setCategory("all");
          setType("");
          setMilkBased(false);
        }}
        className="text-sm underline text-rabuste-muted hover:text-rabuste-text"
      >
        Clear
      </button>
    </div>
  );
};

export default MenuFilters;
