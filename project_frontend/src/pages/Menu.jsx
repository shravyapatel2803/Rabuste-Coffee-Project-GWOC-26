import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

import { getUserItems } from "../api/item.api";
import MenuCategoryGroup from "../components/menu/MenuCategoryGroup";
import MenuFilters from "../components/menu/MenuFilters";

/*  normalize */
const normalize = (str = "") =>
  str
    .toLowerCase()
    .trim()
    .replace(/[_–—]/g, "-")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, " ");

const CATEGORY_ORDER = [
  "robusta special",
  "robusta peaberry",
  "blend",
  "shake",
  "tea",
  "food",
].map(normalize);

const Menu = () => {
  /* DATA */
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* FILTER STATE  */
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("");
  const [milkBased, setMilkBased] = useState(false);

  /* FETCH MENU ITEMS */
  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const res = await getUserItems({
          showIn: "menu",
          type: type || undefined,
          milkBased: milkBased ? true : undefined,
        });

        setItems(Array.isArray(res?.data?.items) ? res.data.items : []);
      } catch (err) {
        console.error("MENU FETCH ERROR", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [type, milkBased]);

  /* GROUP + ORDER */
  const grouped = useMemo(() => {
    const map = {};

    items.forEach((item) => {
      if (!item?.category) return;

      const key = normalize(item.category);

      if (category !== "all" && normalize(category) !== key) return;

      if (!map[key]) {
        map[key] = {
          key,
          category: item.category, // original label
          items: [],
        };
      }

      map[key].items.push(item);
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

        {/* FILTER COMPONENT */}
        <MenuFilters
          category={category}
          setCategory={setCategory}
          type={type}
          setType={setType}
          milkBased={milkBased}
          setMilkBased={setMilkBased}
        />

        {/* MENU */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-20"
          >
            {grouped.map((group) => (
              <MenuCategoryGroup
                key={group.key}
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
