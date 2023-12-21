// LocationSearchComponent.js
import React, { useState, useContext } from "react";
import axios from "axios";
import { LocationContext, LocationState } from "../contexts/LocationContext"; // Import your LocationContext

const LocationSearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { setLocation, getLocation } = useContext(LocationContext); // Use setLocation from context

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  interface SearchResult {
    importance: number;
    lat: number;
    lon: number;
    display_name: string;
  }

  const selectMostRelevantLocation = (searchResults: Array<SearchResult>) => {
    // Example criteria: select the result with the highest importance score
    let mostRelevant = null;
    let highestImportance = 0;

    for (const result of searchResults) {
      if (result.importance > highestImportance) {
        mostRelevant = result;
        highestImportance = result.importance;
      }
    }

    return mostRelevant;
  };

  const handleSearchSubmit = async () => {
    try {
      const response = await axios.get(
        `https://geocode.maps.co/search?q=${searchTerm}`,
      );
      const results = response.data;
      const mostRelevantLocation = selectMostRelevantLocation(results);
      if (mostRelevantLocation) {
        const { lat, lon, display_name } = mostRelevantLocation;
        console.log(mostRelevantLocation);
        setLocation(
          (previousState: LocationState): LocationState => ({
            ...previousState,
            latitude: lat,
            longitude: lon,
          }),
        );
      } else {
        console.log("Location not found.");
      }
    } catch (error) {
      console.error("Error during location search:", error);
    } finally {
      setSearchTerm("");
    }
  };

  return (
    <div className="bg-white/80 rounded-md p-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Enter town name"
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onSubmit={handleSearchSubmit}
        />
        <button
          onClick={handleSearchSubmit}
          className="bg-blue/60 hover:bg-blue-600 text-white font-bold p-2 px-4 rounded-md transition-colors"
        >
          Search
        </button>
        <button
          onClick={getLocation}
          className="bg-blue/60 hover:bg-blue-600 text-white font-bold p-2 px-4 rounded-md transition-colors"
        >
          Use My Location
        </button>
      </div>
    </div>
  );
};

export default LocationSearchComponent;
