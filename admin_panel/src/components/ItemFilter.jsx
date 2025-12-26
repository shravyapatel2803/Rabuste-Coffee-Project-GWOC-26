import { useEffect, useState } from "react";
import {fetchAdminCategories, fetchAdminTypes, fetchAdminRoastTypes,} from "../api/adminItems";

const ItemFilter = ({ onApply, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [roastTypes, setRoastTypes] = useState([]);

  const [filters, setFilters] = useState({
    category: "",
    type: "",
    roastType: "",
    strengthLevel: "",
    bitterness: "",
    caffeineLevel: "",
  });

  useEffect(() => {
    const fetchFilters = async () => {
      const [c, t, r] = await Promise.all([
        fetchAdminCategories(),
        fetchAdminTypes(),
        fetchAdminRoastTypes(),
      ]);

      setCategories(c.data || []);
      setTypes(t.data || []);
      setRoastTypes(r.data|| []);
    };

    fetchFilters();
  }, []);

  const hasAnyFilter = Object.values(filters).some(Boolean);

  const applyFilters = () => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) => value !== "" && value !== null
      )
    );

    onApply(cleanedFilters);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Filter Items</h2>

      <div className="grid md:grid-cols-3 gap-4">
        {/* CATEGORY */}
        <select
          className="input-field"
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
        >
          <option value="">Category</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* TYPE */}
        <select
          className="input-field"
          value={filters.type}
          onChange={(e) =>
            setFilters({ ...filters, type: e.target.value })
          }
        >
          <option value="">Type</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* ROAST */}
        <select
          className="input-field"
          value={filters.roastType}
          onChange={(e) =>
            setFilters({ ...filters, roastType: e.target.value })
          }
        >
          <option value="">Roast</option>
          {roastTypes.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {/* STRENGTH */}
        <select
          className="input-field"
          value={filters.strengthLevel}
          onChange={(e) =>
            setFilters({ ...filters, strengthLevel: e.target.value })
          }
        >
          <option value="">Strength</option>
          {[1,2,3,4,5].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>

        {/* BITTERNESS */}
        <select
          className="input-field"
          value={filters.bitterness}
          onChange={(e) =>
            setFilters({ ...filters, bitterness: e.target.value })
          }
        >
          <option value="">Bitterness</option>
          {[1,2,3,4,5].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>

        {/* CAFFEINE */}
        <select
          className="input-field"
          value={filters.caffeineLevel}
          onChange={(e) =>
            setFilters({ ...filters, caffeineLevel: e.target.value })
          }
        >
          <option value="">Caffeine</option>
          {[1,2,3,4,5].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          onClick={onCancel}
          className="px-6 py-3 rounded-md border font-semibold"
        >
          Cancel
        </button>

        <button
          disabled={!hasAnyFilter}
          onClick={applyFilters}
          className={`px-6 py-3 rounded-md font-semibold ${
            hasAnyFilter
              ? "bg-[rgb(var(--color-gold))] text-black"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default ItemFilter;
