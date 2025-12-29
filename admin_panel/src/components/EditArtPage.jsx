import { useEffect, useState } from "react";
import {createAdminArt,fetchAdminArtById,updateAdminArt,} from "../api/adminArt";

const EditArtPage = ({
  mode = "add",
  artId = null,
  onCancel,
  onSuccess,
}) => {
  const isEdit = mode === "edit";

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    storyBehindArt: "",
    artistName: "",
    medium: "",
    artStyle: "",
    artMood: "",
    dimensions: { width: "", height: "" },
    framed: false,
    price: "",
    availabilityStatus: "not-for-sale",
    displayLocation: "",
    isCurrentlyDisplayed: true,
    isFeatured: false,
    visibility: "public",
  });

  // LOAD ART FOR EDITING
  useEffect(() => {
    if (!isEdit || !artId) return;

    const loadArt = async () => {
      try {
        const res = await fetchAdminArtById(artId);
        const art = res.data;

        setForm({
          title: art.title || "",
          description: art.description || "",
          storyBehindArt: art.storyBehindArt || "",
          artistName: art.artistName || "",
          medium: art.medium || "",
          artStyle: art.artStyle || "",
          artMood: (art.artMood || []).join(","),
          dimensions: {
            width: art.dimensions?.width || "",
            height: art.dimensions?.height || "",
          },
          framed: !!art.framed,
          price: art.price ?? "",
          availabilityStatus: art.availabilityStatus || "not-for-sale",
          displayLocation: art.displayLocation || "",
          isCurrentlyDisplayed: art.isCurrentlyDisplayed ?? true,
          isFeatured: !!art.isFeatured,
          visibility: art.visibility || "public",
        });

        setImagePreview(art.image?.url || "");
      } catch  {
        setError("Failed to load artwork");
      } finally {
        setLoading(false);
      }
    };

    loadArt();
  }, [isEdit, artId]);

  // HANDLE INPUT CHANGES
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("dimensions.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        dimensions: { ...prev.dimensions, [key]: value },
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // HANDLE FORM SUBMISSION
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.artistName.trim() ||
      !form.medium.trim() ||
      !form.artStyle.trim()
    ) {
      return setError("Please fill all required fields (*)");
    }

    if (!isEdit && !imageFile) {
      return setError("Artwork image is required");
    }

    setSaving(true);
    setError("");

    try {
      const data = new FormData();

      data.append("title", form.title.trim());
      data.append("description", form.description.trim());
      data.append("storyBehindArt", form.storyBehindArt.trim());
      data.append("artistName", form.artistName.trim());

      data.append("medium", form.medium.trim());
      data.append("artStyle", form.artStyle.trim());
      data.append("artMood", form.artMood);

      data.append("width", form.dimensions.width);
      data.append("height", form.dimensions.height);
      data.append("framed", form.framed);

      data.append(
        "price",
        form.availabilityStatus === "not-for-sale" ? "" : form.price
      );
      data.append("availabilityStatus", form.availabilityStatus);

      data.append("displayLocation", form.displayLocation);
      data.append("isCurrentlyDisplayed", form.isCurrentlyDisplayed);
      data.append("isFeatured", form.isFeatured);
      data.append("visibility", form.visibility);

      if (imageFile) {
        data.append("image", imageFile);
      }

      if (isEdit) {
        await updateAdminArt(artId, data);
      } else {
        await createAdminArt(data);
      }

      onSuccess?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save artwork");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        Loading artwork…
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg max-h-[90vh] flex flex-col">
      <div className="px-6 py-4 border-b text-lg font-semibold">
        {isEdit ? "Edit Artwork" : "Add New Artwork"}
      </div>

      <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
        )}

        {/*scrollable content*/}
        
        {/* IMAGE + BASIC */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* IMAGE */}
          <div>
            <div className="border rounded-lg p-3">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded mb-3"
                />
              ) : (
                <div className="h-48 bg-gray-100 flex items-center justify-center rounded mb-3 text-gray-400">
                  Image Preview
                </div>
              )}
              <input
                type="file"
                name="image"               
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* TITLE / DESC */}
          <div className="md:col-span-2 space-y-4">
            <input
              name="title"
              placeholder="Title *"
              className="border p-3 rounded w-full"
              value={form.title}
              onChange={handleChange}
              required
            />

            <input
              name="artistName"
              placeholder="Artist Name *"
              className="border p-3 rounded w-full"
              value={form.artistName}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Brief description *"
              className="border p-3 rounded w-full"
              rows={3}
              value={form.description}
              onChange={handleChange}
              required
            />

            <textarea
              name="storyBehindArt"
              placeholder="Story behind the art"
              className="border p-3 rounded w-full"
              rows={3}
              value={form.storyBehindArt}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 3 COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* BASIC INFO */}
          <div className="space-y-3">
            <h3 className="font-semibold">Basic Info</h3>
            <input
              name="medium"
              placeholder="Medium *"
              className="border p-2 rounded w-full"
              value={form.medium}
              onChange={handleChange}
              required
            />
            <input
              name="artStyle"
              placeholder="Art Style *"
              className="border p-2 rounded w-full"
              value={form.artStyle}
              onChange={handleChange}
              required
            />
          </div>

          {/* ART DETAILS */}
          <div className="space-y-3">
            <h3 className="font-semibold">Art Details</h3>
            <input
              name="artMood"
              placeholder="Moods (comma separated)"
              className="border p-2 rounded w-full"
              value={form.artMood}
              onChange={handleChange}
            />
            <div className="flex gap-2">
              <input
                name="dimensions.width"
                placeholder="Width (cm)"
                className="border p-2 rounded w-full"
                value={form.dimensions.width}
                onChange={handleChange}
                disabled={!form.framed}
              />
              <input
                name="dimensions.height"
                placeholder="Height (cm)"
                className="border p-2 rounded w-full"
                value={form.dimensions.height}
                onChange={handleChange}
                disabled={!form.framed}
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="framed"
                checked={form.framed}
                onChange={handleChange}
              />
              Framed
            </label>
          </div>

          {/* PRICING */}
          <div className="space-y-3">
            <h3 className="font-semibold">Pricing & Availability</h3>
            <input
              name="price"
              placeholder="Price (₹)"
              type="number"
              className="border p-2 rounded w-full"
              value={form.price}
              onChange={handleChange}
              disabled={form.availabilityStatus === "not-for-sale"}
            />
            <select
              name="availabilityStatus"
              className="border p-2 rounded w-full"
              value={form.availabilityStatus}
              onChange={handleChange}
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="not-for-sale">Not for Sale</option>
            </select>
            <input
              name="displayLocation"
              placeholder="Display Location"
              className="border p-2 rounded w-full"
              value={form.displayLocation}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* FLAGS */}
        <select
            name="visibility"
            value={form.visibility}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="public">Public</option>
            <option value="hidden">Hidden</option>
          </select>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isCurrentlyDisplayed"
              checked={form.isCurrentlyDisplayed}
              onChange={handleChange}
            />
            Currently Displayed
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
            />
            Featured
          </label>

        </div>
        
        {/*footer buttons*/}
        <div className="border-t pt-4 flex justify-end gap-3 sticky bottom-0 bg-white">
          <button type="button" onClick={onCancel} className="border px-6 py-2 rounded">
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Artwork"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArtPage;
