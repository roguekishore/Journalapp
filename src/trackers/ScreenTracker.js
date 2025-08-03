import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Import Firestore db
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"; // Firestore methods
import "./ScreenTracker.css";

// Function to create year document if it doesn't exist
const createYearDocument = async (yearKey) => {
  try {
    const yearDocRef = doc(db, "screenTimeTracker", yearKey);
    const yearData = {};

    for (let month = 1; month <= 12; month++) {
      const daysInMonth = new Date(yearKey, month, 0).getDate();
      const monthData = Array.from({ length: daysInMonth }, () => ({
        screenTime: null,
      }));
      yearData[month] = monthData;
    }

    await setDoc(yearDocRef, yearData);
    console.log(`Created document for year: ${yearKey}`);
  } catch (error) {
    console.error("Error creating year document:", error);
  }
};

// Function to fetch year data from Firestore
const fetchYearData = async (yearKey, setYearData) => {
  try {
    const yearDocRef = doc(db, "screenTimeTracker", yearKey);
    const yearDocSnap = await getDoc(yearDocRef);

    if (yearDocSnap.exists()) {
      setYearData(yearDocSnap.data());
    } else {
      console.log("Year document not found. Creating new document...");
      createYearDocument(yearKey);
    }
  } catch (error) {
    console.error("Error fetching year data:", error);
  }
};

// Main ScreenTimeTracker component
const ScreenTimeTracker = () => {
  const [yearData, setYearData] = useState(null);
  const [yearKey, setYearKey] = useState(new Date().getFullYear().toString());
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    fetchYearData(yearKey, setYearData);
  }, [yearKey]);

  const handleCellClick = async (month, day) => {
    if (!yearData) return;

    const updatedYearData = { ...yearData };

    if (!updatedYearData[month]) {
      updatedYearData[month] = [];
    }

    if (!updatedYearData[month][day - 1]) {
      updatedYearData[month][day - 1] = { screenTime: null };
    }

    updatedYearData[month][day - 1].screenTime = selectedTime;
    setYearData(updatedYearData);

    try {
      const yearDocRef = doc(db, "screenTimeTracker", yearKey);

      await updateDoc(yearDocRef, {
        [`${month}.${day - 1}.screenTime`]: updatedYearData[month][day - 1].screenTime,
      });

      console.log(`Updated screen time for day ${day} of month ${month}`);
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleYearChange = (direction) => {
    const newYear = parseInt(yearKey, 10) + direction;
    setYearKey(newYear.toString());
  };

  const renderTable = () => {
    if (!yearData) return null;

    const rows = [];
    for (let month = 1; month <= 12; month++) {
      const daysInMonth = new Date(yearKey, month, 0).getDate();
      const cells = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const screenTime = yearData[month][day - 1]?.screenTime || null;
        const color = screenTime ? getColorForScreenTime(screenTime) : "transparent";
        cells.push(
          <td
            key={day}
            className="screen-time-tracker__cell"
            onClick={() => handleCellClick(month, day)}
            style={{ backgroundColor: color, cursor: "pointer" }}
          >
            {screenTime !== null ? `${screenTime}h` : ""}
          </td>
        );
      }
      rows.push(
        <tr key={month}>
          <td className="screen-time-tracker__month-label">
            {new Date(yearKey, month - 1).toLocaleString("default", { month: "short" })}
          </td>
          {cells}
        </tr>
      );
    }
    return rows;
  };

  const getColorForScreenTime = (time) => {
    if (time <= 1) return "#00FF00"; // Green for low screen time
    if (time <= 2) return "#33FF00"; // Yellow for moderate screen time
    if (time <= 3) return "#66FF00"; // Orange for high screen time
    if (time <= 4) return "#99FF00"; // Light Orange for increasing
    if (time <= 5) return "#FFFF00"; // Red-Orange for very high
    if (time <= 6) return "#FFCC00"; // Red for excessive
    if (time <= 7) return "#FF9900"; // Firebrick for intense
    if (time <= 8) return "#FF6600"; // Dark Red for extreme
    if (time <= 9) return "FF0000"; // Maroon for severe
    return "#CC0000"; // Dark Maroon for critical
  };
  

  return (
    <div className="screen-time-tracker__container">
      <h1 className="screen-time-tracker__header">Screen Time Tracker - {yearKey}</h1>
      <div className="screen-time-tracker__year-navigation">
        <button onClick={() => handleYearChange(-1)}>←</button>
        <button onClick={() => handleYearChange(1)}>→</button>
      </div>

      <div className="screen-time-tracker__time-palette">
        {[...Array(10).keys()].map((hour) => (
          <button
            key={hour + 1}
            className="screen-time-tracker__time"
            onClick={() => handleTimeSelect(hour + 1)}
          >
            {hour + 1}h
          </button>
        ))}
      </div>

      <div className="screen-time-tracker__content">
        <table className="screen-time-tracker__calendar">
          <thead>
            <tr>
              <th>Month</th>
              {Array.from({ length: 31 }, (_, i) => (
                <th key={i}>{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>{renderTable()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default ScreenTimeTracker;
