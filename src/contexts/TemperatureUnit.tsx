// src/contexts/WeatherContext.tsx
import React, { ReactNode, createContext, useContext, useState } from "react";

type TemperatureUnit = "Celsius" | "Fahrenheit";

export interface WeatherContextProps {
  temperatureUnit: TemperatureUnit;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
}

export const WeatherContext = createContext<WeatherContextProps>({
  temperatureUnit: "Celsius",
  setTemperatureUnit: () => {},
});

interface WeatherProviderProps {
  children: ReactNode;
}

export const WeatherProvider: React.FC<WeatherProviderProps> = ({
  children,
}) => {
  const [temperatureUnit, setTemperatureUnit] =
    useState<TemperatureUnit>("Celsius");

  const value: WeatherContextProps = {
    temperatureUnit,
    setTemperatureUnit,
  };

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
};

export const useWeatherContext = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeatherContext must be used within a WeatherProvider");
  }
  return context;
};
