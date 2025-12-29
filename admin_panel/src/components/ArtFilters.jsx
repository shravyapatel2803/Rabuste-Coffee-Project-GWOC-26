import { useEffect, useState } from "react";
import {fetchAdminArtStyles,fetchAdminArtMoods,fetchAdminArtDisplayLocations,} from "../api/adminArt";

const formatLabel = (value) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const unique = (arr) => [...new Set(arr)];

const ArtFilters = ({ filters, setFilters }) => {
  const [styles, setStyles] = useState([]);
  const [moods, setMoods] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchAdminArtStyles()
      .then((res) => setStyles(unique(res.data)))
      .catch(console.error);

    fetchAdminArtMoods()
      .then((res) => setMoods(unique(res.data)))
      .catch(console.error);

    fetchAdminArtDisplayLocations()
      .then((res) => setLocations(unique(res.data)))
      .catch(console.error);
  }, []);

  return (
    <div className="bg-white border rounded-xl p-4 mb-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search artworks..."
          className="border px-4 py-2 rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
        />

        {/* STYLE */}
        <select
          className="border px-3 py-2 rounded-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.artStyle}
          onChange={(e) =>
            setFilters({ ...filters, artStyle: e.target.value })
          }
        >
          <option value="">Style</option>
          {styles.map((style, index) => (
            <option key={`${style}-${index}`} value={style}>
              {formatLabel(style)}
            </option>
          ))}
        </select>

        {/* MOOD */}
        <select
          className="border px-3 py-2 rounded-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.artMood}
          onChange={(e) =>
            setFilters({ ...filters, artMood: e.target.value })
          }
        >
          <option value="">Mood</option>
          {moods.map((mood, index) => (
            <option key={`${mood}-${index}`} value={mood}>
              {formatLabel(mood)}
            </option>
          ))}
        </select>

        {/* AVAILABILITY */}
        <select
          className="border px-3 py-2 rounded-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.availabilityStatus}
          onChange={(e) =>
            setFilters({
              ...filters,
              availabilityStatus: e.target.value,
            })
          }
        >
          <option value="">Availability</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="not-for-sale">Not for Sale</option>
        </select>

        {/* DISPLAY LOCATION */}
        <select
          className="border px-3 py-2 rounded-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.displayLocation}
          onChange={(e) =>
            setFilters({
              ...filters,
              displayLocation: e.target.value,
            })
          }
        >
          <option value="">Display Location</option>
          {locations.map((loc, index) => (
            <option key={`${loc}-${index}`} value={loc}>
              {formatLabel(loc)}
            </option>
          ))}
        </select>

        {/* VISIBILITY */}
        <select
          className="border px-3 py-2 rounded-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.visibility}
          onChange={(e) =>
            setFilters({
              ...filters,
              visibility: e.target.value,
            })
          }
        >
          <option value="">Visibility</option>
          <option value="public">Public</option>
          <option value="hidden">Hidden</option>
        </select>

        {/* CLEAR */}
        <button
          onClick={() =>
            setFilters({
              search: "",
              artStyle: "",
              artMood: "",
              availabilityStatus: "",
              displayLocation: "",
              visibility: "",
            })
          }
          className="text-blue-600 font-medium px-3 py-2 rounded-md hover:bg-blue-50 transition w-full sm:w-auto text-center"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default ArtFilters;
