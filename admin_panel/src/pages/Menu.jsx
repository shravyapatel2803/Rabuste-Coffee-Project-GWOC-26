import { useEffect, useState, useRef, useCallback } from "react";
import { fetchAdminItems, deleteAdminItem } from "../api/adminItems";
import AdminAddItem from "../components/AdminAddItem";
import ItemFilter from "../components/ItemFilter";
import AppliedFiltersBar from "../components/AppliedFiltersBar";

const Menu = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const loaderRef = useRef(null);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 12;
  const [loading, setLoading] = useState(false);

  // FETCH ITEMS FUNCTION
  const fetchItems = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetchAdminItems({
        limit: LIMIT,
        cursor,
        search,
        ...activeFilters,
      });

      setItems(prev => [...prev, ...res.data.items]);
      setCursor(res.data.nextCursor ?? null);
      setHasMore(res.data.hasMore);
    } finally {
      setLoading(false);
    }
  }, [cursor, search, activeFilters, hasMore, loading]);

  // RESET AND FETCH FUNCTION
  const resetAndFetch = useCallback(async () => {
  try {
    setLoading(true);
    setHasMore(true);
    setCursor(null);

    const res = await fetchAdminItems({
      limit: LIMIT,
      cursor: null,
      search,
      ...activeFilters,
    });

    setItems(res.data.items || []);
    setCursor(res.data.nextCursor || null);
    setHasMore(res.data.hasMore);
  } catch (err) {
    console.error("Reset fetch failed", err);
  } finally {
    setLoading(false);
  }
}, [search, activeFilters]);

// RESET ITEMS WHEN SEARCH OR FILTERS CHANGE
  useEffect(() => {
    resetAndFetch();
  }, [search, activeFilters, resetAndFetch]);

  // INFINITE SCROLLING
   useEffect(() => {
      if (!loaderRef.current || !hasMore) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !loading) {
            fetchItems();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(loaderRef.current);
      return () => observer.disconnect();
    }, [fetchItems, hasMore, loading]);


  return (
    <div className="p-6">
      {/* TITLE */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Menu Items</h1>
      </div>

      {/* SEARCH + FILTER + ADD */}
      <div className="sticky top-0 z-20 bg-white py-3 mb-2 flex gap-4 items-center border-b">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[70%] px-4 py-2 border rounded-md"
        />

        <button
          onClick={() => setShowFilter(true)}
          className="px-4 py-2 border rounded-md font-semibold"
        >
          Filter
        </button>

        <button
          onClick={() => {
            setEditItem(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-orange-600 text-white rounded-md font-semibold"
        >
          + Add Item
        </button>
      </div>

      {/* APPLIED FILTERS */}
      <AppliedFiltersBar
        filters={activeFilters}
        onClear={() => setActiveFilters({})}
        onRemove={(key) =>
          setActiveFilters((prev) => {
            const copy = { ...prev };
            delete copy[key];
            return copy;
          })
        }
      />

      {/* ITEMS GRID */}
      <div className="grid md:grid-cols-3 gap-6 mt-4">
        {items.map((item) => (
          <div key={item._id} className="border rounded-xl p-4 bg-white">
            <img
              src={item.image?.url}
              className="h-40 w-full object-cover rounded-md"
              alt={item.name}
            />
            <p className={`text-sm font-semibold ${
                item.availability?.isSoldOut ? "text-red-600" : "text-green-600"
              }`}>
                {item.availability?.isSoldOut ? "Sold Out" : "Available"}
              </p>

            <h3 className="font-semibold mt-2">{item.name}</h3>
            <p>₹ {item.price}</p>

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => {
                  setEditItem(item);
                  setShowForm(true);
                }}
              >
                ✏️ Edit
              </button>

              <button
                className="text-red-600"
                onClick={async () => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this item?"
                    )
                  ) {
                    await deleteAdminItem(item._id);
                      resetAndFetch();
                  }
                }}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <div ref={loaderRef} className="h-10" />

      {/* LOADING / END STATE */}
      {loading && (
        <p className="text-center mt-6 text-gray-500">
          Loading more items...
        </p>
      )}

      {!hasMore &&  (
        <p className="text-center mt-6 text-gray-400">
          No more items
        </p>
      )}

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-xl w-full max-w-3xl">
            <AdminAddItem
              existingItem={editItem}
              mode={editItem ? "edit" : "add"}
              onSuccess={async () => {
                setShowForm(false);
                setEditItem(null);      
                await resetAndFetch();   
              }}

              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* FILTER MODAL */}
      {showFilter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-xl w-full max-w-3xl">
            <ItemFilter
              onApply={(filters) => {
                setActiveFilters(filters);
                setShowFilter(false);
              }}
              onCancel={() => setShowFilter(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
