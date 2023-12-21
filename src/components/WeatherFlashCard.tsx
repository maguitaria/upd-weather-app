import React from "react";
import { useWeatherContext } from "../contexts/TemperatureUnit";

interface WeatherFlashCardProps {
  day: string;
  maxTemperature: number;
  minTemperature: number;
  icon: string;
  description: string;
}

const WeatherFlashCard: React.FC<WeatherFlashCardProps> = ({
  day,
  maxTemperature,
  minTemperature,
  icon,
  description,
}) => {
  const { temperatureUnit } = useWeatherContext();
  // Display today or then day of week
  const today = new Date();
  const dateObjWeek = new Date(day);
  let displayText;

  if (
    dateObjWeek.getFullYear() === today.getFullYear() &&
    dateObjWeek.getMonth() === today.getMonth() &&
    dateObjWeek.getDate() === today.getDate()
  ) {
    // If they are equal, set displayText to "today"
    displayText = "Today";
  } else {
    // If they are not equal, format dateObjWeek as the weekday name
    displayText = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(dateObjWeek);
  }
  let displayDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(dateObjWeek);

  return (
    <div className="bg-light-blue p-4 shadow-md rounded-md ">
      <h2 className="lg:text-lg sm:text-xs md:text-md text-center font-bold mb-2">
        {displayText}
      </h2>
      <p className="text-gray-800 text-center">{displayDate}</p>
      <img alt="weather icon" src={icon} className="w-40 h-40 mx-auto mb-4" />
      <p className="font-bold text-gray-600 text-lg text-center">
        {description}
      </p>
      <div className="w-full h-1 bg-gray-400 my-2 bg-gray/40"></div>

      {/* Temperature values */}
      <div className="flex flex-row sm:flex-row justify-between text-xs mt-2">
        <p className="font-bold text-lg text-blue">
          {minTemperature.toFixed(0)}&deg;{temperatureUnit.charAt(0)}
        </p>
        <p className="font-bold text-lg text-red">
          {maxTemperature.toFixed(0)}&deg;{temperatureUnit.charAt(0)}
        </p>
      </div>
    </div>
  );
};

export default WeatherFlashCard;
