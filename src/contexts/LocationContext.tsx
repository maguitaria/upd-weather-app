// LocationContext.js
import React, { createContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  town: string;
  county: string; // ???
  country: string;
}

const defaultLocation: LocationState = {
  latitude: null,
  longitude: null,
  town: "",
  country: "",
  county: "",
};

export const getLocationStr = (location: LocationState) => {
  const parts = [location.country, location.county, location.town].filter(
    Boolean,
  ); // Filter out any undefined or empty parts
  return parts.join(", "); // Join the parts with a comma and space
};

interface LocationContextProps {
  location: LocationState; // Using own defined type for own defined stuff
  error: string;
  setLocation: (unit: (previousState: LocationState) => LocationState) => void;
  getLocation: () => void;
}

export const LocationContext = createContext<LocationContextProps>({
  location: defaultLocation,
  error: "",
  getLocation: () => defaultLocation,
  setLocation: () => defaultLocation,
});

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({
  children,
}) => {
  const [location, setLocation] = useState<LocationState>(defaultLocation);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.latitude && location.longitude) {
      getTownName(location.latitude, location.longitude);
    }
  }, [location.latitude, location.longitude]);

  const handleLocationSuccess = async (position: GeolocationPosition) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    setLocation((prevState) => ({
      ...prevState,
      latitude: latitude,
      longitude: longitude,
    }));
    await getTownName(latitude, longitude);
  };

  const handleLocationError = (error: GeolocationPositionError) => {
    setError(error.message);
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(
        handleLocationSuccess,
        handleLocationError,
      );
    }
  };

  const getTownName = async (latitude: number, longitude: number) => {
    const url = `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`;

    try {
      const response = await axios.get(url);
      const result = response.data;
      const townName = result.address.town || result.address.city || "";
      const countyName =
        result.address.municipality ||
        result.address.county ||
        result.address.state ||
        "";
      const countryName = result.address.country || "";

      if (result && result.address && result.address.town) {
        setLocation((prevState) => ({
          ...prevState,
          town: townName,
          county: countyName,
          country: countryName,
        }));
      } else {
        console.log("No town found for these coordinates.");
        console.log(location);
        setLocation((prevState) => ({
          ...prevState,
          county: countyName,
          country: countryName,
        }));
      }
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
    }
  };

  return (
    <LocationContext.Provider
      value={{ location, error, getLocation, setLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};
