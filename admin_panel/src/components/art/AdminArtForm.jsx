import { useState, useEffect, useMemo } from "react";

import { createAdminArt, updateAdminArt, fetchArtOptions, fetchArtMoods } from "../../api/Arts"; 
import { fetchAdminItems } from "../../api/Items"; 

const INITIAL_FORM_STATE = {
  title: "",
  description: "",
  story: "",
  imageAlt: "",
  artistName: "",
  artistBio: "",
  medium: "",
  style: "",
  moods: [],
  isFramed: false,
  width: "",
  height: "",
  status: "available",
  price: "",
  location: "",
  isDisplayed: false,
  visibility: "public",
  pairedCoffeeId: "",
};

const DynamicSelect = ({ label, value, onChange, options = [], placeholder }) => {
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    if (value && options.length > 0 && !options.includes(value)) {
      setIsCustom(true);
    }
  }, [value, options]);

  const handleSelectChange = (e) => {
    if (e.target.value === "___ADD_NEW___") {
      setIsCustom(true);
      onChange(""); 
    } else {
      setIsCustom(false);
      onChange(e.target.value);
    }
  };

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1">
        {label} *
      </label>
      {isCustom ? (
        <div className="flex gap-2 animate-fade-in">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder={`Type new ${label.toLowerCase()}...`}
            autoFocus
          />
          <button
            type="button"
            onClick={() => setIsCustom(false)}
            className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded text-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      ) : (
        <select
          value={value}
          onChange={handleSelectChange}
          className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-orange-500 outline-none"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
          <option disabled>────────────────</option>
          <option value="___ADD_NEW___" className="font-bold text-indigo-600 bg-indigo-50">
            + Add New {label}
          </option>
        </select>
      )}
    </div>
  );
};

