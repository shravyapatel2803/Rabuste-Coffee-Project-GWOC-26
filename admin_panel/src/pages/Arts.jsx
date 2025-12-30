import { useEffect, useMemo, useState } from "react";
import ArtToolbar from "../components/art/ArtToolbar";
import ArtTable from "../components/art/ArtTable";
import ArtCard from "../components/art/ArtCard";
import ArtStats from "../components/art/ArtStats";
import AdminArtPreview from "../components/art/AdminArtPreview";
import AdminArtForm from "../components/art/AdminArtForm"; 

import {fetchAdminArts, deleteAdminArt, } from "../api/Arts";

const Arts = () => {
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    status: "",
    isDisplayed: "",
  });

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [previewItem, setPreviewItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null); 
  const [isAddOpen, setIsAddOpen] = useState(false); 

 // fetch data
  useEffect(() => {
    const loadArtworks = async () => {
      setLoading(true);
      try {
        const res = await fetchAdminArts({
          ...filters,
        });
        setArtworks(res.data.data || []); 
      } catch (err) {
        console.error("Failed to fetch artworks", err);
      } finally {
        setLoading(false);
      }
    };

    loadArtworks();
  }, [filters]);

  // stats calculation
  const stats = useMemo(() => {
    const safeArtworks = Array.isArray(artworks) ? artworks : [];

    return {
      total: safeArtworks.length,
      available: safeArtworks.filter(
        (a) => a.availabilityStatus === "available"
      ).length, 
      sold: safeArtworks.filter((a) => a.availabilityStatus === "sold").length,
      displayed: safeArtworks.filter((a) => a.isCurrentlyDisplayed).length,
    };
  }, [artworks]);

  const handleView = (item) => setPreviewItem(item);

  const handleEdit = (item) => {
    setEditingItem(item); 
    setPreviewItem(null); 
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete artwork "${item.title}"?`)) return;
    try {
      await deleteAdminArt(item._id);
      setArtworks((prev) => prev.filter((i) => i._id !== item._id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete artwork");
    }
  };

  const refreshData = () => {
    setFilters({ ...filters });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Artworks Gallery</h1>
      </div>

      {/* STATS CARDS */}
      <ArtStats stats={stats} />

      {/* TOOLBAR (Search & Filters) */}
      <ArtToolbar
        filters={filters}
        setFilters={setFilters}
        onAdd={() => setIsAddOpen(true)} 
      />

      {/* LISTING CONTENT */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading Artworks...
        </div>
      ) : (
        <>
          {/* DESKTOP: Table View */}
          <div className="hidden md:block">
            <ArtTable
              items={artworks}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

          {/* MOBILE: Card View */}
          <div className="md:hidden space-y-3">
            {artworks.length > 0 ? (
              artworks.map((art) => (
                <ArtCard
                  key={art._id}
                  item={art}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="text-center text-gray-400 py-4">
                No artworks found
              </div>
            )}
          </div>
        </>
      )}

      {previewItem && (
        <AdminArtPreview
          item={previewItem}
          onClose={() => setPreviewItem(null)}
          onEdit={() => handleEdit(previewItem)}
        />
      )}

      {isAddOpen && (
        <AdminArtForm
          mode="add"
          onClose={() => setIsAddOpen(false)}
          onSuccess={() => {
            setIsAddOpen(false);
            refreshData();
          }}
        />
      )}

      {editingItem && (
        <AdminArtForm
          mode="edit"
          art={editingItem} 
          onClose={() => setEditingItem(null)}
          onSuccess={() => {
            setEditingItem(null);
            refreshData();
          }}
        />
      )}
    </div>
  );
};

export default Arts;
