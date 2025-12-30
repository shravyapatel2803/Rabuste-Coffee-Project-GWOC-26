import React, { useState, useEffect } from "react";
import { fetchArtOptions } from "../../api/Arts";

const ArtToolbar = ({
  filters = {},
  setFilters = () => {},
  onAdd = () => {},
}) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const loadLocations = async () => {
      try {
   
        const data = await fetchArtOptions();
      
        if (data && Array.isArray(data.locations)) {
          setLocations(data.locations);
        }
      } catch (err) {
        console.error("Failed to load locations", err);
      }
    };
    loadLocations();
  }, []);

  return (
    <div className="bg-white border rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:flex-wrap">
  
        <input
          type="text"
          placeholder="Search artwork or artist..."
          className="border px-4 py-2 rounded-md w-full lg:w-64 focus:ring-2 focus:ring-indigo-500 outline-none"
          value={filters.search || ""}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
        />

        <select
          className="border px-3 py-2 rounded-md w-full lg:w-56 focus:ring-2 focus:ring-indigo-500 outline-none bg-white cursor-pointer"
          value={filters.location || ""}
          onChange={(e) =>
            setFilters({ ...filters, location: e.target.value })
          }
        >
          <option value="">All Locations</option>
          {locations.map((loc, index) => (
            <option key={index} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded-md w-full lg:w-auto focus:ring-2 focus:ring-indigo-500 outline-none bg-white cursor-pointer"
          value={filters.status || ""}
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="">All Status</option>
          <option value="available">🟢 Available</option>
          <option value="sold">🔴 Sold</option>
          <option value="not_for_sale">🔒 Not For Sale</option>
        </select>

        <select
          className="border px-3 py-2 rounded-md w-full lg:w-auto focus:ring-2 focus:ring-indigo-500 outline-none bg-white cursor-pointer"
          value={filters.isDisplayed || ""}
          onChange={(e) =>
            setFilters({ ...filters, isDisplayed: e.target.value })
          }
        >
          <option value="">All Visibility</option>
          <option value="true">On Display</option>
          <option value="false">In Storage</option>
        </select>

        {/* Actions (Clear & Add) */}
        <div className="flex gap-2 w-full lg:w-auto ml-auto">
          <button
            onClick={() =>
              setFilters({
                search: "",
                location: "",
                status: "",
                isDisplayed: "",
              })
            }
            className="text-red-600 font-medium px-4 py-2 rounded-md hover:bg-red-50 border border-transparent hover:border-red-100 transition"
          >
            Clear
          </button>

          <button
            onClick={onAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium shadow-sm transition flex-1 lg:flex-none whitespace-nowrap"
          >
            + Add Artwork
          </button>
        </div>

      </div>
    </div>
  );
};

export default ArtToolbar;