const AdminArtForm = ({ mode = "add", art: existingArt, onClose, onSuccess }) => {
  const isEdit = mode === "edit";

  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Dynamic Data Lists
  const [dbOptions, setDbOptions] = useState({
    mediums: [],
    styles: [],
    locations: [],
    moods: []
  });

  const [availableCoffees, setAvailableCoffees] = useState([]);
  
  // Mood Search
  const [moodInput, setMoodInput] = useState("");
  const [showMoodSuggestions, setShowMoodSuggestions] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const resItems = await fetchAdminItems({ context: "admin" });
        const items = Array.isArray(resItems?.data?.items) ? resItems.data.items : [];
        const coffees = items.filter(
          (item) => item.bestPairedArtMood && item.bestPairedArtMood.length > 0
        );
        setAvailableCoffees(coffees);

        const optionsData = await fetchArtOptions();

        const moodsRes = await fetchArtMoods();
 
        const moodsList = moodsRes.data?.data || moodsRes.data || []; 

        setDbOptions({
          mediums: optionsData.mediums || [],
          styles: optionsData.styles || [],
          locations: optionsData.locations || [],
          moods: Array.isArray(moodsList) ? moodsList : [] 
        });

      } catch (err) {
        console.error("Failed to load form data", err);
        setError("Network error: Could not load dropdown options.");
      }
    };
    loadData();
  }, []);

  // prefill form
  useEffect(() => {
    if (isEdit && existingArt) {
      setForm({
        ...INITIAL_FORM_STATE,
        ...existingArt,
        title: existingArt.title || "",
        description: existingArt.description || "",
        story: existingArt.storyBehindArt || "",
        imageAlt: existingArt.image?.alt || "",
        artistName: existingArt.artistName || "",
        artistBio: existingArt.artistBio || "",
        medium: existingArt.medium || "",
        style: existingArt.artStyle || "",
        moods: existingArt.artMood || [],
        isFramed: existingArt.framed || false,
        width: existingArt.dimensions?.width || "",
        height: existingArt.dimensions?.height || "",
        status: existingArt.availabilityStatus || "available",
        price: existingArt.price || "",
        location: existingArt.displayLocation || "",
        isDisplayed: existingArt.isCurrentlyDisplayed || false,
        visibility: existingArt.visibility || "public",
        pairedCoffeeId: existingArt.bestPairedCoffee?._id 
          ? existingArt.bestPairedCoffee._id  
          : (existingArt.bestPairedCoffee || ""),
      });

      if (existingArt.image?.url) setImagePreview(existingArt.image.url);
    }
  }, [isEdit, existingArt]);

  //  HANDLERS 
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      if (!form.imageAlt) {
        setForm((prev) => ({ ...prev, imageAlt: form.title }));
      }
    }
  };

  // MOOD HANDLER
  const handleMoodInput = (e) => {
    setMoodInput(e.target.value);
    setShowMoodSuggestions(true);
  };

  const addMood = (moodToAdd) => {
    if (moodToAdd && !form.moods.includes(moodToAdd)) {
      setForm(prev => ({ ...prev, moods: [...prev.moods, moodToAdd] }));
    }
    setMoodInput("");
    setShowMoodSuggestions(false);
  };

  const removeMood = (moodToRemove) => {
    setForm(prev => ({
      ...prev,
      moods: prev.moods.filter(m => m !== moodToRemove)
    }));
  };

  const handleMoodKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addMood(moodInput);
    }
  };

  const moodSuggestions = useMemo(() => {
    if (!moodInput) return [];
    return (dbOptions.moods || []).filter(m => 
      m.toLowerCase().includes(moodInput.toLowerCase()) && 
      !form.moods.includes(m)
    );
  }, [moodInput, dbOptions.moods, form.moods]);

  const filteredCoffees = useMemo(() => {
    if (form.moods.length === 0) return availableCoffees;

    return availableCoffees.filter((coffee) => {
      const coffeeMoods = coffee.bestPairedArtMood || [];
      return coffeeMoods.some(m => form.moods.includes(m));
    });
  }, [availableCoffees, form.moods]);

  const selectedCoffee = useMemo(() => {
    return availableCoffees.find(c => c._id === form.pairedCoffeeId);
  }, [availableCoffees, form.pairedCoffeeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.artistName || !form.medium || !form.style || form.moods.length === 0) {
      return alert("Please fill all required fields marked with *");
    }
    if (!isEdit && !imageFile) return alert("Please upload an artwork image");

    setLoading(true);
    setError("");

    const data = new FormData();
    data.append("moods", JSON.stringify(form.moods));
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("story", form.story);
    data.append("imageAlt", form.imageAlt);
    data.append("artistName", form.artistName);
    data.append("artistBio", form.artistBio);
    data.append("medium", form.medium);
    data.append("style", form.style);
    data.append("status", form.status);
    data.append("price", form.price);
    data.append("location", form.location);
    data.append("visibility", form.visibility);
    data.append("pairedCoffeeId", form.pairedCoffeeId);
    data.append("width", form.width);
    data.append("height", form.height);
    data.append("isFramed", form.isFramed);
    data.append("isDisplayed", form.isDisplayed);
    if (imageFile) data.append("image", imageFile);

    try {
      if (isEdit) await updateAdminArt(existingArt._id, data);
      else await createAdminArt(data);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save artwork. Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm">
      <div className="bg-gray-100 w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="px-6 py-4 border-b bg-white rounded-t-xl sticky top-0 z-10 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition">← Back</button>
            <h2 className="text-xl font-bold text-gray-800">{isEdit ? "Edit Artwork" : "Add New Artwork"}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">✕</button>
        </div>

        {/* BODY */}
        <form className="flex-1 overflow-y-auto p-6 space-y-8">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>}

          {/* BASIC INFO */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">🧩 Artwork Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title *</label>
                <input name="title" value={form.title} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Story Behind Art</label>
                <textarea name="story" value={form.story} onChange={handleChange} rows={4} className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
            </div>
          </div>

          {/* IMAGE */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-orange-100">
            <h3 className="text-lg font-semibold text-orange-700 mb-4 border-b pb-2">🖼️ Artwork Image *</h3>
            <div className="flex gap-6 items-start">
              <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-dashed border-gray-300 relative">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-xs text-center px-2">No Image</span>
                )}
                <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 text-center cursor-pointer relative hover:bg-orange-100 transition">
                  <span className="text-orange-700 font-bold text-sm">📤 Upload Image</span>
                  <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Alt Text</label>
                  <input name="imageAlt" value={form.imageAlt} onChange={handleChange} className="w-full border p-2 rounded" placeholder="For accessibility" />
                </div>
              </div>
            </div>
          </div>

          {/* ARTIST */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">👩‍🎨 Artist Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Artist Name *</label>
                <input name="artistName" value={form.artistName} onChange={handleChange} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Artist Bio</label>
                <textarea name="artistBio" value={form.artistBio} onChange={handleChange} rows={1} className="w-full border p-2 rounded" />
              </div>
            </div>
          </div>

          {/* CLASSIFICATION (DYNAMIC) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">🎨 Art Classification</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Dynamic Medium */}
              <DynamicSelect 
                label="Medium" 
                value={form.medium} 
                onChange={(val) => setForm(p => ({...p, medium: val}))}
                options={dbOptions.mediums}
                placeholder="Select Medium"
              />

              {/* Dynamic Style */}
              <DynamicSelect 
                label="Art Style" 
                value={form.style} 
                onChange={(val) => setForm(p => ({...p, style: val}))}
                options={dbOptions.styles}
                placeholder="Select Style"
              />
            </div>

            {/* Smart Mood Search */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-700 mb-2">Art Moods *</label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {form.moods.map((m) => (
                  <span key={m} className="px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
                    {m} 
                    <button type="button" onClick={() => removeMood(m)} className="hover:text-red-600 font-bold ml-1">×</button>
                  </span>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={moodInput}
                  onChange={handleMoodInput}
                  onKeyDown={handleMoodKeyDown}
                  onFocus={() => setShowMoodSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowMoodSuggestions(false), 200)}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Type to search moods or press Enter to add new..."
                />
                
                {showMoodSuggestions && moodInput && (
                  <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
                    {moodSuggestions.length > 0 ? (
                      moodSuggestions.map(suggestion => (
                        <li 
                          key={suggestion}
                          onClick={() => addMood(suggestion)}
                          className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm text-gray-700"
                        >
                          {suggestion}
                        </li>
                      ))
                    ) : (
                      <li onClick={() => addMood(moodInput)} className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm text-indigo-600 font-medium">
                        Add new mood: "{moodInput}"
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* PHYSICAL */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">📐 Physical</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="isFramed" checked={form.isFramed} onChange={handleChange} className="w-5 h-5 accent-indigo-600" />
                  <span className="font-bold text-gray-700">Artwork is Framed</span>
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Width (cm)</label>
                    <input type="number" name="width" value={form.width} onChange={handleChange} disabled={!form.isFramed} className="w-full border p-2 rounded disabled:bg-gray-100" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Height (cm)</label>
                    <input type="number" name="height" value={form.height} onChange={handleChange} disabled={!form.isFramed} className="w-full border p-2 rounded disabled:bg-gray-100" />
                  </div>
                </div>
              </div>
            </div>

            {/* PRICING */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">💰 Pricing</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Status *</label>
                  <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2 rounded bg-white">
                    <option value="available">🟢 Available</option>
                    <option value="sold">🔴 Sold</option>
                    <option value="not-for-sale">🔒 Not for Sale</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} disabled={form.status === "not-for-sale"} className="w-full border p-2 rounded" placeholder="0.00" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* DISPLAY (Dynamic Location) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">🏛️ Display Settings</h3>
              <div className="space-y-4">
                
                {/* Dynamic Location Select */}
                <DynamicSelect 
                  label="Display Location" 
                  value={form.location} 
                  onChange={(val) => setForm(p => ({...p, location: val}))}
                  options={dbOptions.locations}
                  placeholder="Select Location"
                />

                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isDisplayed" checked={form.isDisplayed} onChange={handleChange} className="w-4 h-4 accent-green-600" />
                    <span className="text-sm text-gray-700">Currently Displayed in Café</span>
                  </label>
                </div>
              </div>
            </div>

            {/* PAIRING */}
            <div className="bg-gradient-to-br from-stone-50 to-orange-50 p-6 rounded-xl shadow-sm border border-orange-100">
              <h3 className="text-lg font-semibold text-brown-800 mb-4 border-b border-orange-200 pb-2">☕ Smart Coffee Pairing</h3>
              
              <div className="flex flex-col gap-4">
                <select
                  name="pairedCoffeeId"
                  value={form.pairedCoffeeId}
                  onChange={handleChange}
                  className="w-full border border-orange-300 p-2 rounded bg-white"
                >
                  <option value="">-- Select a Coffee --</option>
                  {filteredCoffees.length > 0 ? (
                    filteredCoffees.map((coffee) => (
                      <option key={coffee._id} value={coffee._id}>
                        {coffee.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No coffees matching these moods</option>
                  )}
                </select>

                {selectedCoffee && (
                  <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-orange-200 shadow-sm animate-fade-in">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                      <img 
                        src={selectedCoffee.image?.url || selectedCoffee.image || "https://placehold.co/150?text=No+Img"} 
                        alt={selectedCoffee.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{selectedCoffee.name}</h4>
                      <p className="text-xs text-gray-500">
                        Matches: {selectedCoffee.bestPairedArtMood?.join(", ") || "N/A"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-white border-t rounded-b-xl flex justify-end gap-3 sticky bottom-0 z-10">
          <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md">
            {loading ? "Saving..." : "Save Artwork"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminArtForm;