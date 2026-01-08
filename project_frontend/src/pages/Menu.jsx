import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useShop } from "../context/ShopContext";
import MenuCategoryGroup from "../components/menu/MenuCategoryGroup";
import MenuFilters from "../components/menu/MenuFilters";
import Preloader from "../components/common/Preloader"; 

/* normalize */
const normalize = (str = "") =>
  str.toLowerCase().trim().replace(/[_–—]/g, "-").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, " ");

const CATEGORY_ORDER = [
  "robusta special",
  "robusta peaberry",
  "blend",
  "shake",
  "tea",
  "food",
].map(normalize);

const Menu = () => {
  const { menuItems, isGlobalLoading } = useShop(); 
  
  const [items, setItems] = useState([]);
  

  /* FILTER STATE */
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("");
  const [milkBased, setMilkBased] = useState(false);

  useEffect(() => {
    let result = menuItems || [];

    // Apply Type Filter
    if (type) {
        result = result.filter(item => item.type === type);
    }

    // Apply Milk Filter
    if (milkBased) {
        result = result.filter(item => item.milkBased === true);
    }

    setItems(result);
  }, [menuItems, type, milkBased]); 

  /* GROUP + ORDER */
  const grouped = useMemo(() => {
    const map = {};
    items.forEach((item) => {
      if (!item?.category) return;
      const key = normalize(item.category);
      if (category !== "all" && normalize(category) !== key) return;
      if (!map[key]) {
        map[key] = { key, category: item.category, items: [] };
      }
      map[key].items.push(item);
    });
    return Object.values(map).sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a.key);
      const ib = CATEGORY_ORDER.indexOf(b.key);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    });
  }, [items, category]);

  if (isGlobalLoading || (!menuItems.length && items.length === 0)) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Preloader inline={true} />
      </div>
    );
  }

  return (
    <div className="bg-rabuste-bg text-rabuste-text min-h-screen px-6">
      <div className="max-w-5xl mx-auto">
        <MenuFilters
          category={category}
          setCategory={setCategory}
          type={type}
          setType={setType}
          milkBased={milkBased}
          setMilkBased={setMilkBased}
        />

        <AnimatePresence mode="wait">
            <motion.div
              key={category + type + milkBased}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-20"
            >
              {grouped.length > 0 ? (
                grouped.map((group) => (
                  <MenuCategoryGroup key={group.key} group={group} />
                ))
              ) : (
                <div className="text-center py-20 text-rabuste-muted">
                    No items found with these filters.
                </div>
              )}
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Menu;