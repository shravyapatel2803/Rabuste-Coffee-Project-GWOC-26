import React from "react";
import { Search, X, RotateCcw } from "lucide-react";

const Filters = ({ filters, setFilters, onClear }) => { 
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Filters</h3>
        
        <button 
          onClick={onClear}
          className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-full border border-red-100 transition-colors"
        >
          <RotateCcw size={12} /> Clear All
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-end">
        
        {/* Search Input */}
         <div className="w-full md:w-1/4">
          <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Search</label>
          <div className="relative">
            <input 
              type="text" 
              name="search"
              placeholder="Search Name or ID..."
              value={filters.search}
              onChange={handleChange}
              className="w-full p-2.5 pl-9 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800 focus:outline-none focus:border-blue-500"
            />
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Order Status */}
        <div className="w-full md:w-1/4">
          <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Order Status</label>
          <select 
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Placed">Placed</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready">Ready</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Payment Status */}
        <div className="w-full md:w-1/4">
          <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Payment Status</label>
          <select 
            name="paymentStatus"
            value={filters.paymentStatus}
            onChange={handleChange}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="All">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Pickup Date */}
        <div className="w-full md:w-1/4">
          <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Specific Date</label>
          <input 
            type="date" 
            name="date"
            value={filters.date}
            onChange={handleChange}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-500 focus:outline-none focus:border-blue-500 cursor-pointer"
          />
        </div>

      </div>
    </div>
  );
};

export default Filters;