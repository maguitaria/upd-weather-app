import React, { useContext, useEffect, useState } from "react";
import { getWeeklyData } from "../axios/fetch";
import "chartjs-adapter-date-fns";
import { LocationContext } from "../contexts/LocationContext";
import { WeatherContext } from "../contexts/TemperatureUnit";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement,
  Legend,
  Tooltip,
  ChartData,
  TimeScale,
} from "chart.js";

const defaultOptions = {
  plugins: {
    legend: true,
  },
  scales: {
    y: {
      min: -20,
      max: 30,
      ticks: {
        stepSize: 2, // Adjust as needed
      },
      title: {
        display: true,
        text: "Temperature (°C)",
      },
    },
    x: {
      type: "time", // Use time axis
      time: {
        unit: "day", // Set the time unit to "day"
        displayFormats: {
          day: "EEE, MMM d", // Format for displaying both day and date
        },
        minUnit: "day", // Display a separator when a day ends
      },
      title: {
        display: true,
        text: "Week",
      },
      grid: {
        display: false,
      },
    },
  },
  elements: {
    line: {
      tension: 0.4, // smooth lines
    },
    area: {
      backgroundColor: "rgba(255, 255, 255, 0.8)", // Set the background color
    },
  },
  animations: {},
  responsive: true,
  maintainAspectRatio: false,
};

const WeatherChart: React.FC = () => {
  ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    TimeScale,
    Legend,
    Tooltip,
  );

  const { location } = useContext(LocationContext);
  const { temperatureUnit } = useContext(WeatherContext);

  const [options, setOptions] = useState(defaultOptions);
  const [chartData, setChartData] = useState<ChartData<
    "line",
    number[],
    unknown
  > | null>();
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      getWeeklyData(location.latitude, location.longitude).then((data) => {
        setChartData({
          labels: data.labels,
          datasets: data.datasets,
        });
      });
    }
  }, [location.latitude, location.longitude]);

  useEffect(() => {
    if (chartData) {
      // Create a deep clone of chartData to avoid directly mutating the state.
      let newDataset = chartData.datasets[0].data.map((val) =>
        temperatureUnit === "Celsius" ? val : (val * 9) / 5 + 32,
      );

      // Update the state with the new chart data.
      setDataset(newDataset);
    }

    // Clone the options object and update it.
    let newOptions = {
      ...options,
      scales: {
        ...options.scales,
        y: {
          ...options.scales.y,
          title: {
            ...options.scales.y.title,
            text: `Temperature (°${temperatureUnit.charAt(0)})`,
          },
        },
      },
    };
    // Update the state with the new options.
    setOptions(newOptions);
  }, [temperatureUnit, chartData]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">
        Hourly chart of weather in {location.county}
      </h2>
      {chartData ? (
        <div className="mx-auto flex h-96 flex-grow rounded-md bg-blue/20 p-4">
          <Line
            type="line"
            data={{
              ...chartData,
              datasets: [
                {
                  ...chartData.datasets[0],
                  data: dataset,
                },
              ],
            }}
            options={options}
          />
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default WeatherChart;
