import { useEffect, useState } from "react";
import ArtStats from "../components/ArtStats";
import ArtFilters from "../components/ArtFilters";
import ArtTable from "../components/ArtTable";
import EditArtPage from "../components/EditArtPage";
import { fetchAdminArts } from "../api/adminArt";

const ArtListPage = () => {
  const [arts, setArts] = useState([]);
  const [loading, setLoading] = useState(false);

  //  FORM STATE
  const [showForm, setShowForm] = useState(false);
  const [editingArtId, setEditingArtId] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    artStyle: "",
    artMood: "",
    availabilityStatus: "",
    displayLocation: "",
    visibility: "",
  });

  // LOAD ARTS FUNCTION
  const loadArts = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminArts({
        ...filters,
        noLimit: true, 
      });

      setArts(res.data.arts);
    } catch (err) {
      console.error("Failed to load arts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // FORM HANDLERS
  const openAddForm = () => {
    setEditingArtId(null); 
    setShowForm(true);
  };

  const openEditForm = (id) => {
    setEditingArtId(id); 
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingArtId(null);
  };

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">
        Artworks Management
      </h1>

      {/* STATS */}
      <ArtStats onAdd={openAddForm} arts={arts} />

      {/* FILTERS */}
      <ArtFilters
        filters={filters}
        setFilters={setFilters}
      />

      {/* TABLE (NO LOAD MORE) */}
      <ArtTable
        arts={arts}
        loading={loading}
        onEdit={openEditForm}
      />

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="w-full max-w-4xl">
            <EditArtPage
              mode={editingArtId ? "edit" : "add"}
              artId={editingArtId}
              onCancel={closeForm}
              onSuccess={async () => {
                closeForm();
                await loadArts();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ArtListPage;
