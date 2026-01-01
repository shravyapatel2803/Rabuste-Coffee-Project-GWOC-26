import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Users, Calendar, Loader2, List } from "lucide-react";

import WorkshopForm from "../components/workshop/WorkshopForm"; 
import RegistrationsModal from "../components/workshop/RegistrationsModal";
import { getAllWorkshops, createWorkshop, deleteWorkshop, updateWorkshop } from "../api/Workshop"; 

const Workshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null); 

  // Registration Modal States
  const [viewRegistrationsId, setViewRegistrationsId] = useState(null); 
  const [viewRegistrationsTitle, setViewRegistrationsTitle] = useState("");

  // Load Data
  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const { data } = await getAllWorkshops();
      setWorkshops(data);
    } catch (error) {
      console.error("Failed to fetch workshops", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  // Open Form for Create
  const handleAddNew = () => {
    setSelectedWorkshop(null); 
    setIsFormOpen(true);
  };

  // Open Form for Edit (Prefill)
  const handleEdit = (workshop) => {
    setSelectedWorkshop(workshop); 
    setIsFormOpen(true);
  };

  // Handle Create AND Update
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedWorkshop) {
        // UPDATE Logic
        await updateWorkshop(selectedWorkshop._id, formData);
        alert("Workshop updated successfully!");
      } else {
        // CREATE Logic
        await createWorkshop(formData);
        alert("Workshop created successfully!");
      }
      
      setIsFormOpen(false);
      setSelectedWorkshop(null); 
      fetchWorkshops(); 

    } catch (error) {
      alert("Operation failed");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this workshop?")) {
      try {
        await deleteWorkshop(id);
        setWorkshops(workshops.filter(w => w._id !== id));
      } catch {
        alert("Failed to delete");
      }
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Workshop Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your coffee classes and events</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all active:scale-95"
        >
          <Plus size={20} /> Add New Workshop
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {loading ? (
          <div className="p-20 flex justify-center text-gray-500">
            <Loader2 className="animate-spin mr-2" /> Loading Workshops...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-5 font-bold">Title & Instructor</th>
                  <th className="p-5 font-bold">Date & Time</th>
                  <th className="p-5 font-bold">Price</th>
                  <th className="p-5 font-bold">Participants</th>
                  <th className="p-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {workshops.length > 0 ? (
                  workshops.map((workshop) => (
                    <tr key={workshop._id} className="hover:bg-gray-50/80 transition-colors group">
                      
                      {/* Title */}
                      <td className="p-5">
                        <div className="font-bold text-gray-800 text-base">{workshop.title}</div>
                        <div className="text-gray-500 text-xs mt-0.5 flex items-center gap-1">
                          by <span className="font-medium text-blue-600">{workshop.instructor}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                          <Calendar size={14} className="text-gray-400" />
                          {new Date(workshop.date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 pl-6">
                          {workshop.startTime}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="p-5 font-bold text-gray-800">
                        {workshop.isFree ? "FREE" : `₹${workshop.price}`}
                      </td>

                      {/* Participants */}
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {workshop.registeredCount || 0} / {workshop.capacity}
                          </span>
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-2">
                          
                          {/* View Registrations Button */}
                          <button 
                            onClick={() => {
                              setViewRegistrationsId(workshop._id);
                              setViewRegistrationsTitle(workshop.title);
                            }}
                            className="p-2 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
                            title="View Registrations"
                          >
                            <List size={16} />
                          </button>

                          <button 
                            onClick={() => handleEdit(workshop)} 
                            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(workshop._id)}
                            className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-gray-400">
                      No workshops found. Create one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* View Registrations Modal */}
      {viewRegistrationsId && (
        <RegistrationsModal 
          workshopId={viewRegistrationsId}
          workshopTitle={viewRegistrationsTitle}
          onClose={() => setViewRegistrationsId(null)}
        />
      )}

      {/* Modal Form */}
      {isFormOpen && (
        <WorkshopForm 
          onClose={() => setIsFormOpen(false)} 
          onSubmit={handleFormSubmit} 
          isLoading={isSubmitting}
          initialData={selectedWorkshop} 
        />
      )}
      
    </div>
  );
};

export default Workshops;