import { useState, useEffect } from "react";
import {updateAdminItem , createAdminItem, fetchAdminCategories, fetchAdminTypes, fetchAdminRoastTypes} from "../api/adminItems";

const AdminAddItem = ({mode = "add", existingItem, onSuccess,onCancel,}) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    type: "",
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
    isSoldOut: false,
  });

  /* DYNAMIC OPTIONS */
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [roastTypes, setRoastTypes] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newType, setNewType] = useState("");
  const [newRoastType, setNewRoastType] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddType, setShowAddType] = useState(false);
  const [showAddRoast, setShowAddRoast] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);


  /* FETCH ADMIN METADATA*/
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [cat, type, roast] = await Promise.all([
          fetchAdminCategories(),
          fetchAdminTypes(),
          fetchAdminRoastTypes(),
        ]);

        setCategories(cat.data || []);
        setTypes(type.data || []);
        setRoastTypes(roast.data || []);
      } catch {
        console.error("Metadata fetch failed");
      }
    };

    fetchMeta();
  }, []);

  /*  PREFILL FORM IN EDIT MODE  */
  useEffect(() => {
    if (!existingItem) return;

    setForm({
      name: existingItem.name || "",
      description: existingItem.description || "",
      price: existingItem.price || "",
      category: existingItem.category || "",
      type: existingItem.type || "",
      roastType: existingItem.roastType || "",
      strengthLevel: existingItem.strengthLevel ?? "",
      bitterness: existingItem.bitterness ?? "",
      caffeineLevel: existingItem.caffeineLevel ?? "",
      milkBased: existingItem.milkBased ?? false,
      showIn: existingItem.showIn || [],
      flavorNotes: existingItem.flavorNotes || [],
      bestForMood: existingItem.bestForMood || [],
      bestTime: existingItem.bestTime || [],
      tags: existingItem.tags || [],
      isSoldOut: existingItem.availability?.isSoldOut ?? false,
    });
    if (existingItem.image?.url) {
    setImagePreview(existingItem.image.url);
  }
  }, [existingItem]);


  /* HANDLERS */
  const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };

  const handleMultiInput = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
    }));
  };

  /* SUBMIT (ADD / EDIT)*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("description", form.description);
      data.append("price", form.price !== "" ? form.price : "0");
      data.append("category", form.category);
      data.append("type", form.type);
      data.append("roastType", form.roastType || "");
      data.append("showIn", JSON.stringify(form.showIn || []));
      data.append("flavorNotes", JSON.stringify(form.flavorNotes || []));
      data.append("bestForMood", JSON.stringify(form.bestForMood || []));
      data.append("bestTime", JSON.stringify(form.bestTime || []));
      data.append("tags", JSON.stringify(form.tags || []));
      data.append("strengthLevel",form.strengthLevel === "" || form.strengthLevel === null? "null": form.strengthLevel);
      data.append("bitterness",form.bitterness === "" || form.bitterness === null? "null": form.bitterness);
      data.append("caffeineLevel",form.caffeineLevel === "" || form.caffeineLevel === null? "null": form.caffeineLevel);
      data.append("milkBased", form.milkBased ? "true" : "false");
      data.append("isSoldOut", form.isSoldOut ? "true" : "false");

      if (imageFile) {
        data.append("image", imageFile);
      }

      if (mode === "edit") {
        await updateAdminItem(existingItem._id, data);
      } else {
        await createAdminItem(data);
      }

      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Failed to save item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[rgb(var(--color-surface))] border border-white/10 rounded-xl flex flex-col max-h-[calc(100vh-80px)]"
    >
      {/* FIXED HEADER */}
      <div className="sticky top-0 z-10 bg-[rgb(var(--color-surface))] px-6 py-4 border-b border-white/10">
        <h2 className="text-xl font-semibold">
          {mode === "edit" ? "Update Item" : "Add Item"}
        </h2>
      </div>

      {/* SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-10">
        {/* BASIC */}
        <div className="grid md:grid-cols-2 gap-6">
          <input required name="name" placeholder="Item Name" value={form.name} onChange={handleChange} className="input-field" />
          <input required name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} className="input-field" />
        </div>

        <textarea required name="description" rows={3} placeholder="Description" value={form.description} onChange={handleChange} className="input-field" />
        {/* CATEGORY + TYPE */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <select required value={form.category} className="input-field"
              onChange={(e) => {
                if (e.target.value === "__add_new__") setShowAddCategory(true);
                else {
                  setForm({ ...form, category: e.target.value });
                  setShowAddCategory(false);
                }
              }}
            >
              <option value="">Select Category</option>
              <option value="__add_new__">+ Add Category</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            {showAddCategory && (
              <input className="input-field mt-2" placeholder="New Category"
                value={newCategory}
                onChange={(e) => {
                  setNewCategory(e.target.value);
                  setForm({ ...form, category: e.target.value });
                }}
              />
            )}
          </div>

          <div>
            <select required value={form.type} className="input-field"
              onChange={(e) => {
                if (e.target.value === "__add_new__") setShowAddType(true);
                else {
                  setForm({ ...form, type: e.target.value });
                  setShowAddType(false);
                }
              }}
            >
              <option value="">Select Type</option>
              <option value="__add_new__">+ Add Type</option>
              {types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>

            {showAddType && (
              <input className="input-field mt-2" placeholder="New Type"
                value={newType}
                onChange={(e) => {
                  setNewType(e.target.value);
                  setForm({ ...form, type: e.target.value });
                }}
              />
            )}
          </div>
        </div>

        {/* SHOW IN */}
        <select className="input-field"
          value={form.showIn.length === 2 ? "both" : form.showIn[0]}
          onChange={(e) =>
            setForm({
              ...form,
              showIn: e.target.value === "both" ? ["menu", "shop"] : [e.target.value],
            })
          }
        >
          <option value="menu">Menu</option>
          <option value="shop">Shop</option>
          <option value="both">Both</option>
        </select>

        {/* COFFEE PROFILE */}
        <div className="grid md:grid-cols-4 gap-6">
           <div>
              <select  value={form.roastType} className="input-field" 
                onChange={(e) => {
                  if (e.target.value === "__add_new__") setShowAddRoast(true);
                  else {
                    setForm({ ...form, roastType: e.target.value });
                    setShowAddRoast(false);
                  }
                }}
              >
                <option value="">Select Roast Type</option>
                <option value="__add_new__">+ Add Roast Type</option>           
                {roastTypes.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              
              {showAddRoast && (
                <input className="input-field mt-2" placeholder="New Roast Type"
                  value={newRoastType}
                  onChange={(e) => {
                    setNewRoastType(e.target.value);
                    setForm({ ...form, roastType: e.target.value });
                  }}
                />
              )}
           </div>
          <select name="strengthLevel" value={form.strengthLevel} onChange={handleChange}  className="input-field">
            <option value="disabled">select strength</option>
            {[1,2,3,4,5].map(v => <option key={v} value={v}>Strength {v}</option>)}
          </select>

          <select name="bitterness" value={form.bitterness} onChange={handleChange}  className="input-field">
            <option value="disabled">select bitterness</option>
            {[1,2,3,4,5].map(v => <option key={v} value={v}>Bitterness {v}</option>)}
          </select>

          <select name="caffeineLevel" value={form.caffeineLevel} onChange={handleChange}  className="input-field">
            <option value="disabled">select caffeine</option>
            {[0,1,2,3,4,5].map(v => <option key={v} value={v}>Caffeine {v}</option>)}
          </select>
        </div>

        <label className="text-sm">
          <input type="checkbox" name="milkBased" checked={form.milkBased} onChange={handleChange}  /> Milk Based
        </label>

        {/* AI + FILTER DATA */}
        <input className="input-field" placeholder="Flavor Notes (comma separated)" value={form.flavorNotes} onChange={(e) => handleMultiInput("flavorNotes", e.target.value)} />
        <input className="input-field" placeholder="Best For Mood (energetic, relaxed...)" value={form.bestForMood} onChange={(e) => handleMultiInput("bestForMood", e.target.value)} />
        <input className="input-field" placeholder="Best Time (morning, evening...)" value={form.bestTime} onChange={(e) => handleMultiInput("bestTime", e.target.value)} />
        <input className="input-field" placeholder="Tags (bestseller, vegan...)" value={form.tags} onChange={(e) => handleMultiInput("tags", e.target.value)} />

        {/*AVAILABILITY */}
        <div className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isSoldOut}
            onChange={(e) =>
              setForm(prev => ({
                ...prev,
                availability: {
                  ...prev.availability,
                  isSoldOut: e.target.checked,
                }
              }))
            }
          />
          <label htmlFor="soldOut">Sold Out</label>
        </div>

        {/* IMAGE */}
        {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-md border"
            />
          )}

        <input type="file" accept="image/*" required={mode === "add" && !existingItem?.image} 
         onChange={(e) => {
            const file = e.target.files[0];
            setImageFile(file);
            if (file) {
              setImagePreview(URL.createObjectURL(file));
            }
          }}
         />

      </div>

      {/*FIXED FOOTER */}
      <div className="sticky bottom-0 bg-[rgb(var(--color-surface))] px-6 py-4 border-t border-white/10 flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="w-1/2 py-3 border rounded-md font-semibold"
        >
          Cancel
        </button>

        <button
          disabled={loading}
          className="w-1/2 py-3 bg-[rgb(var(--color-gold))] text-black font-semibold rounded-md"
        >
          {loading
            ? "Saving..."
            : mode === "edit"
            ? "Update Item"
            : "Add Item"}
        </button>
      </div>
    </form>
  );
};

export default AdminAddItem;
