import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

import {
  getUserItems,
  getUserCategories,
  getUserTypes,
} from "../api/item.api";

import MenuCategoryGroup from "../components/menu/MenuCategoryGroup";

const normalize = (str = "") =>
  str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/_/g, "-");
    
const Menu = () => {
  // data
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // filter
  const [categories, setCategories] = useState(["all"]);
  const [types, setTypes] = useState([]);

  const [category, setCategory] = useState("all");
  const [type, setType] = useState("");
  const [milkBased, setMilkBased] = useState(false);

  // load option
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [catRes, typeRes] = await Promise.all([
          getUserCategories(),
          getUserTypes(),
        ]);

        const catList = Array.isArray(catRes?.data?.data)
          ? catRes.data.data
          : [];

        const typeList = Array.isArray(typeRes?.data?.data)
          ? typeRes.data.data
          : [];

        setCategories(["all", ...catList]);
        setTypes(typeList);
      } catch (err) {
        console.error("FILTER LOAD ERROR", err);
        setCategories(["all"]);
        setTypes([]);
      }
    };

    loadFilters();
  }, []);

  // fetch items
  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const res = await getUserItems({
          showIn: "menu",
          type: type || undefined,
          milkBased: milkBased ? true : undefined,
        });

        const list = Array.isArray(res?.data?.items)
          ? res.data.items
          : [];

        setItems(list);
      } catch (err) {
        console.error("MENU FETCH ERROR", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [type, milkBased]); 

  // category group
  const grouped = useMemo(() => {
    if (!Array.isArray(items)) return [];

    const CATEGORY_ORDER = [
      "robusta special",
      "robusta peaberry",
      "blend",
      "shake",
      "tea",
      "food",
    ].map(normalize);

    const map = {};

    items.forEach((item) => {
      if (!item?.category) return;

      const normalized = normalize(item.category);

      // frontend category filter
      if (category !== "all" && normalize(category) !== normalized) return;

      if (!map[normalized]) {
        map[normalized] = {
          key: normalized,         
          category: item.category,  
          items: [],
        };
      }

      map[normalized].items.push(item);
    });

    return Object.values(map).sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a.key);
      const ib = CATEGORY_ORDER.indexOf(b.key);

      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    });
  }, [items, category]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-rabuste-orange">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-rabuste-bg text-rabuste-text min-h-screen px-6 py-20">
      <div className="max-w-5xl mx-auto">

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

        {/* ================= MENU ================= */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-20"
          >
            {grouped.map((group) => (
              <MenuCategoryGroup
                key={group.category}
                group={group}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Menu;
