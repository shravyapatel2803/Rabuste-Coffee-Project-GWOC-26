import { useEffect, useState } from "react";
import {
  fetchItemCategories,
  fetchItemTypes,
} from "../../api/Items";



const MenuToolbar = ({
  filters = {},
  setFilters = () => {},
  onAdd = () => {},
}) => {
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  // load category/type
 useEffect(() => {
  fetchItemCategories().then(res => setCategories(res.data.data));
  fetchItemTypes().then(res => setTypes(res.data.data));
}, []);


  return (
    <div className="bg-white border rounded-xl p-4 mb-6">

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:flex-wrap">

        <input
          type="text"
          placeholder="Search items..."
          className="border px-4 py-2 rounded-md w-full lg:w-64"
          value={filters.search || ""}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
        />

        <select
          className="border px-3 py-2 rounded-md w-full lg:w-auto"
          value={filters.category || ""}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded-md w-full lg:w-auto"
          value={filters.type || ""}
          onChange={(e) =>
            setFilters({ ...filters, type: e.target.value })
          }
        >
          <option value="">All Types</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded-md w-full lg:w-auto"
          value={filters.status || ""}
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="soldout">Sold Out</option>
          <option value="hidden">Hidden</option>
        </select>

        <button
          onClick={() =>
            setFilters({
              search: "",
              category: "",
              type: "",
              status: "",
            })
          }
          className="text-red-600 font-medium px-4 py-2 rounded-md hover:bg-red-50 w-full lg:w-auto"
        >
          Clear
        </button>

        <button
          onClick={onAdd}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md w-full lg:w-auto"
        >
          + Add Item
        </button>
      </div>
    </div>
  );
};

export default MenuToolbar;
