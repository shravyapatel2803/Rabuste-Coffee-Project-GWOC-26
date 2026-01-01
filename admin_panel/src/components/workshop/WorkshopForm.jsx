import React, { useState, useEffect } from "react";
import { X, Loader2, Calendar, Clock, DollarSign, Users, Image as ImageIcon, AlignLeft, Tag, Eye } from "lucide-react";

const convertTo24Hour = (timeStr) => {
  if (!timeStr) return "";
  if (!timeStr.toLowerCase().includes('m')) return timeStr;
  
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (hours === '12') {
    hours = '00';
  }
  
  if (modifier.toLowerCase() === 'pm') {
    hours = parseInt(hours, 10) + 12;
  }
  
  return `${hours}:${minutes}`;
};

const WorkshopForm = ({ onClose, onSubmit, isLoading, initialData }) => {
  
  const [formData, setFormData] = useState({
    title: "",
    category: "coffee",
    description: "",
    shortDescription: "",
    date: "",
    startTime: "",
    endTime: "",
    price: "",
    capacity: "",
    visibility: "public",
    isFeatured: false
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (initialData) {
      // 1. Date formatting
      let formattedDate = "";
      if (initialData.date) {
        try {
          formattedDate = new Date(initialData.date).toISOString().split('T')[0];
        } catch (err) {
          console.error("Date Error:", err);
        }
      }

      const formattedStartTime = convertTo24Hour(initialData.startTime);
      const formattedEndTime = convertTo24Hour(initialData.endTime);

      setFormData({
        title: initialData.title || "",
        category: initialData.category || "coffee",
        description: initialData.description || "",
        shortDescription: initialData.shortDescription || "",
        date: formattedDate,
        startTime: formattedStartTime, 
        endTime: formattedEndTime,    
        price: initialData.price || "",
        capacity: initialData.capacity || "",
        visibility: initialData.visibility || "public",
        isFeatured: initialData.isFeatured || false
      });

      if (initialData.image && initialData.image.url) {
        setPreviewUrl(initialData.image.url);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (imageFile) {
      data.append("image", imageFile);
    }
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {initialData ? "Edit Workshop" : "Add New Workshop"}
            </h2>
            <p className="text-sm text-gray-500">
              {initialData ? "Update workshop details" : "Fill in the details based on the schema"}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors bg-white p-2 rounded-full shadow-sm">
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Title</label>
              <input 
                type="text" name="title" required
                value={formData.title} onChange={handleChange}
                placeholder="e.g. Latte Art Masterclass"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Tag size={14}/> Category
              </label>
              <select 
                name="category" required
                value={formData.category} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="coffee">Coffee</option>
                <option value="art">Art</option>
                <option value="community">Community</option>
                <option value="special">Special</option>
              </select>
            </div>
          </div>

          {/*  Image Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon size={14}/> Cover Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors relative">
              <input 
                type="file" accept="image/*" 
                required={!initialData && !previewUrl} 
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {previewUrl ? (
                <div className="relative h-40 w-full">
                   <img src={previewUrl} alt="Preview" className="h-full w-full object-contain rounded-md" />
                   <p className="text-xs text-gray-500 mt-2">Click to change image</p>
                </div>
              ) : (
                <div className="py-8">
                  <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-blue-500 mb-2">
                    <ImageIcon size={24} />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Click to upload image</p>
                </div>
              )}
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Short Description</label>
              <input 
                type="text" name="shortDescription" 
                value={formData.shortDescription} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <AlignLeft size={14}/> Full Description
              </label>
              <textarea 
                name="description" required rows="4"
                value={formData.description} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              ></textarea>
            </div>
          </div>

          {/*  Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={14}/> Date
              </label>
              <input 
                type="date" name="date" required
                value={formData.date} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Clock size={14}/> Start Time
              </label>
              <input 
                type="time" name="startTime" required
                value={formData.startTime} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Clock size={14}/> End Time
              </label>
              <input 
                type="time" name="endTime" 
                value={formData.endTime} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Logistics & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Users size={14}/> Capacity
              </label>
              <input 
                type="number" name="capacity" required min="1"
                value={formData.capacity} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <DollarSign size={14}/> Price (₹)
              </label>
              <input 
                type="number" name="price" required min="0"
                value={formData.price} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/*  Settings */}
          <div className="bg-gray-50 p-4 rounded-lg flex flex-col md:flex-row gap-6 justify-between items-center border border-gray-200">
             <div className="flex items-center gap-3 w-full md:w-auto">
                <label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-2">
                  <Eye size={14}/> Visibility:
                </label>
                <div className="flex bg-white rounded-md border border-gray-300 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, visibility: 'public'})}
                    className={`px-3 py-1.5 text-xs font-bold ${formData.visibility === 'public' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, visibility: 'hidden'})}
                    className={`px-3 py-1.5 text-xs font-bold ${formData.visibility === 'hidden' ? 'bg-gray-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Hidden
                  </button>
                </div>
             </div>

             <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input 
                    type="checkbox" name="isFeatured" 
                    checked={formData.isFeatured} onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </div>
                <span className="text-xs font-bold text-gray-700 uppercase">Mark as Featured</span>
             </label>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button 
              type="button" onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" disabled={isLoading}
              className="px-6 py-3 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18}/> : null}
              {initialData ? "Update Workshop" : "Create Workshop"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkshopForm;