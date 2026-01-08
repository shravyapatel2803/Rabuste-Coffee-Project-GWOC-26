import { useState, useEffect } from "react";
import {
  updateAdminItem,
  createAdminItem,
  fetchItemCategories,
  fetchItemTypes,
} from "../../api/Items"; 

const ROAST_TYPES = ["light", "medium", "dark", "extra-dark"];
const JSON_FIELDS = ["artPairedMood", "artPairingExplanation"];

const INITIAL_FORM_STATE = {
  name: "",
  shortDescription: "",
  description: "",
  price: "",
  category: "",
  type: "", 
  visibility: "public",
  showIn: ["menu"],
  roastType: "",
  strengthLevel: "",
  bitterness: "",
  caffeineLevel: "",
  milkBased: false,
  flavorNotes: [],
  bestForMood: [],
  bestTime: [],
  tags: [],
  artPairedMood: [], 
  artPairingExplanation: {},
  isSoldOut: false,
};

const AdminItemForm = ({ mode = "add", item: existingItem, onClose, onSuccess }) => {
  const isEdit = mode === "edit";

  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [dirty, setDirty] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isCustomType, setIsCustomType] = useState(false);
  const [rawMoodInput, setRawMoodInput] = useState("");

  // load metadata
  useEffect(() => {
    const loadMeta = async () => {
      try {
        const [catRes, typeRes] = await Promise.all([
          fetchItemCategories(),
          fetchItemTypes(),
        ]);
        const normalize = (res) => Array.isArray(res?.data) ? res.data : res?.data?.data || [];
        setCategories(normalize(catRes));
        setTypes(normalize(typeRes));
      } catch (err) {
        console.error("Meta load failed", err);
      }
    };
    loadMeta();
  }, []);

  // load 
  useEffect(() => {
    if (isEdit && existingItem) {
      // Safely parse Art Moods from Backend Keys
      const backendMoods = existingItem.bestPairedArtMood || existingItem.artPairedMood || [];
      const moodsArray = Array.isArray(backendMoods) ? backendMoods : [backendMoods];
      const backendExplanation = existingItem.pairingExplanation || existingItem.artPairingExplanation || {};

      // Fix Type: Handle Array or String
      let loadedType = "";
      if (Array.isArray(existingItem.type) && existingItem.type.length > 0) {
        loadedType = existingItem.type[0];
      } else if (typeof existingItem.type === "string") {
        loadedType = existingItem.type;
      }

      setForm({
        ...INITIAL_FORM_STATE,
        ...existingItem,

        category: existingItem.category || "",
        type: loadedType, 
        
        price: existingItem.price || "",
        visibility: existingItem.visibility || "public",
        showIn: existingItem.showIn || ["menu"],
        
        // Ensure numbers are not null (Fixes React Warning)
        roastType: existingItem.roastType || "",
        strengthLevel: existingItem.strengthLevel || "",
        bitterness: existingItem.bitterness || "",
        caffeineLevel: existingItem.caffeineLevel || "",

        flavorNotes: existingItem.flavorNotes || [],
        bestForMood: existingItem.bestForMood || [],
        bestTime: existingItem.bestTime || [],
        tags: existingItem.tags || [],

        artPairedMood: moodsArray,
        artPairingExplanation: backendExplanation,
        
        isSoldOut: existingItem.availability?.isSoldOut ?? false,
      });

      setRawMoodInput(moodsArray.join(", "));
      setDirty({}); 
      if (existingItem.image?.url) setImagePreview(existingItem.image.url);
    } else {
      setForm(INITIAL_FORM_STATE);
      setRawMoodInput("");
      setDirty({});
      setImagePreview("");
      setImageFile(null);
    }
  }, [isEdit, existingItem]);

  // handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setDirty((prev) => ({ ...prev, [name]: true }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleMulti = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value.split(",").map((v) => v.trim()).filter(Boolean),
    }));
    setDirty((prev) => ({ ...prev, [name]: true }));
  };

  const handleMoodInputChange = (e) => {
    const val = e.target.value;
    setRawMoodInput(val);
    const parsedMoods = val.split(/[,;]+/).map(s => s.trim()).filter(Boolean);
    setForm((prev) => ({ ...prev, artPairedMood: parsedMoods }));
    setDirty((prev) => ({ ...prev, artPairedMood: true }));
  };

  const updateArtExplanation = (mood, text) => {
    setForm((prev) => ({
      ...prev,
      artPairingExplanation: {
        ...prev.artPairingExplanation,
        [mood]: text,
      },
    }));
    setDirty((prev) => ({ ...prev, artPairingExplanation: true }));
  };

  const handleCategorySelect = (e) => {
    const val = e.target.value;
    if (val === "__NEW__") {
      setIsCustomCategory(true);
      setForm(p => ({ ...p, category: "" }));
    } else {
      setIsCustomCategory(false);
      setForm(p => ({ ...p, category: val }));
    }
    setDirty((p) => ({ ...p, category: true })); 
  };

  const handleTypeSelect = (e) => {
    const val = e.target.value;
    if (val === "__NEW__") {
      setIsCustomType(true);
      setForm(p => ({ ...p, type: "" }));
    } else {
      setIsCustomType(false);
      setForm(p => ({ ...p, type: val })); 
    }
    setDirty((p) => ({ ...p, type: true }));
  };

  // submit
  const handleSubmit = async (e, forceDraft = false) => {
  if (e) e.preventDefault();

  if (!isEdit && !imageFile) {
    setError("Image is required for new items");
    return;
  }

  if (!form.category) {
    alert("Category is required");
    return;
  }

  if (!form.showIn || form.showIn.length === 0) {
    alert("At least one 'Show In' option must be selected");
    return;
  }

  setLoading(true);
  setError("");

  const data = new FormData();

  const finalForm = {
    ...form,
    bestPairedArtMood: form.artPairedMood,
    pairingExplanation: form.artPairingExplanation,
  };

  if (forceDraft) finalForm.visibility = "hidden";

  const ALWAYS_SEND = [
  "name",
  "description",
  "price",
  "category",
  "type",
  "showIn",
  "visibility",
  "isSoldOut",
];

Object.entries(finalForm).forEach(([k, v]) => {

  if (isEdit) {
    let isKeyDirty = dirty[k];

    if (k === "artPairedMood" || k === "artPairingExplanation") {
      if (dirty.artPairedMood || dirty.artPairingExplanation) {
        isKeyDirty = true;
      }
    }

    if (!isKeyDirty && !ALWAYS_SEND.includes(k)) return;
  }

  if (k === "artPairedMood" || k === "artPairingExplanation") return;

  if (k === "bestPairedArtMood" || k === "pairingExplanation") {
    data.append(k, JSON.stringify(v || {}));
  } 
  else if (Array.isArray(v)) {
    v.forEach((item) => data.append(k, item));
  } 
  else if (typeof v === "object" && v !== null) {
    data.append(k, JSON.stringify(v));
  } 
  else {
    if (
      isEdit &&
      ["strengthLevel", "bitterness", "caffeineLevel"].includes(k) &&
      (v === "" || v === null || v === undefined)
    ) {
      return;
    }
    data.append(k, v);
  }
});


  if (imageFile) {
    data.append("image", imageFile);
  }

  try {
    if (isEdit) {
      await updateAdminItem(existingItem._id, data);
    } else {
      await createAdminItem(data);
    }

    onSuccess?.();
  } catch (err) {
    console.error(err);
    setError(err?.response?.data?.message || "Failed to save item");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-white rounded-t-2xl sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{isEdit ? "Edit Product" : "New Product Entry"}</h2>
            <p className="text-sm text-gray-500">Manage product details, pricing and visibility.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">✕</button>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <h3 className="font-semibold text-gray-700 border-b pb-2">Basic Details</h3>
                <input name="name" placeholder="Item Name *" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" value={form.name} onChange={handleChange} />
                
                <div className="grid grid-cols-2 gap-4">
                  {isCustomCategory ? (
                     <div className="flex gap-2 items-center">
                        <input name="category" value={form.category} onChange={handleChange} placeholder="New Category..." className="w-full border p-3 rounded-lg" autoFocus />
                        <button type="button" onClick={() => setIsCustomCategory(false)} className="text-red-500 text-sm underline whitespace-nowrap">Cancel</button>
                     </div>
                  ) : (
                    <select value={form.category ?? ""} onChange={handleCategorySelect} className="w-full border p-3 rounded-lg bg-white">
                        <option value="">Select Category *</option>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                        <option disabled>──────────</option>
                        <option value="__NEW__" className="text-orange-600 font-bold">+ Add New Category</option>
                    </select>
                  )}

                  {isCustomType ? (
                     <div className="flex gap-2 items-center">
                        <input name="type" value={form.type} onChange={handleChange} placeholder="New Type..." className="w-full border p-3 rounded-lg" autoFocus />
                        <button type="button" onClick={() => setIsCustomType(false)} className="text-red-500 text-sm underline whitespace-nowrap">Cancel</button>
                     </div>
                  ) : (
                    <select value={form.type ?? ""} onChange={handleTypeSelect} className="w-full border p-3 rounded-lg bg-white">
                        <option value="">Select Type *</option>
                        {types.map((t) => <option key={t} value={t}>{t}</option>)}
                        <option disabled>──────────</option>
                        <option value="__NEW__" className="text-orange-600 font-bold">+ Add New Type</option>
                    </select>
                  )}
                </div>

                <textarea name="shortDescription" placeholder="Short Description" rows={2} className="w-full border p-3 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 outline-none" value={form.shortDescription} onChange={handleChange} />
                <textarea name="description" placeholder="Full Description" rows={4} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" value={form.description} onChange={handleChange} />
              </div>

              {/* Art Pairing (Always Visible) */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <span className="text-xl">🎨</span>
                  <h3 className="font-semibold text-gray-700">Art Pairing & Experience</h3>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Art Moods (comma separated)</label>
                  <input value={rawMoodInput} onChange={handleMoodInputChange} placeholder="e.g. Calm, Abstract, Dark" className="w-full border p-3 rounded-lg mt-1" />
                </div>
                {form.artPairedMood.length > 0 && (
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    {form.artPairedMood.map((mood) => (
                      <div key={mood}>
                        <label className="text-sm font-bold text-gray-700">Explanation for: <span className="text-orange-600">{mood}</span></label>
                        <textarea value={form.artPairingExplanation[mood] || ""} onChange={(e) => updateArtExplanation(mood, e.target.value)} rows={2} className="w-full border p-2 rounded mt-1 text-sm focus:ring-1 focus:ring-orange-500" placeholder={`Why does this pair with ${mood} art?`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Coffee Profile */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <h3 className="font-semibold text-gray-700 border-b pb-2">Profile</h3>
                <div className="grid grid-cols-2 gap-4">
                  <select name="roastType" value={form.roastType ?? ""} onChange={handleChange} className="w-full border p-3 rounded-lg bg-white">
                    <option value="">Select Roast</option>
                    {ROAST_TYPES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" name="milkBased" checked={form.milkBased} onChange={handleChange} className="w-5 h-5 text-orange-600 rounded" />
                    <span className="text-gray-700 font-medium">Milk Based?</span>
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-4">
                   {["strengthLevel", "bitterness", "caffeineLevel"].map(field => (
                     <div key={field} className="text-center">
                        <label className="text-xs font-bold text-gray-400 uppercase block mb-1">{field.replace("Level", "")}</label>
                        <select name={field} value={form[field] ?? ""} onChange={handleChange} className="w-full border p-2 rounded text-center">
                           <option value="">-</option>
                           {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                     </div>
                   ))}
                </div>
              </div>

              {/* AI Tags */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                 <h3 className="font-semibold text-gray-700 border-b pb-2">AI Tags</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["flavorNotes", "bestForMood", "bestTime", "tags"].map((field) => (
                      <div key={field}>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                        <input placeholder="Comma separated" className="w-full border p-2 rounded text-sm" defaultValue={form[field].join(", ")} onBlur={(e) => handleMulti(field, e.target.value)} />
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <label className="block text-sm font-bold text-gray-700 mb-3">Product Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-2 hover:border-orange-500 transition-colors relative h-64 bg-gray-50 flex items-center justify-center">
                  {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" /> : <div className="text-gray-400 text-center"><span className="block text-2xl mb-1">📷</span><span className="text-sm">Click to upload</span></div>}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">
                <h3 className="font-semibold text-gray-700 border-b pb-2">Publishing</h3>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Visibility</label>
                  <select name="visibility" value={form.visibility ?? "public"} onChange={handleChange} className="w-full border p-2 rounded">
                    <option value="public">Public</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Price (INR)</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full border p-2 rounded font-bold text-gray-800" placeholder="0.00" />
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Show In</label>
                   <div className="flex gap-2">
                      {["menu", "shop"].map(opt => (
                        <label key={opt} className={`flex-1 border p-2 text-center rounded cursor-pointer text-sm select-none transition-colors ${form.showIn.includes(opt) ? "bg-orange-50 border-orange-500 text-orange-700 font-bold" : "bg-white text-gray-600"}`}>
                           <input type="checkbox" className="hidden" checked={form.showIn.includes(opt)} onChange={() => {
                                const newVal = form.showIn.includes(opt) ? form.showIn.filter(x => x !== opt) : [...form.showIn, opt];
                                setForm(prev => ({ ...prev, showIn: newVal }));
                                setDirty(prev => ({ ...prev, showIn: true }));
                              }} />
                           {opt.toUpperCase()}
                        </label>
                      ))}
                   </div>
                </div>
                <div className="border-t pt-4 space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">Sold Out</span>
                    <input type="checkbox" name="isSoldOut" checked={form.isSoldOut} onChange={handleChange} className="w-5 h-5 accent-red-500" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="px-6 py-4 bg-white border-t rounded-b-2xl flex justify-end gap-3">
          {mode === "add" && <button onClick={() => handleSubmit(null, true)} className="px-6 py-2 border rounded-lg hover:bg-gray-50 text-gray-700 font-medium" disabled={loading}>Save as Draft</button>}
          <button onClick={(e) => handleSubmit(e, false)} disabled={loading} className="px-8 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium shadow-md disabled:opacity-50">{loading ? "Processing..." : isEdit ? "Update Item" : "Publish Item"}</button>
        </div>
      </div>
    </div>
  );
};

export default AdminItemForm;