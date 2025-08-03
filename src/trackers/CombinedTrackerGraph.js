import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Import Firestore db
import { doc, getDoc } from "firebase/firestore"; // Firestore methods
import { Line } from "react-chartjs-2"; // Import Chart.js component
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const fetchTrackerData = async (monthKey, trackerType) => {
  try {
    const monthDocRef = doc(db, trackerType, monthKey);
    const monthDocSnap = await getDoc(monthDocRef);
    if (monthDocSnap.exists()) {
      return monthDocSnap.data();
    } else {
      console.log(`${trackerType} data for ${monthKey} not found.`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const MonthlyTrackerGraph = () => {
  const [trackerData, setTrackerData] = useState({ sleep: [], anxiety: [], stress: [] });
  const months = [
    { label: "Nov 2024", key: "nov_2024" },
    { label: "Dec 2024", key: "dec_2024" },
    { label: "Jan 2025", key: "jan_2025" },
    { label: "Feb 2025", key: "feb_2025" },
    // Add more months here as needed
  ];

  useEffect(() => {
    const fetchData = async () => {
      const sleepData = await Promise.all(months.map(month => fetchTrackerData(month.key, "sleepTracker")));
      const anxietyData = await Promise.all(months.map(month => fetchTrackerData(month.key, "anxietyTracker")));
      const stressData = await Promise.all(months.map(month => fetchTrackerData(month.key, "stressTracker")));
      
      // Process data to extract monthly averages (or any relevant value)
      setTrackerData({
        sleep: sleepData.map(item => item ? item.avgRating : 0), // Replace `avgRating` with the actual key you need
        anxiety: anxietyData.map(item => item ? item.avgRating : 0),
        stress: stressData.map(item => item ? item.avgRating : 0)
      });
    };

    fetchData();
  }, []);

  // Chart.js data structure
  const chartData = {
    labels: months.map(month => month.label), // Set month names as labels
    datasets: [
      {
        label: "Sleep",
        data: trackerData.sleep,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Anxiety",
        data: trackerData.anxiety,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Stress",
        data: trackerData.stress,
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Monthly Tracker Data (Sleep, Anxiety, Stress)",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "Rating",
        },
        min: 0,
        max: 10,
      },
    },
  };

  return (
    <div>
      <h2>Monthly Tracker Data</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MonthlyTrackerGraph;
