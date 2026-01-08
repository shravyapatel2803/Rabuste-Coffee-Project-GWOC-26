import { useEffect, useMemo, useState } from "react";

import MenuToolbar from "../components/menu/MenuToolbar";
import MenuTable from "../components/menu/MenuTable";
import MenuCard from "../components/menu/MenuCard";
import MenuStats from "../components/menu/MenuStats";
import AdminItemPreview from "../components/menu/AdminItemPreview";
import AdminItemForm from "../components/menu/AdminItemForm"; // 👈 add/edit modal

import {
  fetchAdminItems,
  deleteAdminItem,
} from "../api/Items";

const MenuItems = () => {
  /* ================= FILTER STATE ================= */
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    type: "",
    status: "",
  });

  /* ================= DATA ================= */
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= MODAL STATES ================= */
  const [previewItem, setPreviewItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null); // edit
  const [isAddOpen, setIsAddOpen] = useState(false);    // add

  /* ================= FETCH ITEMS ================= */
  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const res = await fetchAdminItems({
          context: "admin",
          ...filters,
        });
        setItems(res.data.items || []);
      } catch (err) {
        console.error("Failed to fetch items", err);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [filters]);

  /* ================= STATS ================= */
  const stats = useMemo(() => ({
    total: items.length,
    available: items.filter(i => i.availability?.isAvailable).length,
    soldOut: items.filter(i => i.availability?.isSoldOut).length,
    hidden: items.filter(i => i.visibility === "hidden").length
  }), [items]);

  /* ================= ACTIONS ================= */
  const handleView = (item) => setPreviewItem(item);

  const handleEdit = (item) => {
    setEditingItem(item);   // 👈 modal open
    setPreviewItem(null);   // optional safety
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    await deleteAdminItem(item._id);
    setItems(prev => prev.filter(i => i._id !== item._id));
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-semibold">Menu Items</h1>

      <MenuStats stats={stats} />

      {/* TOOLBAR */}
      <MenuToolbar
        filters={filters}
        setFilters={setFilters}
        onAdd={() => setIsAddOpen(true)} // 👈 ADD modal
      />

      {/* DESKTOP */}
      <div className="hidden md:block">
        <MenuTable
          items={items}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* MOBILE */}
      <div className="md:hidden space-y-3">
        {items.map(item => (
          <MenuCard
            key={item._id}
            item={item}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* ================= PREVIEW MODAL ================= */}
      {previewItem && (
        <AdminItemPreview
          item={previewItem}
          onClose={() => setPreviewItem(null)}
          onEdit={() => handleEdit(previewItem)}
        />
      )}

      {/* ================= ADD MODAL ================= */}
      {isAddOpen && (
        <AdminItemForm
          mode="add"
          onClose={() => setIsAddOpen(false)}
          onSuccess={() => {
            setIsAddOpen(false);
            setFilters({ ...filters }); // reload list
          }}
        />
      )}

      {/* ================= EDIT MODAL ================= */}
      {editingItem && (
        <AdminItemForm
          mode="edit"
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={() => {
            setEditingItem(null);
            setFilters({ ...filters }); // reload list
          }}
        />
      )}
    </div>
  );
};

export default MenuItems;
